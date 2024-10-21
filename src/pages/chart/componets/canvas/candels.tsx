import { Layer } from "react-konva"
import { Candle } from "./candle"

export const Candles = ({ sticks, setPopup }) => {
    return <Layer name={'candles'}>
        {sticks.map((el, i) =>
            <Candle
                key={el.t.getValue() + 'candle' + i}
                el={el}
                i={i}
                setPopup={setPopup}
            />
        )}
    </Layer>
}
