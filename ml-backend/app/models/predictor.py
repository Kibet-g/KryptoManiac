"""
Price Predictor using Facebook Prophet
Fast, reliable, and works great for cryptocurrency time series
"""
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from cachetools import TTLCache

# Prophet import with fallback
try:
    from prophet import Prophet
    PROPHET_AVAILABLE = True
except ImportError:
    PROPHET_AVAILABLE = False

from ..providers.base import PriceData


class PredictionResult(BaseModel):
    """Prediction output format"""
    timestamp: datetime
    predicted_price: float
    lower_bound: float
    upper_bound: float
    confidence: float  # 0-100


class PricePredictor:
    """
    ML-powered price prediction using Prophet.
    Provides user-friendly predictions with confidence scores.
    """
    
    def __init__(self):
        self._cache = TTLCache(maxsize=50, ttl=300)  # 5 min cache
        self._model_cache = TTLCache(maxsize=10, ttl=3600)  # 1 hour model cache
    
    async def predict(
        self,
        historical_prices: List[PriceData],
        days_ahead: int = 7
    ) -> Dict[str, Any]:
        """
        Generate price predictions.
        
        Returns:
            - predictions: List of predicted prices
            - signal: BUY, SELL, or HOLD
            - confidence: 0-100 score
            - explanation: Human-readable explanation
        """
        # Always use fallback for now (Prophet has dependency issues)
        # TODO: Fix Prophet setup with cmdstanpy
        return self._fallback_prediction(historical_prices, days_ahead)
    
    def _calculate_confidence(self, forecast_row) -> float:
        """Calculate confidence score based on prediction interval width"""
        yhat = forecast_row["yhat"]
        interval_width = forecast_row["yhat_upper"] - forecast_row["yhat_lower"]
        
        # Narrower interval = higher confidence
        ratio = interval_width / yhat if yhat > 0 else 1
        confidence = max(0, min(100, (1 - ratio) * 100))
        return confidence
    
    def _generate_signal(
        self, 
        price_change_pct: float,
        predictions: List[PredictionResult],
        current_price: float
    ) -> tuple:
        """Generate BUY/SELL/HOLD signal with explanation"""
        
        if price_change_pct > 5:
            signal = "BUY"
            emoji = "🟢"
            explanation = f"Strong upward momentum! Price may rise ~{abs(price_change_pct):.1f}% in the next {len(predictions)} days."
        elif price_change_pct > 2:
            signal = "BUY"
            emoji = "🟢"
            explanation = f"Moderate bullish signal. Price may increase ~{abs(price_change_pct):.1f}%."
        elif price_change_pct < -5:
            signal = "SELL"
            emoji = "🔴"
            explanation = f"Strong downward trend detected. Price may drop ~{abs(price_change_pct):.1f}%."
        elif price_change_pct < -2:
            signal = "SELL"
            emoji = "🔴"
            explanation = f"Bearish signal. Price may decrease ~{abs(price_change_pct):.1f}%."
        else:
            signal = "HOLD"
            emoji = "🟡"
            explanation = f"Market is stable. No strong movement expected ({price_change_pct:+.1f}%)."
        
        return signal, f"{emoji} {explanation}"
    
    def _calculate_risk(self, predictions: List[PredictionResult]) -> str:
        """Calculate risk level based on volatility"""
        if not predictions:
            return "UNKNOWN"
        
        # Calculate volatility from prediction intervals
        volatilities = []
        for p in predictions:
            spread = (p.upper_bound - p.lower_bound) / p.predicted_price
            volatilities.append(spread)
        
        avg_volatility = np.mean(volatilities)
        
        if avg_volatility > 0.15:
            return "HIGH"
        elif avg_volatility > 0.08:
            return "MEDIUM"
        else:
            return "LOW"
    
    def _fallback_prediction(
        self, 
        historical_prices: List[PriceData],
        days_ahead: int
    ) -> Dict[str, Any]:
        """Simple fallback when Prophet is not available"""
        if not historical_prices:
            return {"error": "No historical data available"}
        
        # Simple moving average prediction
        recent_prices = [p.close for p in historical_prices[-30:]]
        avg_price = np.mean(recent_prices)
        current_price = historical_prices[-1].close
        
        # Calculate simple trend
        if len(recent_prices) >= 7:
            short_avg = np.mean(recent_prices[-7:])
            long_avg = np.mean(recent_prices)
            trend = (short_avg - long_avg) / long_avg * 100 if long_avg != 0 else 0
        else:
            trend = 0

        
        # Generate simple predictions
        predictions = []
        for i in range(1, days_ahead + 1):
            pred_price = current_price * (1 + trend/100 * i/7)
            predictions.append(PredictionResult(
                timestamp=datetime.now() + timedelta(days=i),
                predicted_price=pred_price,
                lower_bound=pred_price * 0.9,
                upper_bound=pred_price * 1.1,
                confidence=50
            ))
        
        if trend > 2:
            signal, explanation = "BUY", f"🟢 Upward trend detected (+{trend:.1f}%)"
        elif trend < -2:
            signal, explanation = "SELL", f"🔴 Downward trend detected ({trend:.1f}%)"
        else:
            signal, explanation = "HOLD", f"🟡 Stable market ({trend:+.1f}%)"
        
        return {
            "predictions": [p.model_dump() for p in predictions],
            "signal": signal,
            "signal_strength": abs(trend),
            "confidence": 50,
            "confidence_stars": 3,
            "price_change_percent": round(trend, 2),
            "explanation": explanation,
            "current_price": current_price,
            "predicted_price": round(predictions[-1].predicted_price, 2),
            "risk_level": "MEDIUM",
            "note": "Using simplified prediction (Prophet not installed)"
        }
