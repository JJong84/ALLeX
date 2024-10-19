import React, { useEffect, useState } from 'react';
import { getLabs } from '../axios'; // Use the axios instance
import './LabList.css'; // Import the CSS for styling
import { Lab } from '../types';
import backgroundImg from '../assets/background.jpg';
import step1Img from '../assets/step1.png';
import step2Img from '../assets/step2.png';
import step3Img from '../assets/step3.png';

interface LabListProps {
  onEnterLab: (id: number) => void;
}

const LabList = (props: LabListProps) => {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [selectedLab, setSelectedLab] = useState<number | null>(null);

  useEffect(() => {
    getLabs()
      .then(response => {
        setLabs(response.data);
      })
      .catch(error => {
        console.error('Error fetching labs:', error);
      });
  }, []);

  const enterLab = (labId: number) => {
    window.location.href = `/labs/${labId}`;  // Redirect to the lab page with the correct labId
  };

  const createLab = () => {
    window.location.href = '/create-lab';  // Redirect to the Create Lab page
  };

  return (
    <div className="lab-list-container">
      {/* Sticky top flex bar */}
      <header className="top-bar">
        <h1 className="allex-logo">ALLeX</h1>
      </header>

      {/* Full page background with text and gradient */}
      <section className="main-image-section">
        <div className="main-image">
          <img src={backgroundImg} alt="Background" className="background-img" />
          <div className="text-overlay">
            <h1>ALL science eXperiment, ALLeX</h1>
            <p>Join us in a virtual environment, with a high degree of freedom, to do the experiments we couldn't do because of lab equipment, because of money, because of safety!</p>
          </div>
        </div>
      </section>

      {/* Lab list */}
      <section className="lab-list-section">
        <div className="lab-list-page">
          {labs.map(lab => (
            <div key={lab.id} className="lab-list-item">
              <div className="lab-header">
                <strong>{lab.lab_name}</strong>
                <span className="lab-goal">{lab.goal || 'No goal specified'}</span>
                <button className="enter-lab-btn" onClick={() => enterLab(lab.id)}>참여하기</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Create new lesson */}
      <section className="create-lab-section">
        <h2>Create a new lesson</h2>
        <p>Are you a teacher? Drag and drop to create a lab.</p>
        <button className="create-lab-btn" onClick={createLab}>Create</button>

        {/* Three horizontally placed images with steps */}
        <div className="steps-container">
          <div className="step-card">
            <img src={step1Img} alt="Step 1" className="step-image" />
            <h3>Step 1</h3>
            <p>Create your lab</p>
          </div>
          <div className="step-card">
            <img src={step2Img} alt="Step 2" className="step-image" />
            <h3>Step 2</h3>
            <p>Drag and drop materials</p>
          </div>
          <div className="step-card">
            <img src={step3Img} alt="Step 3" className="step-image" />
            <h3>Step 3</h3>
            <p>Run your experiment</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LabList;
