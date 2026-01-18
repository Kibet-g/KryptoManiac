/**
 * useRealTimePrice Hook - WebSocket connection for live prices with fallback
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { mockCoins } from '../config/mockData';

const WS_BASE = process.env.REACT_APP_WS_URL || 'ws://localhost:8000';
const FALLBACK_TIMEOUT = 3000; // Fallback to mock after 3 seconds

export const useRealTimePrice = (symbol) => {
  const [price, setPrice] = useState(null);
  const [signal, setSignal] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const fallbackTimeoutRef = useRef(null);

  // Fallback to mock data if WebSocket fails (regular function, not a hook)
  const applyFallbackData = useCallback(() => {
    const coin = mockCoins.find(c => c.id === symbol?.toLowerCase() || c.symbol === symbol?.toLowerCase()) || mockCoins[0];
    setPrice({
      price: coin.current_price,
      price_change_24h: coin.price_change_percentage_24h
    });
    setSignal({
      type: 'HOLD',
      emoji: '⚖️',
      message: 'Market steady - wait for better entry'
    });
    setConnected(true); // Mark as connected to show UI
    console.log(`📡 Using fallback data for ${symbol}`);
  }, [symbol]);

  const connect = useCallback(() => {
    if (!symbol) return;

    // Set a fallback timeout
    fallbackTimeoutRef.current = setTimeout(() => {
      if (!connected) {
        applyFallbackData();
      }
    }, FALLBACK_TIMEOUT);

    try {
      const ws = new WebSocket(`${WS_BASE}/ws/${symbol.toLowerCase()}`);
      wsRef.current = ws;

      ws.onopen = () => {
        clearTimeout(fallbackTimeoutRef.current);
        setConnected(true);
        setError(null);
        console.log(`🔌 Connected to ${symbol} stream`);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setPrice(data);
          setSignal({
            type: data.signal,
            emoji: data.signal_emoji,
            message: data.message
          });
        } catch (e) {
          console.error('Parse error:', e);
        }
      };

      ws.onerror = (err) => {
        console.error('WebSocket error:', err);
        setError('Connection error');
        // Fall back to mock data on error
        applyFallbackData();
      };

      ws.onclose = () => {
        // Don't reconnect endlessly, just use fallback
        if (!connected) {
          applyFallbackData();
        }
      };
    } catch (err) {
      setError(err.message);
      applyFallbackData();
    }
  }, [symbol, connected, applyFallbackData]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (fallbackTimeoutRef.current) {
      clearTimeout(fallbackTimeoutRef.current);
    }
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [symbol, connect, disconnect]);

  return { price, signal, connected, error, reconnect: connect };
};

export default useRealTimePrice;


