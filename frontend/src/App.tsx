import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { GraphCanvas, GraphCanvasRef, GraphNode, useSelection } from "reagraph";

import { API_URL } from "./config/constants";

interface Graph {
  nodes: {
    id: string;
    type: string;
    name: string;
  }[];
  edges: {
    id: string;
    source: string;
    target: string;
    relationship: string;
  }[];
}

function App() {
  const [entity, setEntity] = useState('')
  const [messages, setMessages] = useState([])
  const [graph, setGraph] = useState<Graph>({
    nodes: [],
    edges: [],
  })
  
  const getMessages = async () => {
    const { data } = await axios.get(`${API_URL}/messages`, { params: { entity }});
    if (data) setMessages(data);
  }

  const getGraph = async () => {
    const { data } = await axios.get(`${API_URL}/graph`);
    if (data) setGraph(data);
  }

  useEffect(() => {
    getGraph()
  }, [])

  useEffect(() => {
    getMessages();
  }, [entity])

  const nodes = useMemo(() => {
    return graph.nodes.map(node => {
      return {
        ...node,
        label: node.name,
      }
    })
  }, [graph])

  const edges = useMemo(() => {
    return graph.edges.map(node => {
      return {
        ...node,
        label: node.relationship,
      }
    })
  }, [graph])

  const graphRef = useRef<GraphCanvasRef | null>(null);
  const {
    selections,
    onNodeClick,
    onCanvasClick,
  } = useSelection({
    ref: graphRef,
    nodes: nodes,
    edges: edges,
    type: 'single',
  })

  const handleNodeClick = (e: GraphNode) => {
    if (onNodeClick) onNodeClick(e);
    setEntity(e.data.name);
  }

  const handleCanvasClick = (e: MouseEvent) => {
    if (onCanvasClick) onCanvasClick(e);
    setEntity('');
  }

  return (
    <div>
      <div style={{ position: 'relative', width: '100%', height: 500, border: '1px solid black' }}>
        <GraphCanvas
          nodes={nodes}
          edges={edges}
          labelType="all"
          ref={graphRef}
          selections={selections}
          onCanvasClick={handleCanvasClick}
          onNodeClick={handleNodeClick}
        />
      </div>
      <div>
        <ul>
          {messages.map(message => <li>{message}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default App
