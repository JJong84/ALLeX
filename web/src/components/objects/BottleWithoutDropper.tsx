import React from 'react';
import bottle from '../../assets/bottle.png';

interface ImageWrapperProps {
  width: string;
}

const BottleWithoutDropper: React.FC<ImageWrapperProps> = ({ width }) => {
  return (
    <div className="image-container" style={{ width }}>
      <img src={bottle} alt="Bottle" />
    </div>
  );
};

export default BottleWithoutDropper;