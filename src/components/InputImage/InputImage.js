import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import classNames from 'classnames';
import getOrientedImage from 'exif-orientation-image';
import PhotoCameraIcon from 'material-ui-icons/PhotoCamera';

import messages from './InputImage.messages';
import './InputImage.css';

class InputImage extends PureComponent {
  static propTypes = {
    /**
     * @ignore
     */
    intl: intlShape.isRequired,
    /**
     * Image source path
     */
    image: PropTypes.string,
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
    const { intl, image } = this.props;

    return (
      <div
        className={classNames('InputImage', {
          'is-uploaded': image
        })}
      >
        <label className="InputImage__label">
          {intl.formatMessage(messages.uploadImage)}
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

export default injectIntl(InputImage);
