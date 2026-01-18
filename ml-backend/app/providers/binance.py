"""
Binance Data Provider - PRIMARY data source (free, no API key!)
"""
import httpx
from datetime import datetime
from typing import List, Optional
from cachetools import TTLCache

from .base import DataProvider, PriceData, CoinInfo
from ..config import get_settings


class BinanceProvider(DataProvider):
    """
    Binance public API provider.
    Free, no authentication required for market data!
    """
    
    def __init__(self):
        settings = get_settings()
        self.base_url = settings.BINANCE_BASE_URL
        self._cache = TTLCache(maxsize=100, ttl=60)
    
    @property
    def name(self) -> str:
        return "Binance"
    
    async def get_historical_prices(
        self, 
        symbol: str, 
        days: int = 365,
        interval: str = "1d"
    ) -> List[PriceData]:
        """
        Get historical OHLCV data from Binance.
        Symbol format: BTCUSDT, ETHUSDT, etc.
        """
        cache_key = f"hist_{symbol}_{days}_{interval}"
        if cache_key in self._cache:
            return self._cache[cache_key]
        
        # Convert days to limit (max 1000 per request)
        limit = min(days, 1000)
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/klines",
                params={
                    "symbol": symbol.upper(),
                    "interval": interval,
                    "limit": limit
                }
            )
            response.raise_for_status()
            data = response.json()
        
        prices = []
        for candle in data:
            prices.append(PriceData(
                timestamp=datetime.fromtimestamp(candle[0] / 1000),
                open=float(candle[1]),
                high=float(candle[2]),
                low=float(candle[3]),
                close=float(candle[4]),
                volume=float(candle[5])
            ))
        
        self._cache[cache_key] = prices
        return prices
    
    async def get_current_price(self, symbol: str) -> float:
        """Get current price for a symbol"""
        cache_key = f"price_{symbol}"
        if cache_key in self._cache:
            return self._cache[cache_key]
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/ticker/price",
                params={"symbol": symbol.upper()}
            )
            response.raise_for_status()
            data = response.json()
        
        price = float(data["price"])
        self._cache[cache_key] = price
        return price
    
    async def get_supported_coins(self) -> List[CoinInfo]:
        """Get list of supported trading pairs"""
        cache_key = "coins_list"
        if cache_key in self._cache:
            return self._cache[cache_key]
        
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{self.base_url}/ticker/24hr")
            response.raise_for_status()
            data = response.json()
        
        # Filter for USDT pairs (most common)
        coins = []
        for ticker in data:
            if ticker["symbol"].endswith("USDT"):
                symbol = ticker["symbol"].replace("USDT", "")
                coins.append(CoinInfo(
                    id=symbol.lower(),
                    symbol=symbol,
                    name=symbol,
                    current_price=float(ticker["lastPrice"]),
                    price_change_24h=float(ticker["priceChangePercent"]),
                    volume_24h=float(ticker["volume"])
                ))
        
        # Sort by volume
        coins.sort(key=lambda x: x.volume_24h, reverse=True)
        self._cache[cache_key] = coins[:100]  # Top 100
        return coins[:100]
    
    async def health_check(self) -> bool:
        """Check if Binance API is available"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(f"{self.base_url}/ping")
                return response.status_code == 200
        except Exception:
            return False
