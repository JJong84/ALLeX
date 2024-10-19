import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useState } from 'react';
import LabList from './components/LabList';
import LabInventory from './components/LabInventory';
import CreateLab from './components/CreateLabs';

function App() {
  // @ts-ignore
  const [labId, setLabId] = useState<number | null>(null);
  const [name, setName] = useState<string>("");

  const handleEnterLab = (id: number, name: string) => {
    setLabId(id);
    setName(name);
    console.log(id, name);
    window.location.href = `/labs/${id}`;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LabList onEnterLab={handleEnterLab} />} />
        <Route path="/labs/:id" element={<LabInventory />} />
        <Route path="/create-lab" element={<CreateLab />} />
      </Routes>
    </Router>
  )
}

export default App
