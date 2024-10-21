import './style.sass';

export const Labels = ({ orderbook, timeframe, selectedExchange, selectedCoin, price }) => {
    return <>
        <h4
            className={'labels'}>
            {timeframe + ' ' + selectedCoin + ' '}
            <span style={{ textTransform: 'capitalize'}}>{selectedExchange}</span>
        </h4>

        <h3 className={'orderbook-data'}>
            <div>_____</div>
            <div>cp: {price? price?.c?.getValue(): ""}</div>
            <div>bpa: {orderbook?.bids_price_avg?.toFixed(1)}</div>
            <div>apa: {orderbook?.asks_price_avg?.toFixed(1)}</div>
            <div>_____</div>
            <div>bv: {orderbook?.bids_volume?.toFixed(1)}</div>
            <div>av: {orderbook?.asks_volume?.toFixed(1)}</div>
            <div>nv: {orderbook?.net_volume?.toFixed(1)}</div>
            <div>imb: {orderbook?.imbalance?.toFixed(1)}</div>
            <div>_____</div>
        </h3>
    </>
}
