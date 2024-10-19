import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LabList from './components/LabList';
import LabInventory from './components/LabInventory';
import CreateLab from './components/CreateLab';

function App() {
  const [labId, setLabId] = useState(null);

  const handleEnterLab = (id) => {
    setLabId(id);
    window.location.href = `/labs/${id}`;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LabList onEnterLab={handleEnterLab} />} />
        <Route path="/labs/:id" element={<LabInventory labId={labId} />} />
        <Route path="/create-lab" element={<CreateLab />} />
      </Routes>
    </Router>
  );
}

export default App;
