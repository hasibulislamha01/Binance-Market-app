import { useEffect, useState, useRef } from 'react';

const useWebSocketConnection = (symbol, interval) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);
  const firstCandlestickCaptured = useRef(false); 

  useEffect(() => {
    const wsUrl = `wss://stream.binance.com:9443/ws/${symbol}@kline_${interval}`;
    console.log("Connecting to WebSocket:", wsUrl);

    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {
      console.log('WebSocket connection opened');
    };

    socketRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const candlestick = message.k;

      console.log('Received message:', message); // Log the entire message
      const intervalIsComplete = candlestick.x; // Check if the candlestick is closed

      const open = candlestick.o;
      const high = candlestick.h;
      const low = candlestick.l;
      const close = candlestick.c;
      const volume = candlestick.v;

      const keyInfo = { open, high, low, close, volume, intervalIsComplete };

      if (!firstCandlestickCaptured.current) {
        console.log('Captured first candlestick:', keyInfo);
        setData(keyInfo);
        firstCandlestickCaptured.current = true;
      }

      if (intervalIsComplete) {
        console.log('Candlestick is complete:', keyInfo);
        setData(keyInfo);
      } else {
        console.log('Candlestick is not complete:', keyInfo);
      }
    };

    socketRef.current.onerror = (event) => {
      console.error('WebSocket error:', event);
      setError(event);
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        console.log('WebSocket connection closed on component unmount');
      }
    };
  }, [symbol, interval]);

  return { data, error };
};

export default useWebSocketConnection;
