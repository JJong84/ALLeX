import React from 'react';
import dropper from '../../assets/dropper.png';

interface ImageWrapperProps {
  width: string;
}

const Dropper: React.FC<ImageWrapperProps> = ({ width }) => {
  return (
    <div className="image-container" style={{ width }}>
      <img src={dropper} alt="Dropper" />
    </div>
  );
};

export default Dropper;