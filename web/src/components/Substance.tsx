import React from 'react';
import { SubstanceProps } from '../types';

const SubstanceComp = ({ entity_id, substance_name, x, y, case_type, movedX, movedY }: SubstanceProps) => {
  return (
    <div style={{
        position: 'absolute',
        zIndex: 3,
        top: `${movedY}px`,
        left: `${movedX}px`,
        width: "300px",
        height: "300px"
    }}>
      <div key={entity_id} style={{ border: '1px solid black', padding: '10px', marginBottom: '10px' }}>
          <h2>{substance_name}</h2>
          <p>ID: {entity_id}</p>
          <p>Coordinates: ({x}, {y})</p>
          <p>Case Type: {case_type}</p>
        </div>
    </div>
  );
};

export default SubstanceComp;
