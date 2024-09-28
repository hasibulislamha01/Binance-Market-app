import { useState, useEffect, useRef, useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import useWebSocketConnection from '../../../CustomHooks/useWebSocketConnection';
import PropTypes from "prop-types";

const CandlestickChart = ({ selectedCoin, interval, chartData, updateChartData }) => {
  const message = useWebSocketConnection(selectedCoin, interval);
  const [localChartData, setLocalChartData] = useState([]);
  const hasUpdatedChartData = useRef(false);

  // Utility function to store chart data in localStorage
  const storeChartData = (coin, data) => {
    localStorage.setItem(`candlestick_${coin}`, JSON.stringify(data));
  };

  // Utility function to retrieve chart data from localStorage
  const getStoredChartData = (coin) => {
    const storedData = localStorage.getItem(`candlestick_${coin}`);
    return storedData ? JSON.parse(storedData) : null;
  };

  // Calculate the min and max for the y-axis dynamically based on chart data
  const calculateYRange = (data) => {
    if (!data || data.length === 0) return { min: 0, max: 1 };
    
    const prices = data.flatMap((candle) => candle.y);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const padding = (max - min) * 0.1; // Add 10% padding to the range
    return {
      min: min - padding,
      max: max + padding,
    };
  };

  // When the component mounts or the selected coin changes, reset the chart data
  useEffect(() => {
    // Clear the local chart data to reset the chart for a new coin
    setLocalChartData([]);

    const storedData = getStoredChartData(selectedCoin);
    if (storedData) {
      setLocalChartData(storedData);
    } else if (chartData && chartData.length > 0) {
      setLocalChartData(chartData);
    }
  }, [selectedCoin, chartData]);

  useEffect(() => {
    const info = message?.data;

    if (info) {
      const open = parseFloat(info.open);
      const high = parseFloat(info.high);
      const low = parseFloat(info.low);
      const close = parseFloat(info.close);

      if (!isNaN(open) && !isNaN(high) && !isNaN(low) && !isNaN(close)) {
        const newCandle = {
          x: new Date(),
          y: [open, high, low, close],
        };

        // Check if the new candle is different before updating
        setLocalChartData((prevData) => {
          if (prevData.length === 0 || 
              prevData[prevData.length - 1].y.toString() !== newCandle.y.toString()) {
            hasUpdatedChartData.current = true;
            return [...prevData, newCandle];
          }
          return prevData; // Return previous data if no update is needed
        });
      }
    }
  }, [message]);

  // When chart data changes, update local storage and inform parent component
  useEffect(() => {
    if (hasUpdatedChartData.current) {
      updateChartData(selectedCoin, localChartData);
      storeChartData(selectedCoin, localChartData); // Store updated chart data in localStorage
      hasUpdatedChartData.current = false;
    }
  }, [localChartData, selectedCoin, updateChartData]);

  // Calculate the y-axis range dynamically based on localChartData
  const yRange = useMemo(() => calculateYRange(localChartData), [localChartData]);

  const chartOptions = useMemo(() => ({
    chart: {
      type: 'candlestick',
      height: 350,
    },
    title: {
      text: `${selectedCoin.toUpperCase()} ${interval} Candlestick Chart`,
      align: 'left',
      style: {
        fontSize: '16px',
        color: '#fbbf24',
        fontWeight: 'bold',
      },
    },
    grid: {
      borderColor: '#475569', // Set the grid line color
      strokeDashArray: 5, // Optional: set dashed lines, change to 0 for solid lines
      position: 'back', // Optional: place grid lines behind the chart elements
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: {
          colors: '#f59e0b', 
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      min: yRange.min, // Dynamically set the y-axis min
      max: yRange.max, // Dynamically set the y-axis max
      forceNiceScale: true,
      tooltip: {
        enabled: true,
      },
      labels: {
        style: {
          colors: '#f59e0b', 
          fontSize: '12px',
        },
      },
    },
  }), [selectedCoin, interval, yRange]);

  return (
    <div>
      <ReactApexChart
        options={chartOptions}
        series={[{ data: localChartData }]}
        type="candlestick"
        height={350}
      />
    </div>
  );
};

CandlestickChart.propTypes = {
  selectedCoin: PropTypes.string.isRequired,
  interval: PropTypes.string.isRequired,
  chartData: PropTypes.array,
  updateChartData: PropTypes.func.isRequired,
};

export default CandlestickChart;
