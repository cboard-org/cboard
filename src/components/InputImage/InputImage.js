import React from 'react';
import PropTypes from 'prop-types';
import getOrientedImage from 'exif-orientation-image';
import PhotoCameraIcon from 'material-ui-icons/PhotoCamera';

import './InputImage.css';

function InputImage(props) {
  const { image, label, onChange } = props;

  function handleChange(event) {
    const file = event.target.files[0];
    getOrientedImage(file, (error, canvas) => {
      if (!error) {
        const dataURL = canvas.toDataURL('image/png');
        onChange(dataURL);
      }
    });
  }

  return (
    <div className="InputImage">
      <label
        htmlFor="imageInput"
        className={"InputImage__label " + (image ? 'uploaded' : '')}>
        {label}
      </label>
      <input
        className="InputImage__input"
        id="imageInput"
        type="file"
        value=""
        onChange={handleChange}
      />
      {image && <img className="InputImage__img" src={image} alt="" />}
      <PhotoCameraIcon />
    </div>
  );
}

export default InputImage;

InputImage.propTypes = {
  image: PropTypes.string,
  onChange: PropTypes.func.isRequired
};
