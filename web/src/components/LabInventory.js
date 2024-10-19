import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams to get URL parameters
import axios from '../axios'; // Use the axios instance

const LabInventory = () => {
  const { id: labId } = useParams();  // Get labId from the URL params
  const [inventory, setInventory] = useState(null);

  useEffect(() => {
    if (labId) {
      axios.get(`/labs/${labId}/substances`)
        .then(response => {
          setInventory(response.data);
        })
        .catch(error => {
          console.error('Error fetching lab inventory:', error);
        });
    }
  }, [labId]);

  return (
    <div>
      <h1>Lab Inventory</h1>
      {inventory ? (
        <pre>{JSON.stringify(inventory, null, 2)}</pre>
      ) : (
        <p>Loading inventory...</p>
      )}
    </div>
  );
};

export default LabInventory;
