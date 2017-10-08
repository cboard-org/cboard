import React from 'react';
import PropTypes from 'prop-types';
import getOrientedImage from 'exif-orientation-image';
import PhotoCameraIcon from 'material-ui-icons/PhotoCamera';
import classNames from 'classnames';

import './InputImage.css';

InputImage.propTypes = {
  image: PropTypes.string,
  onChange: PropTypes.func.isRequired
};

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

  const labelClassName = classNames({
    InputImage__label: true,
    'is-uploaded': image
  });

  return (
    <div className="InputImage">
      <label className={labelClassName}>
        {label}
        <input
          className="InputImage__input"
          type="file"
          value=""
          onChange={handleChange}
        />
      </label>
      {image && <img className="InputImage__img" src={image} alt="" />}
      <PhotoCameraIcon />
    </div>
  );
}

export default InputImage;
