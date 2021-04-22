import React, { useEffect, useState } from "react";
import Frame from 'react-frame-component';

interface IProps {
    children: React.ReactNode;
    width: string;
    handleKeyboard?: (e: KeyboardEvent) => void;
}

interface IFrame {
    node: HTMLIFrameElement;
}

interface FrameRef extends Frame {
    node: HTMLIFrameElement;
}

export const HeightChangingFrame: React.FunctionComponent<IProps> = ({
    children,
    width,
    handleKeyboard
}) => {
    const [height, setHeight] = useState(500);
    const iframeRef = React.createRef<FrameRef>();
    const handleResize = (iframe: React.RefObject<IFrame>) => {
        if (
            iframe.current &&
            iframe.current.node.contentDocument &&
            iframe.current.node.contentDocument.body.scrollHeight !== 0
        ) {
            console.log(iframe.current.node.contentDocument.body.scrollHeight);
            setHeight(iframe.current.node.contentDocument.body.scrollHeight);
        }
    };
    useEffect(() => {
        if (handleKeyboard) {
            iframeRef.current?.node.contentWindow?.addEventListener('keydown', handleKeyboard);
        }
        const inter = setInterval(() => {
            handleResize(iframeRef);
        }, 200);
        return () => {
            if (handleKeyboard) {
                iframeRef.current?.node.contentWindow?.removeEventListener('keydown', handleKeyboard);
            }
            clearInterval(inter);
        }
    }, [children]);
    return (
        <Frame
            style={{
                height,
            }}
            width={width}
            ref={iframeRef}
            onLoad={() => {
                handleResize(iframeRef);
            }}
            scrolling="no"
            frameBorder="0"
        >{children}</Frame>
    );
};