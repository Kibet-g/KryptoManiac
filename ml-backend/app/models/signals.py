"""
Trading Signal Generator - Combines multiple strategies
User-friendly signals with warnings and risk assessment
"""
import numpy as np
from datetime import datetime
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

from ..providers.base import PriceData


class TradeValidation(BaseModel):
    """Trade validation result"""
    is_good_trade: bool
    warning: Optional[str] = None
    recommendation: str
    risk_level: str


class MarketAlert(BaseModel):
    """Market anomaly alert"""
    type: str  # WHALE, VOLATILITY, TREND_REVERSAL
    severity: str  # INFO, WARNING, DANGER
    message: str
    should_pause: bool


class SignalGenerator:
    """
    Multi-strategy signal generator.
    Combines technical indicators with anomaly detection.
    
    Strategies:
    1. Trend Following (Moving Averages)
    2. Mean Reversion (RSI)
    3. Momentum (MACD-like)
    4. Volatility Detection
    5. Anomaly Detection (unusual price movements)
    """
    
    def __init__(self):
        pass
    
    def generate_signals(
        self, 
        prices: List[PriceData]
    ) -> Dict[str, Any]:
        """Generate comprehensive trading signals"""
        if len(prices) < 30:
            return {"error": "Need at least 30 data points"}
        
        closes = [p.close for p in prices]
        
        # Calculate indicators
        trend_signal = self._trend_signal(closes)
        rsi_signal = self._rsi_signal(closes)
        momentum_signal = self._momentum_signal(closes)
        volatility = self._calculate_volatility(closes)
        
        # Combine signals (weighted average)
        weights = {"trend": 0.4, "rsi": 0.3, "momentum": 0.3}
        combined_score = (
            trend_signal * weights["trend"] +
            rsi_signal * weights["rsi"] +
            momentum_signal * weights["momentum"]
        )
        
        # Generate final signal
        if combined_score > 0.5:
            signal = "BUY"
            strength = "STRONG" if combined_score > 0.7 else "MODERATE"
        elif combined_score < -0.5:
            signal = "SELL"
            strength = "STRONG" if combined_score < -0.7 else "MODERATE"
        else:
            signal = "HOLD"
            strength = "NEUTRAL"
        
        return {
            "signal": signal,
            "strength": strength,
            "score": round(combined_score, 2),
            "indicators": {
                "trend": round(trend_signal, 2),
                "rsi": round(rsi_signal, 2),
                "momentum": round(momentum_signal, 2),
                "volatility": round(volatility, 2)
            },
            "risk_level": self._risk_from_volatility(volatility)
        }
    
    def validate_trade(
        self,
        action: str,  # BUY or SELL
        prices: List[PriceData],
        amount: Optional[float] = None
    ) -> TradeValidation:
        """
        Validate if a planned trade is a good idea.
        WARNS users before they make mistakes!
        """
        signals = self.generate_signals(prices)
        
        if "error" in signals:
            return TradeValidation(
                is_good_trade=False,
                warning="Insufficient data to validate trade",
                recommendation="Wait for more market data",
                risk_level="UNKNOWN"
            )
        
        current_signal = signals["signal"]
        risk = signals["risk_level"]
        
        # Check if trade aligns with signals
        if action == "BUY" and current_signal == "SELL":
            return TradeValidation(
                is_good_trade=False,
                warning="⚠️ BAD TIMING! Market shows bearish signals.",
                recommendation="Consider waiting or reducing position size",
                risk_level=risk
            )
        elif action == "SELL" and current_signal == "BUY":
            return TradeValidation(
                is_good_trade=False,
                warning="⚠️ BAD TIMING! Market shows bullish signals.",
                recommendation="Consider holding - potential upside detected",
                risk_level=risk
            )
        elif risk == "HIGH":
            return TradeValidation(
                is_good_trade=True,
                warning="⚠️ High volatility detected. Trade with caution.",
                recommendation="Use smaller position size",
                risk_level=risk
            )
        else:
            return TradeValidation(
                is_good_trade=True,
                warning=None,
                recommendation=f"Trade aligns with {current_signal} signal ✓",
                risk_level=risk
            )
    
    def detect_anomalies(
        self, 
        prices: List[PriceData]
    ) -> List[MarketAlert]:
        """
        Detect market anomalies that should trigger PAUSE warnings.
        """
        alerts = []
        
        if len(prices) < 10:
            return alerts
        
        closes = [p.close for p in prices]
        volumes = [p.volume for p in prices if p.volume > 0]
        
        # 1. Unusual price movement
        recent_change = (closes[-1] - closes[-2]) / closes[-2] * 100
        if abs(recent_change) > 5:
            alerts.append(MarketAlert(
                type="VOLATILITY",
                severity="WARNING",
                message=f"Unusual price movement: {recent_change:+.1f}% in last period",
                should_pause=abs(recent_change) > 10
            ))
        
        # 2. Volume spike (whale activity indicator)
        if volumes:
            avg_volume = np.mean(volumes[-20:]) if len(volumes) >= 20 else np.mean(volumes)
            recent_volume = volumes[-1] if volumes else 0
            
            if recent_volume > avg_volume * 3:
                alerts.append(MarketAlert(
                    type="WHALE",
                    severity="WARNING",
                    message="🐋 Unusual volume detected! Possible whale activity.",
                    should_pause=True
                ))
        
        # 3. Trend reversal detection
        if len(closes) >= 20:
            short_ma = np.mean(closes[-7:])
            long_ma = np.mean(closes[-20:])
            prev_short = np.mean(closes[-8:-1])
            prev_long = np.mean(closes[-21:-1])
            
            # Golden cross / Death cross
            if prev_short < prev_long and short_ma > long_ma:
                alerts.append(MarketAlert(
                    type="TREND_REVERSAL",
                    severity="INFO",
                    message="📈 Bullish crossover detected!",
                    should_pause=False
                ))
            elif prev_short > prev_long and short_ma < long_ma:
                alerts.append(MarketAlert(
                    type="TREND_REVERSAL",
                    severity="DANGER",
                    message="📉 Bearish crossover detected! Consider pausing buys.",
                    should_pause=True
                ))
        
        return alerts
    
    def _trend_signal(self, closes: List[float]) -> float:
        """Moving average trend signal (-1 to 1)"""
        if len(closes) < 20:
            return 0
        
        short_ma = np.mean(closes[-7:])
        long_ma = np.mean(closes[-20:])
        
        # Normalize to -1 to 1 range
        trend = (short_ma - long_ma) / long_ma
        return max(-1, min(1, trend * 10))
    
    def _rsi_signal(self, closes: List[float], period: int = 14) -> float:
        """RSI-based signal (-1 to 1)"""
        if len(closes) < period + 1:
            return 0
        
        deltas = np.diff(closes[-period-1:])
        gains = np.where(deltas > 0, deltas, 0)
        losses = np.where(deltas < 0, -deltas, 0)
        
        avg_gain = np.mean(gains) if len(gains) > 0 else 0
        avg_loss = np.mean(losses) if len(losses) > 0 else 0
        
        if avg_loss == 0:
            rsi = 100
        else:
            rs = avg_gain / avg_loss
            rsi = 100 - (100 / (1 + rs))
        
        # Convert RSI to signal: <30 = oversold (buy), >70 = overbought (sell)
        if rsi < 30:
            return (30 - rsi) / 30  # Positive = buy
        elif rsi > 70:
            return -(rsi - 70) / 30  # Negative = sell
        else:
            return 0
    
    def _momentum_signal(self, closes: List[float]) -> float:
        """Simple momentum signal (-1 to 1)"""
        if len(closes) < 10:
            return 0
        
        # Rate of change
        roc = (closes[-1] - closes[-10]) / closes[-10]
        return max(-1, min(1, roc * 5))
    
    def _calculate_volatility(self, closes: List[float]) -> float:
        """Calculate volatility as percentage"""
        if len(closes) < 2:
            return 0
        
        returns = np.diff(closes) / closes[:-1]
        return float(np.std(returns) * 100)
    
    def _risk_from_volatility(self, volatility: float) -> str:
        """Convert volatility to risk level"""
        if volatility > 5:
            return "HIGH"
        elif volatility > 2:
            return "MEDIUM"
        else:
            return "LOW"
