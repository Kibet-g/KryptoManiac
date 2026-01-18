"""
CryptoManiac AI Trading Guardian - FastAPI Main Server
Real-time ML signals, predictions, and trade validation
"""
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .config import get_settings
from .api import router
from .services.websocket import streamer
from .blockchain import blockchain_tracker


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    settings = get_settings()
    print(f"🚀 Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    print("📊 Data Providers: Binance (primary), CoinCap (fallback)")
    print("🤖 ML Models: Prophet, Multi-Strategy Signals")
    print("⚡ WebSocket: Real-time streaming enabled")
    print("🐋 Blockchain: Whale tracking active")
    yield
    print("👋 Shutting down...")


# Create FastAPI app
settings = get_settings()
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="""
    ## 🛡️ AI Trading Guardian
    
    Real-time ML-powered trading intelligence for cryptocurrencies.
    
    ### Features:
    - 🔮 **Price Predictions** - Prophet-powered forecasts
    - 🟢🔴 **Buy/Sell Signals** - Multi-strategy analysis
    - ⚠️ **Trade Validation** - Warns before bad trades
    - 🐋 **Whale Alerts** - Blockchain tracking
    - ⚡ **Real-time Streaming** - WebSocket updates
    
    ### Free Data Sources:
    - Binance (primary)
    - CoinCap (fallback)
    - Blockchain explorers
    
    **No API keys required!**
    """,
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for WebSocket compatibility
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "features": ["predictions", "signals", "websocket", "blockchain"]
    }


# WebSocket endpoint for real-time streaming
@app.websocket("/ws/{symbol}")
async def websocket_endpoint(websocket: WebSocket, symbol: str):
    """
    Real-time price streaming via WebSocket.
    Connect to: ws://localhost:8000/ws/btc
    """
    await streamer.stream_prices(websocket, symbol)


# Blockchain whale tracking
@app.get("/api/v1/whales/{symbol}")
async def get_whales(symbol: str):
    """Get whale activity for a coin"""
    return await blockchain_tracker.get_whale_summary(symbol)


# Include API routes
app.include_router(router, prefix="/api/v1")


# Run with: uvicorn app.main:app --reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

