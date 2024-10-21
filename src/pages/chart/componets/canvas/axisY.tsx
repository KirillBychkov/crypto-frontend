import { useRef } from "react";
// TODO background grid
// TODO auto zoom params on start
// TODO on resize moving the canvas

export const AxisY = ({ axisYChange, candlesLayer }) => {
    const clickPosition = useRef(null);

    return <div
        className={'rightAxis'}
        onMouseDown={(e) => {
            clickPosition.current = e.clientY;
        }}
        onMouseMove={(e) => {
            if(clickPosition.current) {
                axisYChange({ deltaY: clickPosition.current - e.clientY });
                clickPosition.current = e.clientY;
            }
        }}
        onMouseUp={() => {
            clickPosition.current = null;
        }}
        onMouseLeave={() => {
            clickPosition.current = null;
        }}
        onWheel={axisYChange}>
        <div>
            <div style={{ marginLeft: 6 }}>Y</div>
            <div>{candlesLayer.y.toFixed(2)}</div>
            <div>{candlesLayer.scaleY.toFixed(2)}</div>
        </div>
    </div>
}
