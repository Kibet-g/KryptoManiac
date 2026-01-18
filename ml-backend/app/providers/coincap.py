"""
CoinCap Data Provider - SECONDARY data source (free, no API key!)
"""
import httpx
from datetime import datetime
from typing import List
from cachetools import TTLCache

from .base import DataProvider, PriceData, CoinInfo
from ..config import get_settings


class CoinCapProvider(DataProvider):
    """
    CoinCap.io API provider.
    Free, no API key required!
    Good fallback when Binance is unavailable.
    """
    
    def __init__(self):
        settings = get_settings()
        self.base_url = settings.COINCAP_BASE_URL
        self._cache = TTLCache(maxsize=100, ttl=60)
    
    @property
    def name(self) -> str:
        return "CoinCap"
    
    async def get_historical_prices(
        self, 
        symbol: str, 
        days: int = 365,
        interval: str = "d1"
    ) -> List[PriceData]:
        """
        Get historical price data from CoinCap.
        Note: CoinCap uses coin IDs like 'bitcoin', 'ethereum'
        """
        cache_key = f"hist_{symbol}_{days}_{interval}"
        if cache_key in self._cache:
            return self._cache[cache_key]
        
        # Map interval format
        interval_map = {"1d": "d1", "1h": "h1", "1m": "m1"}
        api_interval = interval_map.get(interval, interval)
        
        # Calculate time range
        end_time = int(datetime.now().timestamp() * 1000)
        start_time = end_time - (days * 24 * 60 * 60 * 1000)
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/assets/{symbol.lower()}/history",
                params={
                    "interval": api_interval,
                    "start": start_time,
                    "end": end_time
                }
            )
            response.raise_for_status()
            data = response.json()
        
        prices = []
        for point in data.get("data", []):
            price = float(point["priceUsd"])
            prices.append(PriceData(
                timestamp=datetime.fromtimestamp(point["time"] / 1000),
                open=price,
                high=price,
                low=price,
                close=price,
                volume=0  # CoinCap history doesn't include volume
            ))
        
        self._cache[cache_key] = prices
        return prices
    
    async def get_current_price(self, symbol: str) -> float:
        """Get current price for a coin"""
        cache_key = f"price_{symbol}"
        if cache_key in self._cache:
            return self._cache[cache_key]
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/assets/{symbol.lower()}"
            )
            response.raise_for_status()
            data = response.json()
        
        price = float(data["data"]["priceUsd"])
        self._cache[cache_key] = price
        return price
    
    async def get_supported_coins(self) -> List[CoinInfo]:
        """Get list of supported coins"""
        cache_key = "coins_list"
        if cache_key in self._cache:
            return self._cache[cache_key]
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/assets",
                params={"limit": 100}
            )
            response.raise_for_status()
            data = response.json()
        
        coins = []
        for asset in data.get("data", []):
            coins.append(CoinInfo(
                id=asset["id"],
                symbol=asset["symbol"],
                name=asset["name"],
                current_price=float(asset["priceUsd"] or 0),
                price_change_24h=float(asset["changePercent24Hr"] or 0),
                volume_24h=float(asset["volumeUsd24Hr"] or 0),
                market_cap=float(asset["marketCapUsd"] or 0)
            ))
        
        self._cache[cache_key] = coins
        return coins
    
    async def health_check(self) -> bool:
        """Check if CoinCap API is available"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(f"{self.base_url}/assets/bitcoin")
                return response.status_code == 200
        except Exception:
            return False
