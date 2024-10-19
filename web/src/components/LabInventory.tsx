import { useEffect, useState } from 'react';
import { getSubstancesInLab } from '../axios'; // Use the axios instance
import { Inventory } from '../types';
import Detection from './Detection';
import { useParams } from 'react-router-dom';
// @ts-ignore
import Substance from './Substance';
import "./detection.css";

const LabInventory = () => {
  const {id} = useParams();
  console.log(id);
  const [inventory, setInventory] = useState<Inventory | undefined>(undefined);

  useEffect(() => {
    if (id) {
      // @ts-ignore
      getSubstancesInLab(id)
        .then(response => {
          setInventory(response.data);
        })
        .catch(error => {
          console.error('Error fetching lab inventory:', error);
        });
    }
  }, [id]);

  const handleResetClick = () => {
    //TODO
  }

  return (
    <div id="lab-inventory">
      <header id="lab-inventory-header">
        <button onClick={handleResetClick}>
          초기화
        </button>
        {id}
      </header>
      <Detection inventory={inventory} />
    </div>
  );
};

export default LabInventory;
