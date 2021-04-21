import React from 'react';
import { HistoryItem, HistoryTopic } from './HistoryFiles';

const Topics: React.FunctionComponent<{
    topic: HistoryTopic
    selectItem: (item: HistoryItem) => void;
}> = props => {
    const {topic, selectItem} = props;
    return (
        <>
            {topic.name}
            <ul>
                {topic.items.map(item => <li key={`navlink-${item.name}`} >
                    <a href={`#${topic.name}/${item.name}`} onClick={(e) => {
                        e.preventDefault();
                        selectItem(item);
                    }}>{item.name}</a>
                </li>)}
            </ul>
        </>
    )
};

const Content: React.FunctionComponent<{
    topics: HistoryTopic[];
    selectItem: (item: HistoryItem) => void;
}> = props => {
    const {topics, selectItem} = props;
    return (<>
        {topics.map(topic => <Topics key={`topic-${topic.name}`} topic={topic} selectItem={selectItem}/>)}
    </>)
};

export default Content;