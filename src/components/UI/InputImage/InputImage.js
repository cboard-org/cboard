import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import classNames from 'classnames';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import readAndCompressImage from 'browser-image-resizer';

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

  blobToBase64(blob) {
    const reader = new FileReader();

    reader.addEventListener(
      'load',
      () => {
        this.props.onChange(reader.result);
      },
      false
    );

    reader.readAsDataURL(blob);
  }

  async resizeImage(
    file,
    config = {
      quality: 7,
      maxWidth: 96,
      maxHeight: 96,
      autoRotate: true,
      debug: false
    }
  ) {
    const resizedImage = await readAndCompressImage(file, config);
    return resizedImage;
  }

  handleChange = async event => {
    const file = event.target.files[0];
    const resizedImage = await this.resizeImage(file);
    const imageBase64 = this.blobToBase64(resizedImage);
    this.props.onChange(imageBase64);
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
