import React, { useEffect, useState } from 'react';
import { HistoryItem } from './HistoryFiles';
import parse, { attributesToProps, DOMNode, domToReact } from 'html-react-parser';
import {
    Element,
} from 'domhandler';
import { HeightChangingFrame } from './HeightChangingFrame';
import CustomReaderCss from './CustomReaderCss';
import { Typography } from '@material-ui/core';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

const HistoryViewer: React.FunctionComponent<{
    initialItem?: HistoryItem,
    onClickUrl: (url: string) => void;
    handleKeyboard?: (e: KeyboardEvent) => void;
    registerTouchHandler?: (window: Window | null | undefined) => () => void;
}> = props => {
    const { initialItem, onClickUrl, handleKeyboard, registerTouchHandler } = props;
    const [html, setHtml] = useState<string>();
    useEffect(() => {
        if (initialItem === undefined)
            return;
        if (html === undefined) {
            const headers = new Headers();
            headers.append('pragma', 'no-cache');
            headers.append('cache-control', 'no-cache');

            fetch(`https://docs.google.com/document/u/1/d/${initialItem.id}/pub?embedded=true&r=${Math.floor(Math.random() * 10000)}`, { headers, redirect: 'manual' })
                .then(response => response.text())
                .then(html => {
                    setHtml(html);
                })
        }
    }, [html]);

    const replace: (
        domNode: DOMNode
    ) => JSX.Element | undefined | null = React.useCallback((node: DOMNode) => {
        if (node.type === "tag") {
            const element: Element = node as Element;
            if (element.tagName === "html" || element.tagName === "head") {
                return <>{domToReact(element.children, { replace })}</>;
            }
            if (element.tagName === "body") {
                const props = attributesToProps(element.attribs);
                return <div id="contentBody" {...props}>
                    {domToReact(element.children, { replace })}
                </div>
            }
            if (element.tagName === "a") {
                return <a style={{ cursor: "pointer" }} onClick={() => onClickUrl(element.attribs.href)}>
                    {domToReact(element.children, { replace })}
                </a>
            }
        }
        return undefined;
    }, [onClickUrl]);

    if (initialItem === undefined) {
        return <Typography variant="body1">Válassz ki egy témakört...</Typography>;
    }

    if (html === undefined) {
        return (
            <div style={{margin: "0 auto", width: "100px"}}>
                <Loader type="Watch" color="#00BFFF" width="100px"/>
            </div>
        )
    }

    const parsed = parse(html, {
        replace
    });

    return (
        <HeightChangingFrame width="100%" handleKeyboard={handleKeyboard} registerTouchHandler={registerTouchHandler}>
            <CustomReaderCss />
            {parsed}
        </HeightChangingFrame>
    )
}

export default HistoryViewer;