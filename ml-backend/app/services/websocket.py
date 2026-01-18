"""
WebSocket Manager for Real-time Streaming
Provides live price updates and signals every second
"""
import asyncio
import json
from typing import Dict, Set
from fastapi import WebSocket, WebSocketDisconnect
import httpx
from datetime import datetime

from ..config import get_settings
from ..models.signals import SignalGenerator


# CoinGecko ID to Symbol mapping (same as routes.py)
COIN_ID_TO_SYMBOL = {
    "bitcoin": "BTC",
    "ethereum": "ETH",
    "binancecoin": "BNB",
    "ripple": "XRP",
    "cardano": "ADA",
    "solana": "SOL",
    "dogecoin": "DOGE",
    "polkadot": "DOT",
    "shiba-inu": "SHIB",
    "litecoin": "LTC",
}


def normalize_symbol(input_symbol: str) -> str:
    """Convert CoinGecko ID to Binance symbol"""
    lower = input_symbol.lower()
    if lower in COIN_ID_TO_SYMBOL:
        return COIN_ID_TO_SYMBOL[lower]
    return input_symbol.upper()


class ConnectionManager:
    """Manages WebSocket connections"""
    
    def __init__(self):
        self.active_connections: Dict[str, Set[WebSocket]] = {}
        self.signal_gen = SignalGenerator()
    
    async def connect(self, websocket: WebSocket, symbol: str):
        """Connect a client to a symbol stream"""
        await websocket.accept()
        if symbol not in self.active_connections:
            self.active_connections[symbol] = set()
        self.active_connections[symbol].add(websocket)
    
    def disconnect(self, websocket: WebSocket, symbol: str):
        """Disconnect a client"""
        if symbol in self.active_connections:
            self.active_connections[symbol].discard(websocket)
    
    async def broadcast(self, symbol: str, data: dict):
        """Broadcast data to all clients watching a symbol"""
        if symbol in self.active_connections:
            dead_connections = set()
            for connection in self.active_connections[symbol]:
                try:
                    await connection.send_json(data)
                except Exception:
                    dead_connections.add(connection)
            
            # Clean up dead connections
            for conn in dead_connections:
                self.active_connections[symbol].discard(conn)


class RealTimeStreamer:
    """
    Streams real-time price updates and signals.
    Uses Binance WebSocket for live data.
    """
    
    def __init__(self):
        settings = get_settings()
        self.binance_ws_url = settings.BINANCE_WS_URL
        self.manager = ConnectionManager()
        self._running_streams: Dict[str, asyncio.Task] = {}
    
    async def get_live_price(self, symbol: str) -> dict:
        """Get current price from Binance REST API"""
        normalized = normalize_symbol(symbol)
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"https://api.binance.com/api/v3/ticker/24hr",
                    params={"symbol": f"{normalized}USDT"}
                )
                data = response.json()
                
                return {
                    "symbol": symbol.upper(),
                    "price": float(data["lastPrice"]),
                    "price_change_24h": float(data["priceChangePercent"]),
                    "high_24h": float(data["highPrice"]),
                    "low_24h": float(data["lowPrice"]),
                    "volume_24h": float(data["volume"]),
                    "timestamp": datetime.now().isoformat()
                }
        except Exception as e:
            return {"error": str(e)}
    
    async def stream_prices(self, websocket: WebSocket, symbol: str):
        """
        Stream live prices to a client.
        Updates every 2 seconds with price + quick signal.
        """
        await self.manager.connect(websocket, symbol)
        
        try:
            while True:
                # Get live price
                price_data = await self.get_live_price(symbol)
                
                if "error" not in price_data:
                    # Add quick signal based on 24h change
                    change = price_data["price_change_24h"]
                    if change > 2:
                        signal = "BUY"
                        signal_emoji = "🟢"
                    elif change < -2:
                        signal = "SELL"
                        signal_emoji = "🔴"
                    else:
                        signal = "HOLD"
                        signal_emoji = "🟡"
                    
                    price_data["signal"] = signal
                    price_data["signal_emoji"] = signal_emoji
                    price_data["message"] = f"{signal_emoji} {symbol.upper()}: ${price_data['price']:,.2f} ({change:+.2f}%)"
                
                await websocket.send_json(price_data)
                await asyncio.sleep(2)  # Update every 2 seconds
                
        except WebSocketDisconnect:
            self.manager.disconnect(websocket, symbol)
        except Exception as e:
            print(f"Stream error: {e}")
            self.manager.disconnect(websocket, symbol)


# Global instance
streamer = RealTimeStreamer()
