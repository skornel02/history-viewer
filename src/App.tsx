import React, { useEffect, useState } from "react";
import Content from "./Content";
import { getHistoryItemById, getTopicFromItem, HistoryItem, loadHistoryItems, HistoryTopic, getIdFromGoogleLink } from "./HistoryFiles";
import HistoryViewer from "./HistoryViewer";
import './App.css';

const App: React.FunctionComponent = () => {
    const [topics, setTopics] = useState<HistoryTopic[]>();
    const [historyItem, setHistoryItem] = useState<HistoryItem>();
    const topic = React.useMemo(() => topics !== undefined && historyItem !== undefined
        ? getTopicFromItem(topics, historyItem)
        : undefined, [historyItem]);

    const handleUrlClick = (url: string) => {
        if (topics === undefined) return;

        const id = getIdFromGoogleLink(url);
        const nextItem = getHistoryItemById(topics, id);
        console.log(nextItem);
        if (nextItem) {
            setHistoryItem(nextItem);
        }
    }

    const handleSelectItem = (item: HistoryItem) => {
        setHistoryItem(item);
    }

    useEffect(() => {
        if (topics === undefined) {
            loadHistoryItems()
                .then(topics => {
                    setTopics(topics);
                    setHistoryItem(topics[0].items[0]);
                });
        }
    }, [topics])

    if (topics === undefined) {
        return (
            <>
                Loading
            </>
        )
    }

    return (
        <div id="content">
            <h1>
                {topic?.name}
            </h1>
            <hr />
            <HistoryViewer key={historyItem?.id ?? "not-selected"}
                initialItem={historyItem}
                onClickUrl={handleUrlClick}
            />
            <hr />
            <Content topics={topics} selectItem={handleSelectItem}/>
        </div>
    );
}

export default App;
