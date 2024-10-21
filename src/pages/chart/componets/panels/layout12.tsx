import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useEffect, useCallback, useState } from "react";
import "./style.sass";

export const Layout12 = ({ children }) => {
    const [sizes, setSizes] = useState({
      leftCenter: { width: 0, height: 0 },
      rightTop: { width: 0, height: 0 },
      rightBottom: { width: 0, height: 0 }
    });

    const onResize = useCallback(() => {
      const rightTop = document.querySelector('#rightTop')
              ?.getBoundingClientRect(),
           leftCenter = document.querySelector('#leftCenter')
               ?.getBoundingClientRect(),
           rightBottom = document.querySelector('#rightBottom')
               ?.getBoundingClientRect();

      setSizes({
        leftCenter: { width: leftCenter?.width || 0, height: leftCenter?.height || 0 },
        rightBottom: { width: rightBottom?.width || 0, height: rightBottom?.height || 0 },
        rightTop: { width: rightTop?.width || 0, height: rightTop?.height || 0 }
      });
    }, []);

    useEffect(() => {
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }, [onResize]);

    return <div className={"layoutWrapper"}>
        <PanelGroup direction="horizontal">
            <Panel
                id="leftCenter"
                onResize={onResize}
                className={"panelContent vertical100"}
            >
                {children[0](sizes.leftCenter)}
            </Panel>
            <PanelResizeHandle
                className={"resizeHandleInner vertical"}
            />
            <Panel className={"panelContent"}>
                <PanelGroup direction="vertical">
                    <Panel
                        id="rightTop"
                        onResize={onResize}
                        className={"panelContent vertical50"}
                    >
                        {children[1](sizes.rightTop)}
                    </Panel>
                    <PanelResizeHandle
                        className={"resizeHandleInner horizontal"}
                    />
                    <Panel
                        id="rightBottom"
                        onResize={onResize}
                        className={"panelContent vertical50"}
                    >
                        {children[2](sizes.rightBottom)}
                    </Panel>
                </PanelGroup>
            </Panel>
        </PanelGroup>
    </div>
}
