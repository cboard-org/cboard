import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { requestCvaPermissions, isCordova } from '../../../cordova-util';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import readAndCompressImage from 'browser-image-resizer';
import messages from './InputImage.messages';
import './InputImage.css';

class InputImage extends Component {
  static propTypes = {
    /**
     * @ignore
     */
    intl: intlShape.isRequired,
    /**
     * Callback fired when input changes
     */
    onChange: PropTypes.func.isRequired
  };

  async resizeImage(file, config) {
    const resizedBlob = await readAndCompressImage(file, config);
    return resizedBlob;
  }

  handleChange = async event => {
    const file = event.target.files[0];
    const configLQ = {
      quality: 7,
      maxWidth: 200,
      maxHeight: 200,
      autoRotate: true,
      debug: false,
      mimeType: 'image/png'
    };
    const configHQ = {
      quality: 1,
      maxWidth: 800,
      maxHeight: 800,
      autoRotate: true,
      debug: false,
      mimeType: 'image/png'
    };
    if (file) {
      //if you cancel the image uploaded, the event is dispached and the file is null
      const { onChange } = this.props;
      const resizedBlob = await this.resizeImage(file, configLQ);
      const blobHQ = await this.resizeImage(file, configHQ);
      onChange(resizedBlob, file.name, blobHQ);
    }
  };
  render() {
    const { intl } = this.props;
    if (isCordova()) {
      requestCvaPermissions();
    }
    return (
      <div className="InputImage">
        <PhotoCameraIcon />
        <label className="InputImage__label">
          {intl.formatMessage(messages.uploadImage)}
          <input
            className="InputImage__input"
            type="file"
            accept="image/*"
            onChange={this.handleChange}
          />
        </label>
      </div>
    );
  }
}

export default injectIntl(InputImage);
