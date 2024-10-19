import React from 'react';
import flask from '../../assets/flask.png'
import { substanceImages, SubstanceNames } from '../../types';

interface ImageWrapperProps {
  width: string;
  substanceName: SubstanceNames | "";
}

const Flask: React.FC<ImageWrapperProps> = ({ width, substanceName }) => {  
  return (
    <div className="image-container" style={{ width }}>
      {
        substanceName ? <img src={substanceImages[substanceName]} alt="Bottle 2-2" /> : <img src={flask} alt="Bottle 2-2" />
      }
    </div>
  );
};

export default Flask;