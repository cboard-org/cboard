import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import {
  requestCvaPermissions,
  isAndroid,
  isCordova,
  writeCvaFile
} from '../../../cordova-util';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import readAndCompressImage from 'browser-image-resizer';
import CircularProgress from '@material-ui/core/CircularProgress';

import API from '../../../api';
import messages from './InputImage.messages';
import './InputImage.css';

class InputImage extends PureComponent {
  static propTypes = {
    /**
     * @ignore
     */
    intl: intlShape.isRequired,
    user: PropTypes.object,
    /**
     * Callback fired when input changes
     */
    onChange: PropTypes.func.isRequired
  };

  state = {
    loading: false
  };

  blobToBase64(blob) {
    const reader = new FileReader();

    reader.onload = () => {
      this.props.onChange(reader.result);
    };

    reader.readAsDataURL(blob);
  }

  async resizeImage(
    file,
    config = {
      quality: 7,
      maxWidth: 200,
      maxHeight: 200,
      autoRotate: true,
      debug: false,
      mimeType: 'image/png'
    }
  ) {
    const resizedImage = await readAndCompressImage(file, config);
    return resizedImage;
  }

  handleChange = async event => {
    const { onChange, user } = this.props;
    const file = event.target.files[0];
    const resizedImage = await this.resizeImage(file);
    // Loggedin user?
    if (user) {
      this.setState({
        loading: true
      });
      try {
        const imageUrl = await API.uploadFile(resizedImage, file.name);
        onChange(imageUrl);
      } catch (error) {
        this.saveLocalImage(file.name, resizedImage);
      } finally {
        this.setState({
          loading: false
        });
      }
    } else {
      this.saveLocalImage(file.name, resizedImage);
    }
  };

  saveLocalImage = async (fileName, data) => {
    const { onChange } = this.props;
    if (isAndroid()) {
      const filePath = '/Android/data/com.unicef.cboard/files/' + fileName;
      const fEntry = await writeCvaFile(filePath, data);
      onChange(fEntry.nativeURL);
    } else {
      const imageBase64 = this.blobToBase64(data);
      onChange(imageBase64);
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
        {this.state.loading ? (
          <CircularProgress size={24} thickness={7} />
        ) : (
          <label className="InputImage__label">
            {intl.formatMessage(messages.uploadImage)}
            <input
              className="InputImage__input"
              type="file"
              accept="image/*"
              onChange={this.handleChange}
            />
          </label>
        )}
      </div>
    );
  }
}

export default injectIntl(InputImage);
