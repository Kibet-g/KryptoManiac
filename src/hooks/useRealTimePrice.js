/**
 * useRealTimePrice Hook - WebSocket connection for live prices
 */
import { useState, useEffect, useRef, useCallback } from 'react';

const WS_BASE = process.env.REACT_APP_WS_URL || 'ws://localhost:8000';

export const useRealTimePrice = (symbol) => {
  const [price, setPrice] = useState(null);
  const [signal, setSignal] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const connect = useCallback(() => {
    if (!symbol) return;

    try {
      const ws = new WebSocket(`${WS_BASE}/ws/${symbol.toLowerCase()}`);
      wsRef.current = ws;

      ws.onopen = () => {
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
      };

      ws.onclose = () => {
        setConnected(false);
        // Reconnect after 5 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('Reconnecting...');
          connect();
        }, 5000);
      };
    } catch (err) {
      setError(err.message);
    }
  }, [symbol]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [symbol, connect, disconnect]);

  return { price, signal, connected, error, reconnect: connect };
};

export default useRealTimePrice;
