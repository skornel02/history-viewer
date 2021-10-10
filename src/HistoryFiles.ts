import { htmlToDOM } from "html-react-parser";
import {
    Element,
    Node,
    Text
} from 'domhandler';

const globalContent = "https://docs.google.com/document/d/1ltZCNiI154npdUWUAHFuZC-lCZ32fYW7UVEvEru5Xxs/pub?embedded=true"

export interface HistoryTopic {
    name: string;
    items: HistoryItem[];
}

export interface HistoryItem {
    name: string;
    id: string;
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

    return fetch(globalContent, { headers }).then(response => response.text())
        .then(html => {
            const repairedHtml = html.replace('</head>', '</head><body>') + "</body>";
            console.log(repairedHtml);
            const domTree = htmlToDOM(repairedHtml);
            if (domTree.length === 0)
                throw new Error("Hiba a főtartalomjegyzék feldolgozása közben! html");

            console.log(domTree);
            const body = domTree[2] as Element;

            // console.log(htmlRoot);
            // const body = htmlRoot.children.find(child => child.type === "tag" && (child as Element).name === "body") as Element | undefined;
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
                id: ""
            }

            const pushItem = () => {
                if (item.name.length !== 0 && item.id.length !== 0) {
                    topic.items.push(item);
                    console.log("Persisting item: ", item.name);
                }
            }

            const pushTopic = () => {
                if (topic.name.length !== 0) {
                    allTopics.push(topic);
                    console.log("Persisting topic: ", topic.name);
                }
            }
            const rootDiv = body.children.filter(child => child.type === "tag" && (child as Element).name == "div")[0] as Element;


            for (const child of rootDiv.children) {
                if (child.type === "tag") {
                    const childElement = child as Element;
                    if (childElement.name === "h1") {
                        pushTopic();

                        const topicTitle = nodeToText(childElement);
                        topic = {
                            name: topicTitle,
                            items: []
                        }
                        item = {
                            name: "",
                            id: ""
                        }
                        console.log("Reading topic: ", topic.name);
                    } else if (childElement.name === "h2") {
                        console.log(childElement);
                        console.log("Reading item: ", item.name);
                        if (childElement.children.length > 0
                            && childElement.children[0].type === "tag"
                            && (childElement.children[0] as Element).children.length > 0
                            && (childElement.children[0] as Element).children[0].type === "tag") {
                            const url = ((childElement.children[0] as Element).children[0] as Element).attribs['href'] ?? "";
                            console.log(url);
                            const id = getIdFromGoogleLink(url);
                            console.log(id);
                            item = {
                                name: nodeToText(childElement),
                                id,
                            }
                            pushItem();
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
            if (item.id === id)
                return item;
        }
    }
    return undefined;
}

export function getIdFromGoogleLink(link: string): string {
    const matches1 = link.match(/d\/(.*)&sa.*/);
    const matches2 = link.match(/d\/(.*)\//);
    const matches3 = link.match(/id%3D(.*)&sa.*/);

    const matches = matches1 ?? matches2 ?? matches3 ?? ["", "-"];
    const id = matches[1]
        .replace(/\/edit$/, '')
        .replace(/\//, '');
    return id;
}