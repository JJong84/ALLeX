import React, { useEffect, useState } from 'react';
import axios from '../axios'; // Use the axios instance

const LabList = () => {
  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);

  useEffect(() => {
    axios.get('/labs/')
      .then(response => {
        setLabs(response.data);
      })
      .catch(error => {
        console.error('Error fetching labs:', error);
      });
  }, []);

  const toggleLab = (labId) => {
    setSelectedLab(selectedLab === labId ? null : labId);
  };

  const enterLab = (labId) => {
    window.location.href = `/labs/${labId}`;  // Redirect to the lab page with the correct labId
  };

  return (
    <div>
      <h1>Lab List</h1>
      {labs.map(lab => (
        <div key={lab.id}>
          <div onClick={() => toggleLab(lab.id)} style={{ cursor: 'pointer', margin: '10px 0' }}>
            <strong>{lab.lab_name}</strong>
          </div>
          {selectedLab === lab.id && (
            <div style={{ paddingLeft: '20px' }}>
              <p><strong>Goal:</strong> {lab.goal || 'No goal specified'}</p>
              <button onClick={() => enterLab(lab.id)}>Enter Lab</button>
            </div>
          )}
        </div>
      ))}
      <button onClick={() => window.location.href = '/create-lab'}>Create Lab</button>
    </div>
  );
};

export default LabList;
