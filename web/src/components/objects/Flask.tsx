import React from 'react';
import './ImageWrapper.css';

interface ImageWrapperProps {
  width: string;
}

const Flask: React.FC<ImageWrapperProps> = ({ width }) => {
  return (
    <div className="image-container" style={{ width }}>
      <img src="./assets/flask.png" alt="Bottle 2-2" />
    </div>
  );
};

export default Flask;