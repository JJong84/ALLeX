// @ts-ignore
import React, { useState, useEffect } from 'react';
import { createLab, getSubstances } from '../axios'; // Import necessary functions
import { DEFAULT_SIZE, LabWithSubs, ObjectType, substanceImages, SubstanceNames } from '../types';
import './CreateLabs.css'; // Import CSS for styling
import flaskImg from '../assets/flask.png';
import bottleImg from '../assets/bottle.png';

interface Substance {
  substance_id: number;
  substance_name: SubstanceNames | "";
  x: number;
  y: number;
  case_type: ObjectType;
  image: string; // To track which image is currently being displayed
}

const CreateLab = () => {
  const [labName, setLabName] = useState(''); // Lab name
  const [goal, setGoal] = useState('');       // Lab goal
  const [substances, setSubstances] = useState<Substance[]>([]); // Substances
  const [materials, setMaterials] = useState<SubstanceNames[]>([]); // Materials fetched from backend
  const [showModal, setShowModal] = useState(true); // Modal state
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar state
  const [activeTab, setActiveTab] = useState('Tools'); // Active tab in sidebar
  const [selectedToolId, setSelectedToolId] = useState<number | null>(null); // Track selected tool

  const availableTools = ['플라스크', '시약병']; // Fixed tools

  // Function to drop tools or materials
  const handleDrop = (itemType: ObjectType) => {
    const imageWidth = 150;  // Fixed image width
    const imageHeight = 150; // Fixed image height
    const newX = Math.round((window.innerWidth / 2) - (imageWidth / 2)) ; // Center the image horizontally
    const newY = Math.round((window.innerHeight / 2) - (imageHeight / 2)); // Center the image vertically

    setSubstances([...substances, {
      substance_id: substances.length + 1,
      substance_name: "",
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
      substances,
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
          setMaterials(response.data.map((material) => material.substance_name)); // Just get names
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
  const handleAssignSubstance = (substanceName: SubstanceNames) => {
    if (selectedToolId !== null) {
      const updatedSubstances = substances.map(substance => {
        if (substance.substance_id === selectedToolId) {
          // If the selected tool matches, replace the image with the substance image
          return {
            ...substance,
            image: substanceImages[substanceName] || substance.image, 
            substance_name: substanceName
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
        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'Tools' ? 'active' : ''}`}
            onClick={() => setActiveTab('Tools')}
          >
            도구
          </button>
          <button
            className={`tab ${activeTab === 'Materials' ? 'active' : ''}`}
            onClick={() => setActiveTab('Materials')}
          >
            물질
          </button>
          {
            sidebarOpen &&
              <button className={`sidebar-header-toggle ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(!sidebarOpen)}>
                &#9776;
                </button>
          }
        </div>
        
        {/* Tab content */}
        <div className="tab-content">
          {activeTab === 'Tools' ? (
            <div>
              <h3>용액 취급 도구</h3>
              {availableTools.map((tool, index) => (
                <div
                  key={index}
                  onClick={() => handleDrop(tool === '플라스크' ? 'flask' : 'bottle')}
                  className='sidebar-button'
                  style={{
                    cursor: 'pointer',
                    padding: '5px',
                  }}>
                  {tool}
                </div>
              ))}
            </div>
          ) : (
            <div>
              {/* <h3>구분1</h3> */}
              {materials.length === 0 ? (
                <p>Loading materials...</p>
              ) : (
                materials.map(material => (
                  <div
                    className="sidebar-button"
                    key={material}
                    onClick={() => handleAssignSubstance(material)}
                    style={{
                      cursor: 'pointer',
                      padding: '5px',
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
      {
        !sidebarOpen &&
          <button className={`sidebar-toggle ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(!sidebarOpen)}>
          &#9776;
        </button>
      }
      <div className="substance-container">
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
                x: Math.round(e.clientX  - DEFAULT_SIZE[substance.case_type].width / 2) , // Adjust position to center on cursor (based on fixed width)
                y: Math.round(e.clientY - DEFAULT_SIZE[substance.case_type].height / 2), // Adjust position to center on cursor (based on fixed height)
              };
              setSubstances(updatedSubstances); // Update coordinates after dragging
            }}
          />
        ))}
      </div>

      {/* Modal for lab setup */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            {/* <h2>Lab Setup</h2> */}
            <label>제목</label>
            <input
              value={labName}
              onChange={(e) => setLabName(e.target.value)}
              placeholder="실험 제목을 입력해주세요."
            />
            <label>목표</label>
            <input
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="실험 목표를 입력해주세요."
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
            <button className="create-lab-button" onClick={handleCreateLab}>실험 생성</button>
          </div>
        </>

      )}
    </div>
  );
};

export default CreateLab;
