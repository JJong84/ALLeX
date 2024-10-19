// @ts-ignore
import React, { useState, useEffect } from 'react';
import { createLab, getSubstances } from '../axios'; // Import necessary functions
import { LabWithSubs } from '../types';
import flaskImg from '../assets/flask.png';
import bottleImg from '../assets/bottle.png';
import './CreateLabs.css'; // Import CSS for styling
import flaskBTBImg from '../assets/Flask-BTB.png';
import flaskBTBH2OImg from '../assets/Flask-BTB+H2O.png';
import flaskBTBHCLImg from '../assets/Flask-BTB+HCL.png';
import flaskBTBNH3Img from '../assets/Flask-BTB+NH3.png';
import flaskMethylOrangeImg from '../assets/Flask-Methyl_orange.png';
import flaskMethylOrangeH2OImg from '../assets/Flask-Methyl_orange+H2O.png';
import flaskMethylOrangeHCLImg from '../assets/Flask-Methyl_orange+HCL.png';
import flaskMethylOrangeNH3Img from '../assets/Flask-Methyl_orange+NH3.png';
import flaskPhenolphthaleinImg from '../assets/Flask-Phenolphthalein.png';
import flaskPhenolphthaleinH2OImg from '../assets/Flask-Phenolphthalein+H2O.png';
import flaskPhenolphthaleinHCLImg from '../assets/Flask-Phenolphthalein+HCL.png';
import flaskPhenolphthaleinNH3Img from '../assets/Flask-Phenolphthalein+NH3.png';
import h2oImg from '../assets/H2O.png';
import hclImg from '../assets/HCL.png';
import nh3Img from '../assets/NH3.png';

// Hardcoded dictionary mapping substances to images
const substanceImages: { [key: string]: string } = {
  'BTB': flaskBTBImg,
  'BTB+물': flaskBTBH2OImg,
  'BTB+염산': flaskBTBHCLImg,
  'BTB+암모니아': flaskBTBNH3Img,
  '메틸 오렌지': flaskMethylOrangeImg,
  '메틸 오렌지+물': flaskMethylOrangeH2OImg,
  '메틸 오렌지+염산': flaskMethylOrangeHCLImg,
  '메틸 오렌지+암모니아': flaskMethylOrangeNH3Img,
  '페놀프탈레인': flaskPhenolphthaleinImg,
  '페놀프탈레인+물': flaskPhenolphthaleinH2OImg,
  '페놀프탈레인+염산': flaskPhenolphthaleinHCLImg,
  '페놀프탈레인+암모니아': flaskPhenolphthaleinNH3Img,
  '물': h2oImg,
  '염산': hclImg,
  '암모니아': nh3Img,
  // 추가 용액들 필요시 추가
};

interface Substance {
  substance_id: number;
  substance_name: string;
  x: number;
  y: number;
  case_type: string;
  image: string; // To track which image is currently being displayed
}

