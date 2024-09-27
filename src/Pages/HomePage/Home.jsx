import { useState } from "react";
import SelectCoin from "../../Components/HomePageComponents/SelectCoin";
import useWebSocketConnection from "../../CustomHooks/useWebSocketConnection";
import CandlestickChart from "../../Components/HomePageComponents/CandleChart/CandleChart";


const Home = () => {
    const message = useWebSocketConnection('ethusdt', '1m')
    const [firstCoin, setFirstCoin] = useState(null)




    return (
        <div className="container mx-auto text-center pt-12">
            <h1 className="text-xl md:text-3xl font-bold ">Binance Market </h1>

            <div className="">
                <SelectCoin
                    placeholder='Select first coin'
                    changeHandler={setFirstCoin}
                />
                <CandlestickChart/>
            </div>
        </div>
    );
};

export default Home;