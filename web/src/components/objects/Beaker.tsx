import React from 'react';
import './ImageWrapper.css';

interface ImageWrapperProps {
  width: string;
}

const Beaker: React.FC<ImageWrapperProps> = ({ width }) => {
  // TODO
  return (
    <div className="image-container" style={{ width }}>
      <img src="./assets/dropper.png" alt="Bottle 2-2" />
    </div>
  );
};

export default Beaker;