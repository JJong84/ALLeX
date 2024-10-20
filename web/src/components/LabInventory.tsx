import { useEffect, useState } from 'react';
import { getSubstancesInLab } from '../axios'; // Use the axios instance
import { Inventory } from '../types';
import Detection from './Detection';
import { useParams } from 'react-router-dom';
// @ts-ignore
import Substance from './Substance';
import "./detection.css";
import CloseIcon from '../assets/Group 28.png';

const LabInventory = () => {
  const {id} = useParams();
  const [inventory, setInventory] = useState<Inventory | undefined>(undefined);
  const [name, setName] = useState("");

  useEffect(() => {
    if (id) {
      // @ts-ignore
      getSubstancesInLab(id)
        .then(response => {
          setInventory(response.data.substances);
          setName(response.data.lab_name);
        })
        .catch(error => {
          console.error('Error fetching lab inventory:', error);
        });
    }
  }, [id]);

  const handleResetClick = () => {
    //TODO
    setInventory((old) => old ? [...old] : undefined);
  }

  const handleCloseClick = () => {
    window.location.href = `/`;
  }

  return (
    <div id="lab-inventory">
      <header id="lab-inventory-header">
        <button className="reset-button" onClick={handleResetClick}>
          초기화
        </button>
        <p className="header-text">{name}</p>
        <button className="close-button" onClick={handleCloseClick}>
          <img src={CloseIcon} />
        </button>
      </header>
      <Detection inventory={inventory} />
    </div>
  );
};

export default LabInventory;
