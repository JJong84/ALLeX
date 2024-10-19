import React, { useState } from 'react';
import axios from '../axios'; // Use the axios instance

const CreateLab = () => {
  const [labName, setLabName] = useState('');
  const [goal, setGoal] = useState('');
  const [substances, setSubstances] = useState([]);

  const availableSubstances = ['HCl', 'Water', 'Sodium'];

  const handleDrop = (substance) => {
    setSubstances([...substances, { substance_name: substance, x: 0, y: 0, case_type: 'flask' }]);
  };

  const handleCreateLab = () => {
    const labData = {
      lab_name: labName,
      goal: goal,
      substances: substances,
    };

    axios.post('/labs/', labData)
      .then(response => {
        console.log('Lab created:', response.data);
        window.location.href = '/';
      })
      .catch(error => {
        console.error('Error creating lab:', error);
      });
  };

  return (
    <div>
      <h1>Create Lab</h1>
      <div>
        <label>Lab Name: </label>
        <input value={labName} onChange={(e) => setLabName(e.target.value)} />
      </div>
      <div>
        <label>Goal: </label>
        <input value={goal} onChange={(e) => setGoal(e.target.value)} />
      </div>
      <div style={{ marginTop: '20px' }}>
        <h2>Available Substances</h2>
        {availableSubstances.map(substance => (
          <div
            key={substance}
            onClick={() => handleDrop(substance)}
            style={{ cursor: 'pointer', padding: '5px', backgroundColor: '#ddd', marginBottom: '10px' }}>
            {substance}
          </div>
        ))}
      </div>
      <div>
        <h2>Selected Substances</h2>
        {substances.map((substance, index) => (
          <div key={index}>
            <p>{substance.substance_name} in {substance.case_type}</p>
          </div>
        ))}
      </div>
      <button onClick={handleCreateLab}>Create Lab</button>
    </div>
  );
};

export default CreateLab;
