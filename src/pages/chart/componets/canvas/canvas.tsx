import { useCallback, useEffect, useRef, useState } from "react";
import { Stage } from "react-konva";
import { Candles } from "./candels";
import { Popup } from "../popup/popup";
import { AxisY } from "./axisY";
import { AxisX } from "./axisX";
import { Labels } from "../labels";
import { Orderbook } from "./orderbook.jsx";
import { pusherClient } from "@/App.tsx";
import { useAxios } from "@/auth/axios-hook.ts";
import bigDecimal from "js-big-decimal";
import './style.sass';

const initCandlesLayer = {
	scaleX: 1,
	scaleY: 1,
	x: 0,
	y: 0
};

export const Chart = ({ width, height, timeframe, selectedExchange, selectedCoin, orderbook }) => {
	const { tradeService } = useAxios();
	const [ohclv, setOHCLV] = useState([]);
	const limits = useRef({ x: 0, y: 0 });
	const setDefaultPosition = useRef(false);
	const refStage = useRef(null);

	const [candlesLayer, setCandlesLayer] = useState(initCandlesLayer);
	const [popup, setPopup] = useState({
		position: null,
		i: null
	});

	useEffect(() => {
		if(selectedExchange && selectedCoin && timeframe) {
			const subscriber = pusherClient.subscribe('ticker')
				.bind(selectedExchange + '-' + selectedCoin, ({ ticker }) => {
					// console.log(selectedExchange + '-' + selectedCoin, ticker);
					// setOHCLV(prev => {
					// 	if(!prev[prev.length - 1]) return [];
					//
					// 	prev[prev.length - 1] = {
					// 		...prev[prev.length - 1],
					// 		c: new bigDecimal(ticker.last)
					//
					// 	};
					// 	return prev;
					// });
				});

			return () => {
				subscriber.unbind();
			};
		}
	}, [selectedExchange, selectedCoin, timeframe]);

	const getOHCLV = useCallback(async () => {
		if(selectedExchange && selectedCoin && timeframe) {
			const response = await tradeService?.get(
				'getOHCLV?exchange=' + selectedExchange.toLowerCase() + '&symbol=' + selectedCoin + '&timeframe=' + timeframe);
			if(response?.status === 200) {
				setOHCLV(response.data.data.map(ticker => ({
					o: new bigDecimal(ticker[1]),
					h: new bigDecimal(ticker[2]),
					l: new bigDecimal(ticker[3]),
					c: new bigDecimal(ticker[4]),
					v: new bigDecimal(ticker[5]),
					t: new bigDecimal(+new Date(ticker[0]))
				})));
			}
		}
	}, [tradeService, timeframe, selectedExchange, selectedCoin]);


	useEffect(() => {
		(async () => await getOHCLV())()
	}, [getOHCLV]);

    useEffect(() => {
        const canvas = refStage.current.getStage(),
            wrapper = canvas.attrs.container.closest('.stageWrapper');

        const mousemove = function (e) {
			if(e.target.localName !== 'canvas') return;

            const points = canvas.getRelativePointerPosition();

			wrapper.style.setProperty('--content-prop-for-before',
				"'" + Math.round((points?.x || 0)) / 100 + "'");
			wrapper.style.setProperty('--content-prop-for-after',
				"'" + Math.round((points?.y || 0) * -100) / 100 + "'");
			wrapper.style.setProperty('--height-prop-for-before', wrapper.offsetHeight + 'px');
			wrapper.style.setProperty('--left-prop-for-before', e.clientX + 'px');

			wrapper.style.setProperty('--width-prop-for-after', wrapper.offsetWidth + 'px');
			wrapper.style.setProperty('--top-prop-for-after', e.clientY + 'px');
        };
		wrapper.addEventListener("mousemove", mousemove);

        return () => {
            window.removeEventListener("mousemove", mousemove);
        };
    }, [refStage]);

	useEffect(() => {
		const setDefaultCanvasSize = () => {
			const canvas = refStage.current.getStage(),
				scaleX = (timeframe[timeframe.length - 1] === 'm' && 0.4) ||
					(timeframe[timeframe.length - 1] === 'h' && 0.8) ||
					(timeframe[timeframe.length - 1] === 'M' && 0.6) ||
					(timeframe[timeframe.length - 1] === 'w' && 0.6) ||
					(timeframe[timeframe.length - 1] === 'd' && 0.6),
				candleWidth = 22 * scaleX,
				visibleCandlesCount = 20,
				canvasHeight = canvas.bufferCanvas.height,
				candlesCount = (canvas.children
					.find(e => e.attrs.name === "candles" )?.children?.length || 0) / 3,
				state = { scaleX, x: 0, scaleY: 1, y: 0 };

			if(candlesCount !== 0 && !setDefaultPosition.current) {
				setDefaultPosition.current = true;
				state.x = -1 * (candlesCount * candleWidth - visibleCandlesCount * candleWidth);
				const { min, max } = ohclv
					.slice((ohclv.length - visibleCandlesCount), ohclv.length)
					.reduce((s, e) => {
						return {
							min: s.min? Math.min(s.min, e.l.getValue()): e.l.getValue(),
							max: s.max? Math.max(s.max, e.h.getValue()): e.h.getValue() }
					}, {}),
					diff = Math.round(max - min),
					lastClosePrice = ohclv[ohclv.length - 1]?.c.getValue() || 0;

				state.scaleY = diff < canvasHeight? 1 : canvasHeight / (diff * 2);
				state.y = (+lastClosePrice * state.scaleY) + canvasHeight / 2;

				setCandlesLayer(state);
			}
		}

		const interval = setInterval(() => {
			const canvas = refStage.current.getStage(),
				canvasHeight = canvas.bufferCanvas.height;

			if(canvasHeight) {
				setDefaultCanvasSize();
				clearInterval(interval);
			}
		}, 100);
	}, [ohclv, refStage, setDefaultPosition, timeframe]);

	const axisXChange = useCallback((e) => {
		const delta = e.evt?.deltaY || e.deltaY;
		setCandlesLayer(prev => ({
			...prev,
			scaleX: delta < 0 ? prev.scaleX * 1.005 : prev.scaleX / 1.005,
		}));
	}, []);

	const axisYChange = useCallback(e => {
		const delta = e.evt?.deltaY || e.deltaY;
		setCandlesLayer(prev => {
			const scaleY = delta < 0 ? prev.scaleY * 1.01 : prev.scaleY / 1.01,
				y = prev.y / prev.scaleY * scaleY;

			return { ...prev, scaleY, y };
		});
	}, [setCandlesLayer]);

    const dragEnd = useCallback(() => {
        setCandlesLayer(prev => ({
            ...prev, x: limits.current.x, y: limits.current.y
        }));
    }, [setCandlesLayer]);

    const onDragMove = useCallback(e => {
        const { content } = refStage.current.getStage(),
            { x, y, width, height } =
				content.getBoundingClientRect(),
            { clientX, clientY } = e.evt;

        if(x < clientX && x + width > clientX)
            limits.current.x = e.currentTarget.x();
        if(y < clientY && y + height > clientY)
            limits.current.y = e.currentTarget.y();

        e.currentTarget.x(limits.current.x);
        e.currentTarget.y(limits.current.y);
    }, [refStage]);

	return <div className="stageWrapper">
		<Stage
			ref={refStage}
			className={"mainCanvas"}
			onWheel={axisXChange}
			width={width}
			height={height}
			draggable={true}
			onDragMove={onDragMove}
			onDragEnd={dragEnd}
			scaleX={candlesLayer.scaleX}
			scaleY={candlesLayer.scaleY}
			x={candlesLayer.x}
			y={candlesLayer.y}>
			<Candles
				sticks={ohclv}
				setPopup={setPopup}
			/>
			{orderbook && <Orderbook count={ohclv.length} orderbook={orderbook} />}
		</Stage>
		<AxisY
			refStage={refStage}
			candlesLayer={candlesLayer}
			axisYChange={axisYChange}
		/>
		<AxisX
			refStage={refStage}
			candlesLayer={candlesLayer}
			axisXChange={axisXChange}
		/>
		<Popup
			el={ohclv[popup.i]}
			setPopup={setPopup}
		/>
		<Labels
			orderbook={orderbook}
			price={ohclv[ohclv.length - 1] || null}
			timeframe={timeframe}
			selectedExchange={selectedExchange}
			selectedCoin={selectedCoin}
		/>
	</div>
}
