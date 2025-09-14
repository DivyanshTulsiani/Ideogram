
import '@xyflow/react/dist/style.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from './pages/authpage';
import Reactflow from './pages/reactflow'



export default function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/">
                <Route path="/" element={<AuthPage/>}/>
                <Route path="/flow" element={<Reactflow/>}/>
            </Route>
        </Routes>
    </BrowserRouter>
  );
}