const CreateLab = () => {
  const [labName, setLabName] = useState(''); // Lab name
  const [goal, setGoal] = useState('');       // Lab goal
  const [substances, setSubstances] = useState<Substance[]>([]); // Substances
  const [materials, setMaterials] = useState<string[]>([]); // Materials fetched from backend
  const [showModal, setShowModal] = useState(true); // Modal state
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar state
  const [activeTab, setActiveTab] = useState('Tools'); // Active tab in sidebar
  const [selectedToolId, setSelectedToolId] = useState<number | null>(null); // Track selected tool

  const availableTools = ['플라스크', '시약병']; // Fixed tools

  // Function to drop tools or materials
  const handleDrop = (item: string, itemType: string) => {
    const imageWidth = 150;  // Fixed image width
    const imageHeight = 150; // Fixed image height

    const newX = (window.innerWidth / 2) - (imageWidth / 2) - 0.9 * (window.innerWidth / 2) ; // Center the image horizontally
    const newY = (window.innerHeight / 2) - (imageHeight / 2); // Center the image vertically

    setSubstances([...substances, {
      substance_id: substances.length + 1,
      substance_name: item,
      x: newX,
      y: newY,
      case_type: itemType,
      image: itemType === 'flask' ? flaskImg : bottleImg, // Initial image for tool
    }]);
  };

  // @ts-ignore
  const handleCreateLab = () => {
    const labData: LabWithSubs = {
      lab_name: labName,
      goal: goal,
      // @ts-ignore
      substances: substances,
    };

    createLab(labData)
      .then(response => {
        console.log('Lab created:', response.data);
        window.location.href = '/';
      })
      .catch(error => {
        console.error('Error creating lab:', error);
      });
  };

  // Fetch materials from backend
  useEffect(() => {
    if (activeTab === 'Materials') {
      getSubstances()
        .then(response => {
          setMaterials(response.data.map((material: { substance_name: string }) => material.substance_name)); // Just get names
        })
        .catch(error => {
          console.error('Error fetching materials:', error);
        });
    }
  }, [activeTab]); // Only fetch when switching to Materials tab

  // Function to select or deselect a tool
  const handleToolSelect = (id: number) => {
    if (selectedToolId === id) {
      setSelectedToolId(null); // Deselect if the tool is already selected
    } else {
      setSelectedToolId(id); // Select the tool
    }
  };

  // Function to assign substance to selected tool
  const handleAssignSubstance = (substanceName: string) => {
    if (selectedToolId !== null) {
      const updatedSubstances = substances.map(substance => {
        if (substance.substance_id === selectedToolId) {
          // If the selected tool matches, replace the image with the substance image
          return {
            ...substance,
            image: substanceImages[substanceName] || substance.image, // Replace image if available
          };
        }
        return substance;
      });
      setSubstances(updatedSubstances); // Update the substances array
    }
  };

  return (
    <div className="create-lab-container">
      {/* Title at the top */}
      {!showModal && (
        <h1 className="lab-title">{labName}</h1>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>{activeTab === 'Tools' ? 'Tools' : 'Materials'}</h2>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'Tools' ? 'active' : ''}`}
            onClick={() => setActiveTab('Tools')}
          >
            Tools
          </button>
          <button
            className={`tab ${activeTab === 'Materials' ? 'active' : ''}`}
            onClick={() => setActiveTab('Materials')}
          >
            Materials
          </button>
        </div>

        {/* Tab content */}
        <div className="tab-content">
          {activeTab === 'Tools' ? (
            <div>
              <h3>Available Tools</h3>
              {availableTools.map((tool, index) => (
                <div
                  key={index}
                  onClick={() => handleDrop(tool, tool === '플라스크' ? 'flask' : 'bottle')}
                  style={{
                    cursor: 'pointer',
                    padding: '5px',
                    backgroundColor: '#ddd',
                    marginBottom: '10px'
                  }}>
                  {tool}
                </div>
              ))}
            </div>
          ) : (
            <div>
              <h3>Available Materials</h3>
              {materials.length === 0 ? (
                <p>Loading materials...</p>
              ) : (
                materials.map(material => (
                  <div
                    key={material}
                    onClick={() => handleAssignSubstance(material)}
                    style={{
                      cursor: 'pointer',
                      padding: '5px',
                      backgroundColor: '#ddd',
                      marginBottom: '10px'
                    }}>
                    {material}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Button to toggle sidebar */}
      <button className={`sidebar-toggle ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(!sidebarOpen)}>
        &#9776;
      </button>

      {/* Render substances as draggable images */}
      {substances.map((substance, index) => (
        <img
          key={substance.substance_id}
          src={substance.image}
          alt={substance.substance_name}
          style={{
            position: 'absolute',
            left: `${substance.x}px`,
            top: `${substance.y}px`,
            cursor: 'move',
            border: substance.substance_id === selectedToolId ? '3px solid red' : 'none', // Add or remove border if selected
            width: 'auto', // Fixed size to ensure it remains consistent
            height: '300px',
          }}
          draggable
          onClick={() => handleToolSelect(substance.substance_id)} // Handle tool selection and deselection
          onDragEnd={(e) => {
            const updatedSubstances = [...substances];
            updatedSubstances[index] = {
              ...updatedSubstances[index],
              x: e.clientX - (window.innerWidth / 2) , // Adjust position to center on cursor (based on fixed width)
              y: e.clientY - 0.15 * (window.innerWidth / 2) , // Adjust position to center on cursor (based on fixed height)
            };
            setSubstances(updatedSubstances); // Update coordinates after dragging
          }}
        />
      ))}

      {/* Modal for lab setup */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Lab Setup</h2>
            <label>Lab Name:</label>
            <input
              value={labName}
              onChange={(e) => setLabName(e.target.value)}
              placeholder="Enter lab name"
            />
            <label>Goal:</label>
            <input
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Enter lab goal"
            />
            <div className="modal-actions">
              <button
                onClick={() => setShowModal(false)}
                disabled={!labName || !goal} // Disable button if inputs are empty
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page content after modal is dismissed */}
      {!showModal && (
        <>
          <div className="bottom-button-container">
            <button className="create-lab-button" onClick={handleCreateLab}>Create Lab</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CreateLab;
