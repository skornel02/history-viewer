import { Collapse, List, ListItem, ListItemText, ListSubheader } from '@material-ui/core';
import React, { useState } from 'react';
import { HistoryItem, HistoryTopic } from './HistoryFiles';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

const Topics: React.FunctionComponent<{
    topic: HistoryTopic
    selectItem: (item: HistoryItem) => void;
}> = props => {
    const { topic, selectItem } = props;
    const [collapsed, setCollapsed] = useState(true);

    return (
        <>
            <ListItem button onClick={() => setCollapsed(!collapsed)}>
                <ListItemText color="primary">
                    {topic.name}
                </ListItemText>
                {collapsed ? <ExpandMore /> : <ExpandLess />}
            </ListItem>
            <Collapse in={!collapsed} timeout="auto">
                <List component="div" disablePadding>
                    {topic.items.map(item => <ListItem button key={`navlink-${item.name}`}
                        onClick={(e) => {
                            e.preventDefault();
                            selectItem(item);
                        }}
                        style={{paddingLeft: "2rem"}}
                    >
                        <ListItemText>
                            {item.name}
                        </ListItemText>
                    </ListItem>)}
                </List>
            </Collapse>
        </>
    )
};

const Content: React.FunctionComponent<{
    topics: HistoryTopic[];
    selectItem: (item: HistoryItem) => void;
}> = props => {
    const { topics, selectItem } = props;
    return (<List component="nav"
        subheader={
            <ListSubheader component="div">
                Jegyzetek
        </ListSubheader>
        }
    >
        {topics.map(topic => <Topics key={`topic-${topic.name}`} topic={topic} selectItem={selectItem} />)}
    </List>)
};

export default Content;