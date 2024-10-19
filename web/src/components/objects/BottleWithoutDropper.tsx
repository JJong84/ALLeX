import React from 'react';
import bottle from '../../assets/bottle.png';
import { emptyBottleImages, SubstanceNames } from '../../types';

interface ImageWrapperProps {
  width: string;
  substanceName: SubstanceNames | "";
}

const BottleWithoutDropper: React.FC<ImageWrapperProps> = ({ width, substanceName }) => {
  const Image = () => {
    if (!substanceName) {
      return <img src={bottle} alt="Bottle" />;
    }
    return <img src={emptyBottleImages[substanceName]} alt="Bottle" />;
  }

  return (
    <div className="image-container" style={{ width }}>
      <Image />
    </div>
  );
};

export default BottleWithoutDropper;