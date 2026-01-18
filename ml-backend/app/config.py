"""
Configuration settings for CryptoManiac ML Backend
"""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings"""
    
    # App
    APP_NAME: str = "CryptoManiac AI Trading Guardian"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # CORS
    CORS_ORIGINS: list = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    # Data Providers (all free, no API keys needed!)
    BINANCE_BASE_URL: str = "https://api.binance.com/api/v3"
    BINANCE_WS_URL: str = "wss://stream.binance.com:9443/ws"
    COINCAP_BASE_URL: str = "https://api.coincap.io/v2"
    COINGECKO_BASE_URL: str = "https://api.coingecko.com/api/v3"
    
    # Cache settings
    CACHE_TTL_SECONDS: int = 60
    CACHE_MAX_SIZE: int = 1000
    
    # ML settings
    PREDICTION_DAYS_DEFAULT: int = 7
    PREDICTION_DAYS_MAX: int = 30
    
    # Binance Affiliate (user configures this)
    BINANCE_AFFILIATE_ID: str = ""
    
    class Config:
        env_file = ".env"
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()
