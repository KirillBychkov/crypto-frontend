import { useCallback, useRef } from "react";
import './style.sass';

export const Popup = ({ setPopup, el }) => {
  const containerRef = useRef(null);

  const closePopup = useCallback(() => setPopup({ i: null, position: null }), [setPopup]);
  const [date, time] = new Date(+el?.t?.getValue() || 0).toISOString().split('T');

  return (
      <div
          ref={containerRef}
          className={'popupBlock'}
          style={{display: el ? "block" : "none"}}
          onMouseLeave={closePopup}
          onClick={closePopup}
      >
        {el && <>
          <div>Volume {(+el?.v?.getValue()).toFixed(2)}</div>
          <div>Time {time.split('.')[0]}</div>
          <div>Date {date}</div>
          <div>Open {el?.o.getValue()}</div>
          <div>Close {el?.c.getValue()}</div>
          <div>High {el?.h.getValue()}</div>
          <div>Low {el?.l.getValue()}</div>
          <div>Market Buy {(+el?.trade?.quantity_buy || 0).toFixed(2)}</div>
          <div>Market Sell {(+el?.trade?.quantity_sell || 0).toFixed(2)}</div>
        </>}
      </div>
  );
};
