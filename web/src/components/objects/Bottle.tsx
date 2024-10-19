import React from 'react';
import './ImageWrapper.css';

interface ImageWrapperProps {
  width: string;
}

const Bottle: React.FC<ImageWrapperProps> = ({ width }) => {
  return (
    <div className="image-container" style={{ width }}>
      <img src="./assets/bottle.png" alt="Bottle" />
    </div>
  );
};

export default Bottle;