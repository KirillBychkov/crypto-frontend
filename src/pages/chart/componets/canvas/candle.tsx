import { Rect, Text } from "react-konva"
import { useCallback } from "react"
import bigDecimal from "js-big-decimal";

export const Candle = ({ el, i, setPopup }) => {
    const { o, c, h, l, trade } = el;

    const closePopup = useCallback((e) => {
        const { width, height, left, top } =
            e.evt.target.closest('.stageWrapper')
            .querySelector('.popupBlock')
                .getBoundingClientRect();
        const x1 = left, x2= left + width, y1 = top, y2 = top + height;
        if(e.evt.clientX > x1 && e.evt.clientX < x2 && e.evt.clientY > y1 && e.evt.clientY < y2) return;
        setPopup({ el: null, i: null });
    }, [setPopup]);

    const fill = o.compareTo(c) === -1? 'green' : 'red',
        weakWidth = 2, weakHeight = h.subtract(l).getValue(),
        width = 20 + weakWidth, height = o.subtract(c).abs().getValue(),
        x = width * i, y = (o.compareTo(c) === 1? o : c).negate().getValue(),
        weakY = h.negate().getValue(), weakX = width * i + (width - weakWidth) / 2;

    const percent = (+o.subtract(c).abs().divide(o).multiply(new bigDecimal(100)).getValue()),
        buyers = trade?.quantity_buy > trade?.quantity_sell,
        textY = +weakY + (buyers? +weakHeight + 5: -20),
        howMuch = Math.abs(+(trade?.quantity_buy - trade?.quantity_sell).toFixed(0));

    return <>
        <Rect
            name={"price"}
            x={+weakX}
            y={+weakY}
            width={+weakWidth}
            height={+weakHeight}
            fill={fill}
        />
        <Rect
            name={"body"}
            x={+x}
            y={+y}
            width={+width}
            height={+height < 1? 1 : +height}
            fill={fill}
        />
        <Rect
            x={+x}
            y={+weakY}
            width={+width}
            height={+weakHeight}
            onMouseDown={closePopup}
            onMouseEnter={() => setPopup({ el, i })}
            onMouseLeave={closePopup}
            fill={'transparent'}
        />

        {/*<Text*/}
        {/*    x={+weakX - 5}*/}
        {/*    y={textY}*/}
        {/*    fontSize={10}*/}
        {/*    text={(howMuch / percent).toFixed(0)}*/}
        {/*    fill={buyers? 'green': 'red'}*/}
        {/*    width={20}*/}
        {/*/>*/}
    </>
};
