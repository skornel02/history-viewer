import React, { useEffect, useState } from 'react';
import { HistoryItem } from './HistoryFiles';
import "./HistoryViewer.css";
import parse, { DOMNode, domToReact } from 'html-react-parser';
import {
    Element,
} from 'domhandler';

const HistoryViewer: React.FunctionComponent<{
    initialItem?: HistoryItem,
    onClickUrl: (url: string) => void;
}> = props => {
    const { initialItem, onClickUrl } = props;
    const [html, setHtml] = useState<string>();
    useEffect(() => {
        if (initialItem === undefined)
            return;
        if (html === undefined) {
            const headers = new Headers();
            headers.append('pragma', 'no-cache');
            headers.append('cache-control', 'no-cache');

            fetch(initialItem.publishUrl, {headers})
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
            if (element.tagName === "a") {
                return <a style={{cursor: "pointer"}} onClick={() => onClickUrl(element.attribs.href)}>
                    {domToReact(element.children)}
                </a>
            }
        }
        return undefined;
    }, [onClickUrl]);

    if (initialItem === undefined) {
        return null;
    }

    if (html === undefined) {
        return (<div>Loading</div>)
    }

    const parsed = parse(html, {
        replace
    });

    return (
        <div id="reader">
            {parsed}
        </div>
    )
}

export default HistoryViewer;