import json

import networkx as nx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def read_json_file(filename):
    with open(filename) as f:
        json_file = json.load(f)
    return json_file


def read_graph():
    js_graph = read_json_file("./data/kg.json")
    return nx.node_link_graph(js_graph)


def read_messages():
    return read_json_file("./data/texts.json")


@app.get("/graph")
def get_graph():
    return read_json_file("./data/kg.json")


@app.get("/entities/{type}")
def get_entities(type: str):
    nodes = [y for _, y in read_graph().nodes(data=True) if y["type"] == type]
    return nodes


@app.get("/edges")
def get_edges(source: str, relationship: str):
    graph = read_graph()
    nodes_ids = [
        y
        for _, y, z in graph.edges(source, data=True)
        if z["relationship"] == relationship
    ]
    nodes = [y for x, y in graph.nodes(data=True) if x in nodes_ids]
    return nodes


@app.get("/path")
def get_path(source: str, target: str):
    paths = nx.all_simple_paths(read_graph(), source=source, target=target)
    return paths


@app.get("/messages")
def get_messages(entity: str | None = None):
    messages = read_messages()
    if entity:
        messages = [m for m in messages if entity.lower() in m.lower()]
    return messages
