# CryptoManiac AI Trading Guardian - ML Backend

🛡️ Real-time ML-powered trading intelligence for cryptocurrencies.

## Features

- 🔮 **Price Predictions** - Prophet-powered forecasts
- 🟢🔴 **Buy/Sell Signals** - Multi-strategy analysis  
- ⚠️ **Trade Validation** - Warns before bad trades
- 🐋 **Whale Alerts** - Anomaly detection

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload

# Server runs at http://localhost:8000
```

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /health` | Health check |
| `GET /api/v1/coins` | List supported coins |
| `GET /api/v1/predict/{symbol}?days=7` | Price prediction |
| `GET /api/v1/signals/{symbol}` | Trading signals |
| `POST /api/v1/validate-trade` | Validate trade |
| `GET /api/v1/alerts/{symbol}` | Market alerts |

## API Docs

Visit http://localhost:8000/docs for interactive Swagger documentation.

## Data Sources (Free!)

- **Binance** - Primary (no API key needed)
- **CoinCap** - Fallback

## Binance Affiliate

Set your affiliate ID in `.env`:
```
BINANCE_AFFILIATE_ID=your_id
```
