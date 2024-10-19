import React from 'react';
import dropper from '../../assets/dropper.png';
import { SubstanceNames } from '../../types';

interface ImageWrapperProps {
  width: string;
  substanceName: SubstanceNames | "";
}

const Dropper: React.FC<ImageWrapperProps> = ({ width }) => {
  const Image = () => {
    return <img src={dropper} alt="Dropper" />;
  }

  return (
    <div className="image-container" style={{ width }}>
      <Image />
    </div>
  );
};

export default Dropper;