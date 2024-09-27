import { useState, useEffect, useRef, useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import useWebSocketConnection from '../../../CustomHooks/useWebSocketConnection';
import PropTypes from "prop-types";

const CandlestickChart = (({ selectedCoin, interval, chartData, updateChartData }) => {
  const message = useWebSocketConnection(selectedCoin, interval);
  const [localChartData, setLocalChartData] = useState(chartData || []);
  const hasUpdatedChartData = useRef(false);

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

  useEffect(() => {
    if (hasUpdatedChartData.current) {
      updateChartData(selectedCoin, localChartData);
      hasUpdatedChartData.current = false;
    }
  }, [localChartData, selectedCoin, updateChartData]);

  const chartOptions = useMemo(() => ({
    chart: {
      type: 'candlestick',
      height: 350,
    },
    title: {
      text: `${selectedCoin.toUpperCase()} ${interval} Candlestick Chart`,
      align: 'left',
    },
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      forceNiceScale: true,
      tooltip: {
        enabled: true,
      },
    },
  }), [selectedCoin, interval]); // Add dependencies if necessary

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
});

CandlestickChart.propTypes = {
  selectedCoin: PropTypes.string.isRequired,
  interval: PropTypes.string.isRequired,
  chartData: PropTypes.array,
  updateChartData: PropTypes.func.isRequired,
};

export default CandlestickChart;
