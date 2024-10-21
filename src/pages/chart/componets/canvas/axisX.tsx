import { useRef } from "react";

export const AxisX = ({ axisXChange, candlesLayer }) => {
    const clickPosition = useRef(null);

    return <div
        className={'bottomAxis'}
        onMouseDown={(e) => {
            clickPosition.current = e.clientX;
        }}
        onMouseMove={e => {
            if(clickPosition.current) {
                axisXChange({ deltaY: clickPosition.current - e.clientX });
                clickPosition.current = e.clientX;
            }
        }}
        onMouseUp={() => {
            clickPosition.current = null;
        }}
        onMouseLeave={() => {
            clickPosition.current = null;
        }}
        onWheel={axisXChange}>
        <div>
            <span>X </span>
            <span> {candlesLayer.x.toFixed(2)}</span>
            <span> / {candlesLayer.scaleX.toFixed(2)}</span>
        </div>
    </div>
}