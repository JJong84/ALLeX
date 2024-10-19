import React from 'react';
import './ImageWrapper.css';

interface ImageWrapperProps {
  width: string;
}

const Dropper: React.FC<ImageWrapperProps> = ({ width }) => {
  return (
    <div className="image-container" style={{ width }}>
      <img src="./assets/dropper.png" alt="Dropper" />
    </div>
  );
};

export default Dropper;