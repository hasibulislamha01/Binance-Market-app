import useWebSocketConnection from "../../CustomHooks/useWebSocketConnection";

const Home = () => {
    const message = useWebSocketConnection('ethusdt', '1m')
    console.log(message);
    return (
        <div className="text-5xl text-center pt-12">
            This is Homepage
        </div>
    );
};

export default Home;