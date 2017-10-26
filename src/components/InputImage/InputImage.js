import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import getOrientedImage from 'exif-orientation-image';
import PhotoCameraIcon from 'material-ui-icons/PhotoCamera';

import './InputImage.css';

class InputImage extends PureComponent {
  static propTypes = {
    /**
     * Image source path
     */
    image: PropTypes.string,
    /**
     * Input label text
     */
    label: PropTypes.string,
    /**
     * Callback fired when input changes
     */
    onChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    label: 'Upload image'
  };

  handleChange = event => {
    const file = event.target.files[0];

    getOrientedImage(file, (error, canvas) => {
      if (!error) {
        const dataURL = canvas.toDataURL('image/png');
        this.props.onChange(dataURL);
      }
    });
  };

  render() {
    const { image, label } = this.props;

    return (
      <div
        className={classNames('InputImage', {
          'is-uploaded': image
        })}
      >
        <label className="InputImage__label">
          {label}
          <input
            className="InputImage__input"
            type="file"
            accept="image/*"
            onChange={this.handleChange}
          />
        </label>
        {image && <img className="InputImage__img" src={image} alt="" />}
        <PhotoCameraIcon />
      </div>
    );
  }
}

export default InputImage;
