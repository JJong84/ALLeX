import React, { useState, useEffect } from 'react';
import { createLab, getSubstances } from '../axios'; // Import the necessary functions
import { LabWithSubs } from '../types';
import './CreateLabs.css'; // Import the CSS for styling

interface Substance {
  substance_id: number;
  substance_name: string;
}

const CreateLab = () => {
  const [labName, setLabName] = useState(''); // Lab name
  const [goal, setGoal] = useState('');       // Lab goal
  const [substances, setSubstances] = useState<Substance[]>([]); // Substances (for selected items)
  const [materials, setMaterials] = useState<Substance[]>([]); // Materials fetched from backend
  const [showModal, setShowModal] = useState(true); // Modal state
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar state
  const [activeTab, setActiveTab] = useState('Tools'); // Active tab in sidebar

  const availableTools = ['플라스크', '시약병']; // Fixed tools

  // Function to drop tools or materials
  const handleDrop = (item: string) => {
    setSubstances([...substances, { substance_id: substances.length + 1, substance_name: item }]);
  };

  const handleCreateLab = () => {
    const labData: LabWithSubs = {
      lab_name: labName,
      goal: goal,
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
      getSubstances() // Use the imported getSubstances function
        .then(response => {
          setMaterials(response.data); // Assume response.data contains an array of substances
        })
        .catch(error => {
          console.error('Error fetching materials:', error);
        });
    }
  }, [activeTab]); // Only fetch when switching to Materials tab

  // Function to update the page title when lab name changes
  useEffect(() => {
    if (labName) {
      document.title = labName; // Change the page title to the lab name
    }
  }, [labName]);

  return (
    <div>
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
                  onClick={() => handleDrop(tool)}
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
                    key={material.substance_id} // Use substance_id as a unique key
                    onClick={() => handleDrop(material.substance_name)}
                    style={{
                      cursor: 'pointer',
                      padding: '5px',
                      backgroundColor: '#ddd',
                      marginBottom: '10px'
                    }}>
                    {material.substance_name}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Button outside the sidebar to toggle */}
      <button className={`sidebar-toggle ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(!sidebarOpen)}>
        &#9776;
      </button>

      {/* Modal to input Lab Name and Goal */}
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
          <h1>{labName}</h1>
          <div>
            <label>Goal: </label>
            <p>{goal}</p>
          </div>

          <div style={{ marginTop: '20px' }}>
            <h2>Available Substances</h2>
            {substances.map((substance, index) => (
              <div key={index}>
                <p>{substance.substance_name}</p>
              </div>
            ))}
          </div>
          <button onClick={handleCreateLab}>Create Lab</button>
        </>
      )}
    </div>
  );
};

export default CreateLab;
