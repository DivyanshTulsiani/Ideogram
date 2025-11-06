import { useState, createContext, useContext } from 'react';
import '@xyflow/react/dist/style.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from './pages/authpage';
import Reactflow from './pages/reactflow'
import Landing from './pages/landing';
import LoginPage from './pages/loginpage';
import { GenerateLoaderContextProvider } from './components/Input';
import {
    type Node,
    type Edge
} from '@xyflow/react';
// import '.../tailwind.config.ts'


interface FlowProviderProps {
    children: React.ReactNode
}

interface FlowContextType {
    initialEdges: Edge[],
    initialNodes: Node[],
    SetinitialEdges: (edges: Edge[]) => void;
    SetinitialNodes: (nodes: Node[]) => void;
}

export const FlowContext = createContext<FlowContextType | undefined>(undefined);

export const FlowProvider = ({ children }: FlowProviderProps) => {
    const [initialEdges, SetinitialEdges] = useState<Edge[]>([])
    const [initialNodes, SetinitialNodes] = useState<Node[]>([])

    return (
        <>
            <FlowContext.Provider value={{
                initialEdges: initialEdges,
                SetinitialEdges: SetinitialEdges,
                initialNodes: initialNodes,
                SetinitialNodes: SetinitialNodes
            }}>
                {children}
            </FlowContext.Provider>
        </>
    )
}

export const useFlowContext = () => {
    const context = useContext(FlowContext);
    
    if (!context) {
        throw new Error('useFlowContext must be used within a FlowProvider');
    }
    
    return context;
};


export default function App() {
    return (
        <FlowProvider>
            <GenerateLoaderContextProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/">
                        <Route path="/auth" element={<AuthPage />} />
                        <Route path="/" element={<Landing />} />
                        <Route path="/flow" element={<Reactflow />} />
                        <Route path='/login' element={<LoginPage/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
            </GenerateLoaderContextProvider>
        </FlowProvider>
    );
}

