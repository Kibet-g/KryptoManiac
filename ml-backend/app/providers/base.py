"""
Base data provider interface - allows swapping APIs easily
"""
from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from datetime import datetime
from pydantic import BaseModel


class PriceData(BaseModel):
    """Standard price data format"""
    timestamp: datetime
    open: float
    high: float
    low: float
    close: float
    volume: float


class CoinInfo(BaseModel):
    """Standard coin information"""
    id: str
    symbol: str
    name: str
    current_price: float
    price_change_24h: float
    volume_24h: float
    market_cap: Optional[float] = None


class DataProvider(ABC):
    """
    Abstract base class for data providers.
    Implement this to add new data sources (future-proof!)
    """
    
    @property
    @abstractmethod
    def name(self) -> str:
        """Provider name"""
        pass
    
    @abstractmethod
    async def get_historical_prices(
        self, 
        symbol: str, 
        days: int = 365,
        interval: str = "1d"
    ) -> List[PriceData]:
        """Get historical OHLCV data"""
        pass
    
    @abstractmethod
    async def get_current_price(self, symbol: str) -> float:
        """Get current price"""
        pass
    
    @abstractmethod
    async def get_supported_coins(self) -> List[CoinInfo]:
        """Get list of supported coins"""
        pass
    
    @abstractmethod
    async def health_check(self) -> bool:
        """Check if provider is available"""
        pass
