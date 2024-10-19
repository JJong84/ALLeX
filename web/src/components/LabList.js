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

  return (
    <div className="lab-list-page">
      <h1 className="lab-title">학습 그룹 이름</h1>
      <p className="lab-description">
        학습 그룹에 대한 간단한 설명이 들어가는 공간, 학습 그룹에 대한 설명이 들어가는 공간
      </p>

      <div className="new-lab-section">
        <h2>새로운 학습 생성 하기</h2>
        <div className="lab-cards">
          <div className="lab-card">
            <p>01. Lorem ipsum dolor sit</p>
          </div>
          <div className="lab-card">
            <p>02. Lorem ipsum dolor sit</p>
          </div>
          <div className="lab-card">
            <p>03. Lorem ipsum dolor sit</p>
          </div>
        </div>
      </div>

      <section className="lab-list-section">
        <h2>학습리스트</h2>
        {labs.map(lab => (
          <div key={lab.id} className="lab-list-item">
            <div className="lab-header" onClick={() => toggleLab(lab.id)} style={{ cursor: 'pointer' }}>
              <strong>{lab.lab_name}</strong>
              <button className="enter-lab-btn" onClick={() => enterLab(lab.id)}>참여하기</button>
            </div>
            {selectedLab === lab.id && (
              <div className="lab-details">
                <p><strong>Goal:</strong> {lab.goal || 'No goal specified'}</p>
              </div>
            )}
          </div>
        ))}
        <button className="create-lab-btn" onClick={() => window.location.href = '/create-lab'}>
          새로운 학습 생성하기
        </button>
      </section>
    </div>
  );
};

export default LabList;
