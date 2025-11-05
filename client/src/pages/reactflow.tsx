import { useCallback, useEffect,useState, type ChangeEventHandler } from 'react';
import Input from '../components/Input';
import { GenerateLoader } from '../components/GenerateLoader';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
// import 'tailwind.css';
// import '.../tailwind.config.ts'
import {
  Background,
  ReactFlow,
  addEdge,
  ConnectionLineType,
  Panel,
  useNodesState,
  ReactFlowProvider,
  useEdgesState,
  Controls,
  BackgroundVariant,
  type Node,
  type Edge,
  type Connection,
  type ColorMode
} from '@xyflow/react';
import dagre from '@dagrejs/dagre';
import { useFlowContext } from '../App';
// import Custom1 from '../components/CustomNode1';
import StyledNode from '../components/CustomNode1';
import { StyledNodeEdit } from '../components/CustomNode1';

import '@xyflow/react/dist/style.css';

import  SidebarEdit  from '../components/SidebarEdit';
import { DnDProvider } from '../hooks/useDnd';

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

const nodeTypes = {
    default: StyledNode,
    output: StyledNode,
    input: StyledNode,
    edit: StyledNodeEdit,
}

const getLayoutedElements = (nodes: any[], edges: any[], direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };

    return newNode;
  });

  return { nodes: newNodes, edges };
};


//since we have shifted to context api for state mnagemetn we will have to move
//this to a new comp since we cant use usestate outside of  a comp so ot is neccesary

// const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
//   initialNodes,
//   initialEdges,
// );

const Flow = () => {

  const {initialEdges,initialNodes} = useFlowContext()

  const [colorMode, setColorMode] = useState<ColorMode>('light');

  const onChange: ChangeEventHandler<HTMLSelectElement> = (evt) => {
    setColorMode(evt.target.value as ColorMode);
  };

  const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);

  useEffect(()=>{
    if(initialNodes.length > 0 || initialEdges.length > 0){
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        initialNodes,
        initialEdges,
      );
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);

    }
  },[initialEdges,initialNodes,setNodes,setEdges])

//   const [initialNodes, SetinitialNodes] = useState<Node[]>([]);
// const [initialEdges, SetinitialEdges] = useState<Edge[]>([]);


  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge({ ...params, type: ConnectionLineType.SmoothStep, animated: true }, eds),
      ),
    [setEdges],
  );
  const onLayout = useCallback(
    (direction: string | undefined) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        nodes,
        edges,
        direction,
      );

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges],
  );

  return (
    <div style={{ width: '100%', height: '100dvh' }}>
    <div className='dndflow'>
    <div  className='reactflow-wrapper'>
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      connectionLineType={ConnectionLineType.SmoothStep}
      nodeTypes={nodeTypes}
      colorMode={colorMode}
      fitView
    >
      <Panel position="top-right">
        <button className="xy-theme__button" onClick={() => onLayout('TB')}>
          vertical layout
        </button>
        <button className="xy-theme__button" onClick={() => onLayout('LR')}>
          horizontal layout
        </button>
      </Panel>

    <Panel position="top-right">
        <select
          className="xy-theme__select"
          onChange={onChange}
          data-testid="colormode-select"
        >
          <option value="dark">dark</option>
          <option value="light">light</option>
          <option value="system">system</option>
        </select>
      </Panel>
      <Panel position='center-left'>
        <SidebarEdit/>
      </Panel>
      {/* <Panel position='bottom-center'>
        <button  onClick={()=>SetinitialNodes(node)}>
          hi
        </button>
        <button className='w-20 h-5 rounded-xl bg-blue-500' onClick={()=>SetinitialEdges(edge)}>
          hi
        </button>
        <div>
          <h2>this is inp</h2>
          <input className='bg-red-300'/>
        </div>
    
      </Panel> */}
      <Controls/>
      {/* lines cross dots*/}
      <Background bgColor='#fbfbfb' variant={BackgroundVariant.Dots}/>

    </ReactFlow>
    </div>
    </div>

    </div>
  );
};

const Parent = () =>{

    const [SidebarOpen,SetSidebar] = useState<boolean>(true)

  return(
    <> 
    <div className='relative w-full h-screen'>
        <ReactFlowProvider>
        <DnDProvider>
        <div className='flex flex-1'>
            <div className=''>
                <Sidebar SidebarOpen={SidebarOpen} SetSidebar={SetSidebar}/>
            </div>
            <div className='flex-1 relative'>
            <Navbar SidebarOpen={SidebarOpen} SetSidebar={SetSidebar}/>
            <Flow/>
            </div>
        </div>
        <GenerateLoader/>
        <Input/>
        </DnDProvider>
        </ReactFlowProvider>
    </div>
    </>
  )
}

