import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import useWebSocketConnection from '../../../CustomHooks/useWebSocketConnection';

const CandlestickChart = () => {

  const message = useWebSocketConnection('ethusdt', '1m');
  console.log(message);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const info = message?.data;

    if (info) {

      const open = parseFloat(info.open);
      const high = parseFloat(info.high);
      const low = parseFloat(info.low);
      const close = parseFloat(info.close);
      console.log( open, high,  low,  close);

      if (!isNaN(open) && !isNaN(high) && !isNaN(low) && !isNaN(close)) {
        // Prepare the data in the format that ApexCharts candlestick expects
        const newCandle = {
          x: new Date(), // Current timestamp for the x-axis
          y: [open, high, low, close] // y-axis values: [open, high, low, close]
        };
        setChartData((prevData) => [...prevData, newCandle]);
      }

    }
  }, [message]); // Update when new WebSocket message is received

  // Define chart options
  const chartOptions = {
    chart: {
      type: 'candlestick',
      height: 350,
    },
    title: {
      text: 'ETH/USDT 1-Min Candlestick Chart',
      align: 'left'
    },
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div>
      <ReactApexChart
        options={chartOptions}
        series={[{ data: chartData }]}
        type="candlestick"
        height={350}
      />
    </div>
  );
};

export default CandlestickChart;
