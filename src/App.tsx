import React, { useEffect, useState } from "react";
import Content from "./Content";
import { getHistoryItemById, getTopicFromItem, HistoryItem, loadHistoryItems, HistoryTopic, getIdFromGoogleLink } from "./HistoryFiles";
import HistoryViewer from "./HistoryViewer";
import './App.css';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Divider, IconButton, MenuItem, SwipeableDrawer, Typography, Menu } from "@material-ui/core";
import { Menu as MenuIcon, ArrowLeft, ArrowRight } from '@material-ui/icons';
import Loader from "react-loader-spinner";
import { useConfirm } from "material-ui-confirm";

const App: React.FunctionComponent = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const confirm = useConfirm();
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
        if (nextItem) {
            setHistoryItem(nextItem);
        } else {
            confirm({
                title: "Biztos megszeretné nyitni ezt a külső hivatkozást?",
                cancellationText: "Nem",
                confirmationText: "Igen",
            }).then(() => {
                const opened = window.open(url, '_blank');
                if (opened) {
                    opened.focus();
                }
            });
        }
    }

    const handleSelectItem = React.useCallback((item: HistoryItem) => {
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

    const registerTouch = React.useCallback((window: Window | null | undefined): () => void => {
        if (window === undefined || window == null) {
            return () => {
                //
            };
        }
        let start: Touch | null = null;
        let startTime = new Date();

        const touchStart = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                start = e.touches.item(0);
                startTime = new Date()
            } else {
                start = null;
            }
        };
        const touchEnd = (e: TouchEvent) => {
            const swipeWidth = window.outerWidth * 0.6;
            if (start !== null) {
                const end = e.changedTouches.item(0);
                if (end === null) return;

                if (Math.abs(start.pageY - end.pageY) > 10) return;
                if (new Date().getTime() - startTime.getTime() > 1000) return;

                if (start.pageX + swipeWidth < end.pageX) {
                    handleLeft();
                }
                if (start.pageX - swipeWidth > end.pageX) {
                    handleRight();
                }
            }
        };

        window.addEventListener('touchstart', touchStart)
        window.addEventListener('touchend', touchEnd)
        return () => {
            window.removeEventListener('touchstart', touchStart);
            window.removeEventListener('touchend', touchEnd);
        }
    }, [handleLeft, handleRight]);

    useEffect(() => {
        const deregisterTouch = registerTouch(window);
        document.addEventListener('keydown', keyboardHandler);
        return () => {
            document.removeEventListener('keydown', keyboardHandler);
            deregisterTouch();
        }
    }, [keyboardHandler])

    if (topics === undefined) {
        return (
            <div style={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Loader type="TailSpin" color="#00BFFF" width="10vw" />
            </div>
        )
    }

    return (
        <>
            <CssBaseline />
            <div style={{ position: "absolute", left: 0, top: 0 }}>
                <IconButton onClick={() => setDrawerOpen(true)}>
                    <MenuIcon />
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
                <Typography variant="h2" align="center" onClick={(e) => {
                    setAnchorEl(e.currentTarget);
                    setMenuOpen(true);
                }}>
                    {topic?.name}
                </Typography>
                <Menu anchorEl={anchorEl} open={menuOpen} onClose={() => setMenuOpen(false)} keepMounted>
                    {topics.map(topic => <MenuItem key={`menu-${topic.name}`} onClick={() => {
                        handleSelectItem(topic.items[0]);
                        setMenuOpen(false);
                    }}>
                        {topic.name}
                    </MenuItem>)}
                </Menu>
                <div style={{ display: "flex" }}>
                    <div style={{ width: "50%" }}>
                        <div style={{ margin: "0 auto 0 0", width: "fit-content", display: "flex", alignItems: "center" }}>
                            <IconButton onClick={handleLeft} style={{ display: leftItem === undefined ? "none" : "inherit" }}>
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
                            <IconButton onClick={handleRight} style={{ display: rightItem === undefined ? "none" : "inherit" }}>
                                <ArrowRight />
                            </IconButton>
                        </div>
                    </div>
                </div>
                <Divider />
                <HistoryViewer key={historyItem?.id ?? "not-selected"}
                    initialItem={historyItem}
                    onClickUrl={handleUrlClick}
                    handleKeyboard={keyboardHandler}
                    registerTouchHandler={registerTouch}
                />
                <Divider />
            </div>
        </>
    );
}

export default App;
