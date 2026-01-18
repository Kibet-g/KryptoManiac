"""
API Routes for CryptoManiac AI Trading Guardian
"""
from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from pydantic import BaseModel

from ..providers import BinanceProvider, CoinCapProvider
from ..models import PricePredictor, SignalGenerator
from ..config import get_settings

router = APIRouter()

# Initialize components
binance = BinanceProvider()
coincap = CoinCapProvider()
predictor = PricePredictor()
signal_gen = SignalGenerator()


# Common CoinGecko ID to Binance Symbol mapping
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
    "avalanche-2": "AVAX",
    "chainlink": "LINK",
    "polygon": "MATIC",
    "uniswap": "UNI",
    "stellar": "XLM",
    "tron": "TRX",
    "monero": "XMR",
    "bitcoin-cash": "BCH",
    "fantom": "FTM",
    "near-protocol": "NEAR",
    "cosmos": "ATOM",
    "algorand": "ALGO",
    "vechain": "VET",
    "internet-computer": "ICP",
    "filecoin": "FIL",
    "theta-token": "THETA",
    "sand": "SAND",
    "mana": "MANA",
    "axie-infinity": "AXS",
    "the-graph": "GRT",
    "aave": "AAVE",
    "eos": "EOS",
    "tezos": "XTZ",
    "elrond-erd-2": "EGLD",
    "quant-network": "QNT",
}



def normalize_symbol(input_symbol: str) -> str:
    """Convert CoinGecko ID or symbol to Binance symbol format"""
    lower = input_symbol.lower()
    # Check if it's a known ID
    if lower in COIN_ID_TO_SYMBOL:
        return COIN_ID_TO_SYMBOL[lower]
    # Already a symbol or unknown - return uppercase
    return input_symbol.upper()


# Request/Response Models
class TradeValidationRequest(BaseModel):
    action: str  # BUY or SELL
    symbol: str
    amount: Optional[float] = None


# ============= ENDPOINTS =============

@router.get("/coins")
async def get_coins(limit: int = Query(default=50, le=100)):
    """Get list of supported coins"""
    try:
        coins = await binance.get_supported_coins()
        return {"coins": coins[:limit], "provider": "binance"}
    except Exception:
        # Fallback to CoinCap
        coins = await coincap.get_supported_coins()
        return {"coins": coins[:limit], "provider": "coincap"}


@router.get("/price/{symbol}")
async def get_price(symbol: str):
    """Get current price for a symbol"""
    try:
        # Try Binance first (BTCUSDT format)
        price = await binance.get_current_price(f"{symbol.upper()}USDT")
        return {"symbol": symbol, "price": price, "provider": "binance"}
    except Exception:
        # Fallback to CoinCap (bitcoin format)
        price = await coincap.get_current_price(symbol.lower())
        return {"symbol": symbol, "price": price, "provider": "coincap"}


@router.get("/predict/{symbol}")
async def get_prediction(
    symbol: str,
    days: int = Query(default=7, ge=1, le=30)
):
    """
    Get AI-powered price prediction.
    Accepts both CoinGecko IDs (bitcoin) and symbols (btc).
    """
    # Normalize to Binance symbol format
    normalized = normalize_symbol(symbol)
    
    try:
        # Get historical data
        try:
            prices = await binance.get_historical_prices(
                f"{normalized}USDT", 
                days=365
            )
            provider = "binance"
        except Exception:
            prices = await coincap.get_historical_prices(symbol.lower(), days=365)
            provider = "coincap"
        
        if not prices:
            raise HTTPException(status_code=404, detail="No price data found")
        
        # Generate prediction
        prediction = await predictor.predict(prices, days_ahead=days)
        prediction["symbol"] = normalized
        prediction["provider"] = provider
        
        return prediction
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/signals/{symbol}")
async def get_signals(symbol: str):
    """
    Get real-time trading signals from multiple strategies.
    Accepts both CoinGecko IDs and symbols.
    """
    normalized = normalize_symbol(symbol)
    
    try:
        try:
            prices = await binance.get_historical_prices(
                f"{normalized}USDT",
                days=30
            )
        except Exception:
            prices = await coincap.get_historical_prices(symbol.lower(), days=30)
        
        signals = signal_gen.generate_signals(prices)
        signals["symbol"] = normalized
        
        return signals
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/validate-trade")
async def validate_trade(request: TradeValidationRequest):
    """
    Validate if a planned trade is a good idea.
    WARNS users before they make mistakes!
    """
    normalized = normalize_symbol(request.symbol)
    
    try:
        try:
            prices = await binance.get_historical_prices(
                f"{normalized}USDT",
                days=30
            )
        except Exception:
            prices = await coincap.get_historical_prices(
                request.symbol.lower(), 
                days=30
            )
        
        validation = signal_gen.validate_trade(
            action=request.action.upper(),
            prices=prices,
            amount=request.amount
        )
        
        return {
            "symbol": normalized,
            "action": request.action.upper(),
            **validation.model_dump()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/alerts/{symbol}")
async def get_market_alerts(symbol: str):
    """
    Get market anomaly alerts.
    Tells users when to PAUSE trading!
    """
    normalized = normalize_symbol(symbol)
    
    try:
        try:
            prices = await binance.get_historical_prices(
                f"{normalized}USDT",
                days=7,
                interval="1h"
            )
        except Exception:
            prices = await coincap.get_historical_prices(
                symbol.lower(),
                days=7,
                interval="h1"
            )
        
        alerts = signal_gen.detect_anomalies(prices)
        
        # Check if any alerts require pausing
        should_pause = any(a.should_pause for a in alerts)
        
        return {
            "symbol": normalized,
            "alerts": [a.model_dump() for a in alerts],
            "should_pause_trading": should_pause,
            "alert_count": len(alerts)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/providers")
async def get_providers():
    """Check which data providers are available"""
    settings = get_settings()
    
    binance_ok = await binance.health_check()
    coincap_ok = await coincap.health_check()
    
    return {
        "providers": [
            {"name": "Binance", "status": "online" if binance_ok else "offline"},
            {"name": "CoinCap", "status": "online" if coincap_ok else "offline"}
        ],
        "binance_affiliate_id": settings.BINANCE_AFFILIATE_ID or None
    }
