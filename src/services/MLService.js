/**
 * ML API Service for CryptoManiac AI Trading Guardian
 * Connects React frontend to Python ML backend
 */

const ML_API_BASE = process.env.REACT_APP_ML_API_URL || 'http://localhost:8000';

/**
 * Get price prediction with AI signals
 */
export const getPrediction = async (symbol, days = 7) => {
  try {
    const response = await fetch(
      `${ML_API_BASE}/api/v1/predict/${symbol}?days=${days}`
    );
    if (!response.ok) throw new Error('Prediction failed');
    return await response.json();
  } catch (error) {
    console.error('Prediction error:', error);
    return null;
  }
};

/**
 * Get real-time trading signals
 */
export const getSignals = async (symbol) => {
  try {
    const response = await fetch(
      `${ML_API_BASE}/api/v1/signals/${symbol}`
    );
    if (!response.ok) throw new Error('Signals failed');
    return await response.json();
  } catch (error) {
    console.error('Signals error:', error);
    return null;
  }
};

/**
 * Validate a trade before execution
 */
export const validateTrade = async (symbol, action, amount = null) => {
  try {
    const response = await fetch(`${ML_API_BASE}/api/v1/validate-trade`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol, action, amount })
    });
    if (!response.ok) throw new Error('Validation failed');
    return await response.json();
  } catch (error) {
    console.error('Validation error:', error);
    return null;
  }
};

/**
 * Get market alerts (whale activity, anomalies)
 */
export const getMarketAlerts = async (symbol) => {
  try {
    const response = await fetch(
      `${ML_API_BASE}/api/v1/alerts/${symbol}`
    );
    if (!response.ok) throw new Error('Alerts failed');
    return await response.json();
  } catch (error) {
    console.error('Alerts error:', error);
    return null;
  }
};

/**
 * Check ML backend health
 */
export const checkHealth = async () => {
  try {
    const response = await fetch(`${ML_API_BASE}/health`);
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Get Binance affiliate link
 */
export const getBinanceTradeLink = (symbol) => {
  // This will use the affiliate ID configured in the backend
  return `https://www.binance.com/trade/${symbol}_USDT`;
};
