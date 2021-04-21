import { htmlToDOM } from "html-react-parser";
import {
    Element,
    Node,
    Text
} from 'domhandler';

const globalContent = "https://docs.google.com/document/d/e/2PACX-1vQvXnfWjCvELzplW7pWR4SU63EJpGZ38b5tq7G2JKHqY6qf8RJOnabaYDSwXGsvbC8CTqq3ieXlzvnR/pub?embedded=true"

export interface HistoryTopic {
    name: string;
    items: HistoryItem[];
}

export interface HistoryItem {
    name: string;
    realUrl: string;
    publishUrl: string;
}

const nodeToText = (node: Node): string => {
    if (node.type === "text") {
        return (node as Text).data;
    } else if (node.type === "tag") {
        const elem = node as Element;
        return elem.children.map(node => nodeToText(node)).join("\n");
    } else {
        return "";
    }
}

export function loadHistoryItems(): Promise<HistoryTopic[]> {
    const headers = new Headers();
    headers.append('pragma', 'no-cache');
    headers.append('cache-control', 'no-cache');

    return fetch(globalContent, {headers}).then(response => response.text())
        .then(html => {
            console.log(html);
            const domTree = htmlToDOM(html);
            if (domTree.length === 0)
                throw new Error("Hiba a főtartalomjegyzék feldolgozása közben! html");
            
            const htmlRoot = domTree[0] as Element;

            console.log(htmlRoot);
            const body = htmlRoot.children.find(child => child.type === "tag" && (child as Element).name === "body") as Element | undefined;
            console.log(body);
            if (body === undefined)
                throw new Error("Hiba a főtartalomjegyzék feldolgozása közben! body");

            const allTopics: HistoryTopic[] = [];

            let topic: HistoryTopic = {
                name: "",
                items: [],
            }
            let item: HistoryItem = {
                name: "",
                publishUrl: "",
                realUrl: ""
            }

            const pushItem = () => {
                if (item.name.length !== 0 && item.publishUrl.length !== 0 && item.realUrl.length !== 0) {
                    topic.items.push(item);
                    console.log("Persisting item: ", item.name);
                }
            }

            const pushTopic = () => {
                pushItem();
                if (topic.name.length !== 0) {
                    allTopics.push(topic);                    
                    console.log("Persisting topic: ", topic.name);
                }
            }

            for (const child of body.children) {
                if (child.type === "tag") {
                    const childElement = child as Element;
                    if (childElement.name === "h1") {
                        pushTopic();

                        const topicTitle = nodeToText( childElement);
                        topic = {
                            name: topicTitle,
                            items: []
                        }
                        item = {
                            name: "",
                            publishUrl: "",
                            realUrl: ""
                        }
                        console.log("Reading topic: ", topic.name);
                    } else if (childElement.name === "h2") {
                        pushItem();
                        item = {
                            name: nodeToText( childElement),
                            publishUrl: "",
                            realUrl: "",
                        }
                        console.log("Reading item: ", item.name);
                    } else if (childElement.name === "p") {
                        const content = nodeToText( childElement)
                            .replace(/\/$/, '');
                        if (content.startsWith('https://docs.google.com/document/d/e/')) {
                            console.log("Found publish url...")
                            item.publishUrl = content;
                        } else if (content.startsWith('https://docs.google.com/document/d/')) {
                            console.log("Found real url...")
                            item.realUrl = content;
                        }
                    }
                }
            }
            pushTopic();

            return allTopics;
        })
}

export function getTopicFromItem(topics: HistoryTopic[], item: HistoryItem): HistoryTopic {
    for (const topic of topics) {
        if (topic.items.some(match => match === item))
            return topic;
    }
    throw Error("No topic found");
}

export function getHistoryItemById(topics: HistoryTopic[], id: string): HistoryItem | undefined {
    for (const topic of topics) {
        for (const item of topic.items) {
            if (item.realUrl.endsWith(id)) 
                return item;
        }
    }
    return undefined;
}