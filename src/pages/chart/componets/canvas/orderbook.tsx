import { Layer, Rect } from "react-konva"

export const Orderbook = ({
    count,
    orderbook = {
        asks: [],
        bids: []
    }
}) => {
    return <Layer name={'orderbook'}>
        {orderbook.asks?.map(([price, volume], i) =>
            <Rect key={i + 'rect1'} width={500} height={volume} x={(count + 1) * 22} y={-price} fill="#ff000020" />
        )}
        {orderbook.bids?.map(([price, volume], i) =>
            <Rect key={i + 'rect2'} width={500} height={volume} x={(count + 1) * 22} y={-price}  fill="#00ff0020" />
        )}
    </Layer>
}
