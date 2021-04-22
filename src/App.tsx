import React, { useEffect, useState } from "react";
import Content from "./Content";
import { getHistoryItemById, getTopicFromItem, HistoryItem, loadHistoryItems, HistoryTopic, getIdFromGoogleLink } from "./HistoryFiles";
import HistoryViewer from "./HistoryViewer";
import './App.css';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Divider, IconButton, SwipeableDrawer, Typography } from "@material-ui/core";
import { Menu, ArrowLeft, ArrowRight } from '@material-ui/icons';

const App: React.FunctionComponent = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [topics, setTopics] = useState<HistoryTopic[]>();
    const [historyItem, setHistoryItem] = useState<HistoryItem>();
    const topic: HistoryTopic | undefined = React.useMemo(() => topics !== undefined && historyItem !== undefined
        ? getTopicFromItem(topics, historyItem)
        : undefined, [historyItem]);

    const leftItem: HistoryItem | undefined = React.useMemo(() => {
        if (topic === undefined)
            return undefined;
        const index = topic.items.findIndex(match => match === historyItem);
        if (index < 1)
            return undefined;

        return topic.items[index - 1];
    }, [historyItem])

    const rightItem: HistoryItem | undefined = React.useMemo(() => {
        if (topic === undefined)
            return undefined;
        const index = topic.items.findIndex(match => match === historyItem);
        if (index >= topic.items.length)
            return undefined;

        return topic.items[index + 1];
    }, [historyItem])

    const handleUrlClick = (url: string) => {
        if (topics === undefined) return;

        const id = getIdFromGoogleLink(url);
        const nextItem = getHistoryItemById(topics, id);
        console.log(nextItem);
        if (nextItem) {
            setHistoryItem(nextItem);
        }
    }

    const handleSelectItem =  React.useCallback((item: HistoryItem) => {
        setHistoryItem(item);
    }, []);

    const handleLeft = React.useCallback(() => {
        if (leftItem === undefined) return;
        setHistoryItem(leftItem);
    }, [leftItem]);

    const handleRight = React.useCallback(() => {
        if (rightItem === undefined) return;
        setHistoryItem(rightItem);
    }, [rightItem]);

    useEffect(() => {
        if (topics === undefined) {
            loadHistoryItems()
                .then(topics => {
                    setTopics(topics);
                    setHistoryItem(topics[0].items[0]);
                });
        }
    }, [topics])

    const keyboardHandler = React.useCallback((e: KeyboardEvent) => {
        if (e.key === "ArrowLeft") {
            handleLeft();
        } else if (e.key === "ArrowRight") {
            handleRight();
        }
    }, [handleLeft, handleRight])

    useEffect(() => {        
        document.addEventListener('keydown', keyboardHandler);
        return () => {
            document.removeEventListener('keydown', keyboardHandler);
        }
    }, [keyboardHandler])

    if (topics === undefined) {
        return (
            <>
                Loading
            </>
        )
    }

    return (
        <>
            <CssBaseline />
            <div style={{ float: "left" }}>
                <IconButton onClick={() => setDrawerOpen(true)}>
                    <Menu />
                </IconButton>
            </div>
            <SwipeableDrawer
                anchor={"left"}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                onOpen={() => setDrawerOpen(true)}
            >
                <Content topics={topics} selectItem={handleSelectItem} />
            </SwipeableDrawer>
            <div id="content">
                <Typography variant="h2" align="center">
                    {topic?.name}
                </Typography>
                <div style={{ display: "flex" }}>
                    <div style={{ width: "50%" }}>
                        <div style={{ margin: "0 auto 0 0", width: "fit-content", display: "flex", alignItems: "center" }}>
                            <IconButton onClick={handleLeft}  style={{display: leftItem === undefined ? "none" : "inherit"}}>
                                <ArrowLeft />
                            </IconButton>
                            <Typography variant="body1">
                                {leftItem?.name}
                            </Typography>
                        </div>
                    </div>
                    <div style={{ width: "50%" }}>
                        <div style={{ margin: "0 0 0 auto", width: "fit-content", display: "flex", alignItems: "center" }}>
                            <Typography variant="body1">
                                {rightItem?.name}
                            </Typography>
                            <IconButton onClick={handleRight} style={{display: rightItem === undefined ? "none" : "inherit"}}>
                                <ArrowRight  />
                            </IconButton>
                        </div>
                    </div>
                </div>
                <Divider />
                <HistoryViewer key={historyItem?.id ?? "not-selected"}
                    initialItem={historyItem}
                    onClickUrl={handleUrlClick}
                    handleKeyboard={keyboardHandler}
                />
                <Divider />
            </div>
        </>
    );
}

export default App;
