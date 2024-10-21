import { useState } from "react";
import { Layout12 } from "./componets/panels/layout12.tsx";
import { Chart } from "./componets/canvas/canvas.tsx";

const cexList = [
    {name: 'Binance', code: 'binance'},
];

const coins = [
    {name: 'BTC/USDT', code: 'BTC/USDT'},
    {name: 'ETH/USDT', code: 'ETH/USDT'},
];

const availableTimeFrames = [
    {name: '1m', code: '1m'},
    {name: '5m', code: '5m'},
    {name: '15m', code: '15m'},
    {name: '30m', code: '30m'},
    {name: '1h', code: '1h'},
    {name: '2h', code: '2h'},
    {name: '4h', code: '4h'},
    {name: '12h', code: '12h'},
    {name: '1d', code: '1d'},
    {name: '1w', code: '1w'},
    {name: '1M', code: '1M'},
];

export const ChartPage = () => {
    const [selectedCoin, setSelectedCoin] = useState(coins[1]);
    const [selectedExchange, setSelectedExchange] = useState(cexList[0]);
    const [timeframe, setTimeframe] = useState([
        availableTimeFrames[2],
        availableTimeFrames[6],
        availableTimeFrames[8],
    ]);

    return <div className="container mx-auto py-2">
        <Layout12>
            {({width, height}) =>
                <Chart
                    width={width}
                    height={height}
                    timeframe={timeframe[0].name}
                    selectedExchange={selectedExchange.name}
                    selectedCoin={selectedCoin.name}
                />}
            {({width, height}) =>
                <Chart
                    width={width}
                    height={height}
                    timeframe={timeframe[1].name}
                    selectedExchange={selectedExchange.name}
                    selectedCoin={selectedCoin.name}
                />}
            {({width, height}) =>
                <Chart
                    width={width}
                    height={height}
                    timeframe={timeframe[2].name}
                    selectedExchange={selectedExchange.name}
                    selectedCoin={selectedCoin.name}
                />}
        </Layout12>
    </div>
};
