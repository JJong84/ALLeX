import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useState } from 'react';
import LabList from './components/LabList';
import LabInventory from './components/LabInventory';
import CreateLab from './components/CreateLabs';

function App() {
  const [labId, setLabId] = useState<number | null>(null);

  const handleEnterLab = (id: number) => {
    setLabId(id);
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
