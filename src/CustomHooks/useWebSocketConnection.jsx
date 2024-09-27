import { useEffect, useState, useRef } from 'react';

const useWebSocketConnection = (symbol, interval) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Create the WebSocket URL
    const wsUrl = `wss://stream.binance.com:9443/ws/${symbol}@kline_${interval}`;
    console.log("Connecting to WebSocket:", wsUrl);

    // Open a WebSocket connection
    socketRef.current = new WebSocket(wsUrl);

    // Event: Connection opened
    socketRef.current.onopen = () => {
      console.log('WebSocket connection opened');
    };

    // Event: Message received
    socketRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
        console.log('Received WebSocket data:', message);
      const candlestick = message.k;
      const open = candlestick.o;
      const high = candlestick.h;
      const low = candlestick.l;
      const close = candlestick.c;
      const volume = candlestick.v;
      const isFinal = candlestick.x; // true if the candlestick is complete

      const keyInfo = {open, high, low, close, volume, isFinal}
      // console.log(`Open: ${open}, High: ${high}, Low: ${low}, Close: ${close}, Volume: ${volume}, Final: ${isFinal}`);

      setData(keyInfo);
    };

    // Event: Connection closed
    socketRef.current.onclose = (event) => {
      console.log('WebSocket connection closed', event);
    };

    // Event: Error occurred
    socketRef.current.onerror = (event) => {
      console.error('WebSocket error:', event);
      setError(event);
    };

    // Cleanup on unmount
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
