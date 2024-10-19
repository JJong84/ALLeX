import React, { useEffect, useState } from 'react';
import axios from '../axios'; // Use the axios instance
import './LabList.css'; // Import the CSS for styling

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

  const createLab = () => {
    window.location.href = '/create-lab';  // Redirect to the Create Lab page
  };

  return (
    <div className="lab-list-page">
      <h2>학습리스트</h2>
      {labs.map(lab => (
        <div key={lab.id} className="lab-list-item">
          <div className="lab-header" onClick={() => toggleLab(lab.id)}>
            <strong>{lab.lab_name}</strong>
            <div className="lab-header-actions">
              <button className="enter-lab-btn" onClick={() => enterLab(lab.id)}>참여하기</button>
              <span className={`toggle-arrow ${selectedLab === lab.id ? 'open' : ''}`}>
                {selectedLab === lab.id ? '▲' : '▼'}
              </span>
            </div>
          </div>
          {selectedLab === lab.id && (
            <>
              <div className="lab-details">
                <p><strong>학습 목표:</strong></p>
                <p>{lab.goal || 'No goal specified'}</p>
              </div>
              <hr className="lab-divider" />
            </>
          )}
        </div>
      ))}
      
      {/* Create Lab Button */}
      <button className="create-lab-btn" onClick={createLab}>
        새로운 학습 생성하기
      </button>
    </div>
  );
};

export default LabList;
