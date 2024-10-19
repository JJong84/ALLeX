import { useEffect, useState } from 'react';
import { getSubstancesInLab } from '../axios'; // Use the axios instance
import { Inventory } from '../types';
import Detection from './Detection';
import { useParams } from 'react-router-dom';
import Substance from './Substance';

const LabInventory = () => {
  const {id} = useParams();
  console.log(id);
  const [inventory, setInventory] = useState<Inventory | undefined>(undefined);

  useEffect(() => {
    if (id) {
      getSubstancesInLab(id)
        .then(response => {
          setInventory(response.data);
        })
        .catch(error => {
          console.error('Error fetching lab inventory:', error);
        });
    }
  }, [id]);

  return (
    <div>
      <h1>Lab Inventory</h1>
      <Detection inventory={inventory} />
    </div>
  );
};

export default LabInventory;
