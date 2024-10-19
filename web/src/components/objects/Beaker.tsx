import React from 'react';
import dropper from '../../assets/dropper.png';

interface ImageWrapperProps {
  width: string;
}

const Beaker: React.FC<ImageWrapperProps> = ({ width }) => {
  // TODO
  return (
    <div className="image-container" style={{ width }}>
      <img src={dropper} alt="Bottle 2-2" />
    </div>
  );
};

export default Beaker;