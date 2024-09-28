import { useState } from "react";
import SelectOption from "../../Components/HomePageComponents/SelectOption";
import CandlestickChart from "../../Components/HomePageComponents/CandleChart/CandleChart";

const coinOptions = [
    { value: 'ethusdt', label: 'ETH/USDT' },
    { value: 'bnbusdt', label: 'BNB/USDT' },
    { value: 'dotusdt', label: 'DOT/USDT' },
]

const intervalOptions = [
    { value: '1m', label: '1 minute' },
    { value: '3m', label: '3 minute' },
    { value: '5m', label: '5 minute' },
]

const Home = () => {


    const [selectedCoin, setSelectedCoin] = useState('ethusdt')
    const [interval, setInterval] = useState('1m')
    const [chartData, setChartData] = useState({});

    const updateChartData = (coin, data) => {
        setChartData((prevData) => ({
            ...prevData,
            [coin]: data, // Update data for the specific coin
        }));
    };




    return (
        <div className="min-h-screen container mx-auto text-center pt-12">
            <h1 className="text-xl md:text-3xl font-bold text-amber-400">Binance Market Data</h1>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <SelectOption
                    placeholder='Select a coin'
                    changeHandler={setSelectedCoin}
                    options={coinOptions}
                    
                />
                <SelectOption
                    changeHandler={setInterval}
                    options={intervalOptions}
                    placeholder='Select an interval'
                />
            </div>
            <CandlestickChart
                selectedCoin={selectedCoin}
                interval={interval}
                chartData={chartData[selectedCoin] || []} // Pass data for the selected coin
                updateChartData={updateChartData} // Pass the update function
            />
        </div>
    );
};

export default Home;