export default function Reactflow() {
  return <Parent/>;
}
















// import { useState, useCallback } from 'react';
// import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, Controls, MiniMap } from '@xyflow/react';
// import '@xyflow/react/dist/style.css';

// const initialNodes = [
//   {
//     "id": "1",
//     "type": "input",
//     "data": {
//         "label": "Resume Start"
//     },
//     "position": {
//         "x": 0,
//         "y": 0
//     }
// },
// {
//     "id": "2",
//     "type": "default",
//     "data": {
//         "label": "Education"
//     },
//     "position": {
//         "x": 0,
//         "y": 0
//     }
// },
// {
//     "id": "3",
//     "type": "default",
//     "data": {
//         "label": "Guru Gobind Singh Indraprastha University (B.Tech IT)"
//     },
//     "position": {
//         "x": 0,
//         "y": 0
//     }
// },
// {
//     "id": "4",
//     "type": "default",
//     "data": {
//         "label": "Amity International School (Senior Secondary)"
//     },
//     "position": {
//         "x": 0,
//         "y": 0
//     }
// },
// {
//     "id": "5",
//     "type": "default",
//     "data": {
//         "label": "Technical Skills"
//     },
//     "position": {
//         "x": 0,
//         "y": 0
//     }
// },
// {
//     "id": "6",
//     "type": "default",
//     "data": {
//         "label": "Languages: JavaScript, Python, C/C++, HTML/CSS, SQL"
//     },
//     "position": {
//         "x": 0,
//         "y": 0
//     }
// },
// {
//     "id": "7",
//     "type": "default",
//     "data": {
//         "label": "Frameworks & Libraries: React.js, Node.js, Express.js, NumPy, Matplotlib, pandas"
//     },
//     "position": {
//         "x": 0,
//         "y": 0
//     }
// },
// {
//     "id": "8",
//     "type": "default",
//     "data": {
//         "label": "Developer Tools: Git/GitHub, VS Code, PyCharm, BASH, Postman"
//     },
//     "position": {
//         "x": 0,
//         "y": 0
//     }
// },
// {
//     "id": "9",
//     "type": "default",
//     "data": {
//         "label": "Databases: MongoDB"
//     },
//     "position": {
//         "x": 0,
//         "y": 0
//     }
// },
// {
//     "id": "10",
//     "type": "default",
//     "data": {
//         "label": "Trainings & Courses"
//     },
//     "position": {
//         "x": 0,
//         "y": 0
//     }
// },
// {
//     "id": "11",
//     "type": "default",
//     "data": {
//         "label": "Python for Financial Analysis and Algorithmic Trading (Udemy)"
//     },
//     "position": {
//         "x": 0,
//         "y": 0
//     }
// },
// {
//     "id": "12",
//     "type": "default",
//     "data": {
//         "label": "Algorithmic Trading A-Z with Python, Machine Learning & AWS (Udemy)"
//     },
//     "position": {
//         "x": 0,
//         "y": 0
//     }
// },
// {
//     "id": "13",
//     "type": "default",
//     "data": {
//         "label": "Projects"
//     },
//     "position": {
//         "x": 0,
//         "y": 0
//     }
// },
// {
//     "id": "14",
//     "type": "default",
//     "data": {
//         "label": "Journizz (MongoDB, Node.js, Express.js, JWT, Gemini API)"
//     },
//     "position": {
//         "x": 0,
//         "y": 0
//     }
// },
// {
//     "id": "15",
//     "type": "default",
//     "data": {
//         "label": "CodeMagico (JavaScript, HTML/CSS, DOM, UI/UX)"
//     },
//     "position": {
//         "x": 0,
//         "y": 0
//     }
// },
// {
//     "id": "16",
//     "type": "default",
//     "data": {
//         "label": "Relaxio (JavaScript, OpenWeather API, HTML/CSS, REST API)"
//     },
//     "position": {
//         "x": 0,
//         "y": 0
//     }
// },
// {
//     "id": "17",
//     "type": "default",
//     "data": {
//         "label": "Net Daddy (Hackathon - MERN, Gemini AI, Twilio, Chrome Extension)"
//     },
//     "position": {
//         "x": 0,
//         "y": 0
//     }
// },
// {
//     "id": "18",
//     "type": "default",
//     "data": {
//         "label": "Achievements"
//     },
//     "position": {
//         "x": 0,
//         "y": 0
//     }
// },
// {
//     "id": "19",
//     "type": "default",
//     "data": {
//         "label": "LeetCode Achievements (100+ problems, Top 6.9%, Rating 1475)"
//     },
//     "position": {
//         "x": 0,
//         "y": 0
//     }
// },
// {
//     "id": "20",
//     "type": "default",
//     "data": {
//         "label": "Model United Nations (Verbal Mention Award)"
//     },
//     "position": {
//         "x": 0,
//         "y": 0
//     }
// },
// {
//     "id": "21",
//     "type": "output",
//     "data": {
//         "label": "Resume End"
//     },
//     "position": {
//         "x": 0,
//         "y": 0
//     }
// }
// ];
// const initialEdges = [
//   {
//     "id": "e1-2",
//     "source": "1",
//     "target": "2"
// },
// {
//     "id": "e1-5",
//     "source": "1",
//     "target": "5"
// },
// {
//     "id": "e1-10",
//     "source": "1",
//     "target": "10"
// },
// {
//     "id": "e1-13",
//     "source": "1",
//     "target": "13"
// },
// {
//     "id": "e1-18",
//     "source": "1",
//     "target": "18"
// },
// {
//     "id": "e2-3",
//     "source": "2",
//     "target": "3"
// },
// {
//     "id": "e2-4",
//     "source": "2",
//     "target": "4"
// },
// {
//     "id": "e5-6",
//     "source": "5",
//     "target": "6"
// },
// {
//     "id": "e5-7",
//     "source": "5",
//     "target": "7"
// },
// {
//     "id": "e5-8",
//     "source": "5",
//     "target": "8"
// },
// {
//     "id": "e5-9",
//     "source": "5",
//     "target": "9"
// },
// {
//     "id": "e10-11",
//     "source": "10",
//     "target": "11"
// },
// {
//     "id": "e10-12",
//     "source": "10",
//     "target": "12"
// },
// {
//     "id": "e13-14",
//     "source": "13",
//     "target": "14"
// },
// {
//     "id": "e13-15",
//     "source": "13",
//     "target": "15"
// },
// {
//     "id": "e13-16",
//     "source": "13",
//     "target": "16"
// },
// {
//     "id": "e13-17",
//     "source": "13",
//     "target": "17"
// },
// {
//     "id": "e18-19",
//     "source": "18",
//     "target": "19"
// },
// {
//     "id": "e18-20",
//     "source": "18",
//     "target": "20"
// },
// {
//     "id": "e3-21",
//     "source": "3",
//     "target": "21"
// },
// {
//     "id": "e4-21",
//     "source": "4",
//     "target": "21"
// },
// {
//     "id": "e6-21",
//     "source": "6",
//     "target": "21"
// },
// {
//     "id": "e7-21",
//     "source": "7",
//     "target": "21"
// },
// {
//     "id": "e8-21",
//     "source": "8",
//     "target": "21"
// },
// {
//     "id": "e9-21",
//     "source": "9",
//     "target": "21"
// },
// {
//     "id": "e11-21",
//     "source": "11",
//     "target": "21"
// },
// {
//     "id": "e12-21",
//     "source": "12",
//     "target": "21"
// },
// {
//     "id": "e14-21",
//     "source": "14",
//     "target": "21"
// },
// {
//     "id": "e15-21",
//     "source": "15",
//     "target": "21"
// },
// {
//     "id": "e16-21",
//     "source": "16",
//     "target": "21"
// },
// {
//     "id": "e17-21",
//     "source": "17",
//     "target": "21"
// },
// {
//     "id": "e19-21",
//     "source": "19",
//     "target": "21"
// },
// {
//     "id": "e20-21",
//     "source": "20",
//     "target": "21"
// }
// ];
// const styles = {
//   background: 'red',
//   width: '100%',
//   height: 300,
// };
// export default function Reactflow() {
//   const [nodes, setNodes] = useState(initialNodes);
//   const [edges, setEdges] = useState(initialEdges);

//   const onNodesChange = useCallback(
//     (changes: any) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
//     [],
//   );
//   const onEdgesChange = useCallback(
//     (changes: any) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
//     [],
//   );
//   const onConnect = useCallback(
//     (params: any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
//     [],
//   );

//   return (
//     <div style={{ width: '100vw', height: '100vh' }}>
//       <ReactFlow
//         style={styles}
//         // colorMode='dark'
//         nodes={nodes}
//         edges={edges}
//         onNodesChange={onNodesChange}
//         onEdgesChange={onEdgesChange}
//         onConnect={onConnect}
//         fitView
//       >
//         <Background />
//         <Controls />
//         <MiniMap nodeStrokeWidth={3} />
//       </ReactFlow>
//     </div>
//   );
// }