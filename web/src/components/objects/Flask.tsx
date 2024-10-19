import React from 'react';
import flask from '../../assets/flask.png'

interface ImageWrapperProps {
  width: string;
}

const Flask: React.FC<ImageWrapperProps> = ({ width }) => {
  return (
    <div className="image-container" style={{ width }}>
      <img src={flask} alt="Bottle 2-2" />
    </div>
  );
};

export default Flask;