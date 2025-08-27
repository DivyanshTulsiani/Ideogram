import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, Controls, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'User Uploads Image' },
    position: { x: 250, y: 5 },
  },
  {
    id: '2',
    type: 'default', // A decision node
    data: { label: 'Validate File Type (JPEG/PNG)?' },
    position: { x: 250, y: 125 },
  },
  {
    id: '3',
    type: 'default',
    data: { label: 'Process: Computer Vision Model (Object Detection)' },
    position: { x: 100, y: 250 },
  },
  {
    id: '4',
    type: 'output',
    data: { label: 'Error: Invalid File Type' },
    position: { x: 450, y: 250 },
  },
  {
    id: '5',
    type: 'output',
    data: { label: 'Output: Formatted JSON with Object Data' },
    position: { x: 100, y: 375 },
  },
];
const initialEdges = [
  { 
    id: 'e1-2', 
    source: '1', 
    target: '2', 
    animated: true 
  },
  { 
    id: 'e2-3', 
    source: '2', 
    target: '3', 
    label: 'Valid', 
    animated: true 
  },
  { 
    id: 'e2-4', 
    source: '2', 
    target: '4', 
    label: 'Invalid' 
  },
  { 
    id: 'e3-5', 
    source: '3', 
    target: '5', 
    animated: true 
  },
];
const styles = {
  background: 'red',
  width: '100%',
  height: 300,
};
export default function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: any) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params: any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        style={styles}
        // colorMode='dark'
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap nodeStrokeWidth={3} />
      </ReactFlow>
    </div>
  );
}

