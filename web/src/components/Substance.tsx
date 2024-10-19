import React, { useEffect, useState } from 'react';
import { DEFAULT_SIZE, SubstanceProps } from '../types';
import Beaker from './objects/Beaker';
import BottleWithoutDropper from './objects/BottleWithoutDropper';
import Dropper from './objects/Dropper';
import Flask from './objects/Flask';

const SubstanceComp = ({ entity_id, substance_name, x, y, case_type, movedX, movedY }: SubstanceProps) => {
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(300);

  useEffect(() => {
    setWidth(DEFAULT_SIZE[case_type].width);
    setHeight(DEFAULT_SIZE[case_type].height);
  }, [case_type]);

  const Image = () => {
    switch (case_type) {
      case 'beaker':
        return <Beaker width={`${width}px`} />
      case 'bottle':
        return <BottleWithoutDropper substanceName={substance_name} width={`${width}px`} />
      case 'dropper':
        return <Dropper substanceName={substance_name} width={`${width}px`} />
      case 'flask':
        return <Flask substanceName={substance_name} width={`${width}px`} />
      default:
        return <Flask substanceName={substance_name} width={`${width}px`} />
    }
  }

  return (
    <div style={{
        position: 'absolute',
        zIndex: case_type === "dropper" ? 3 : 4,
        top: `${movedY - height / 2 - (case_type === "dropper" ? 60 : 0)}px`,
        left: `${movedX - width / 2}px`,
        width: `${width}px`,
        height: `${height}px`
    }}>
      <Image />
      {/* <div key={entity_id} style={{ border: '1px solid black', padding: '10px', marginBottom: '10px' }}>
          <h2>{substance_name}</h2>
          <p>ID: {entity_id}</p>
          <p>Coordinates: ({x}, {y})</p>
          <p>Case Type: {case_type}</p>
        </div> */}
    </div>
  );
};

export default SubstanceComp;
