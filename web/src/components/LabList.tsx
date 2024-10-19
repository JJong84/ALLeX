// @ts-ignore
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
// @ts-ignore
const LabList = (props: LabListProps) => {
  const [labs, setLabs] = useState<Lab[]>([]);
  // @ts-ignore
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
            <h1>ALLeX: ALL science eXperiment</h1>
            <p>안전, 설비 상으로 진행하지 못한 과학 실험을 모두 경험해보세요. </p>
            <p>호기심 가는 대로 다양한 상호작용, 자유도 높은 실험이 알렉스에서는 모두 가능합니다.</p>
          </div>
        </div>
      </section>

      {/* Lab list */}
      <section className="lab-list-section">
        <div className="lab-list-page">
          {labs.map(lab => (
            <div key={lab.id} className="lab-list-item">
              <div className="lab-header">
                <div className="lab-info">
                  <strong className="lab-name">{lab.lab_name}</strong>
                  <span className="lab-goal">{lab.goal || 'No goal specified'}</span>
                </div>
                <button className="enter-lab-btn" onClick={() => enterLab(lab.id)}>참여하기</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Create new lesson */}
      <section className="create-lab-section">
        <h2>새로운 실험 생성하기</h2>
        <p>선생님이세요? ALLeX를 통해 손쉽게 실험을 준비하세요.</p>
        <button className="create-lab-btn" onClick={createLab}>생성하기</button>

        {/* Three horizontally placed images with steps */}
        <div className="steps-container">
          <div className="step-card">
            <img src={step1Img} alt="Step 1" className="step-image" />
            <h3>01. 제목과 설명</h3>
            <p>학습을 생성하면 진행할 학습명과 설명을 적어주세요.</p>
          </div>
          <div className="step-card">
            <img src={step2Img} alt="Step 2" className="step-image" />
            <h3>02. 필요한 도구 생성</h3>
            <p>좌측의 메뉴에서 필요한 도구를 눌러 화면에 생성할 수 있습니다.</p>
          </div>
          <div className="step-card">
            <img src={step3Img} alt="Step 3" className="step-image" />
            <h3>03. 도구에 물질 담기</h3>
            <p>도구를 선택하고 “물질”탭에서 물질을 눌러면 물질을 담을 수 있습니다.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LabList;
