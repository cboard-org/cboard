import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { isAndroid } from '../../../cordova-util';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import { readAndCompressImage } from 'browser-image-resizer';
import messages from './InputImage.messages';
import './InputImage.css';
import Button from '@material-ui/core/Button';

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

  async resizeImage(file, imageName = null) {
    //if you cancel the image uploaded, the event is dispached and the file is null
    try {
      const { onChange } = this.props;
      const resizedBlob = await readAndCompressImage(file, configLQ);
      const blobHQ = await readAndCompressImage(file, configHQ);
      const fileName = imageName || file.name;
      onChange(resizedBlob, fileName, blobHQ);
    } catch (err) {
      console.error(err);
    }
  }

  onClick = async () => {
    try {
      const imageURL = await window.cordova.plugins.safMediastore.selectFile();
      const imageName = await window.cordova.plugins.safMediastore.getFileName(
        imageURL
      );
      const file = await new Promise((resolve, reject) => {
        window.resolveLocalFileSystemURL(
          imageURL,
          fileEntry => {
            fileEntry.file(
              file => {
                resolve(file);
              },
              err => {
                console.error(err);
                resolve(null);
              }
            );
          },
          err => {
            console.error(err);
            resolve(null);
          }
        );
      });

      if (file) {
        await this.resizeImage(file, imageName);
      }
    } catch (err) {
      console.error(err);
    }
  };

  handleChange = async event => {
    const file = event.target.files[0];
    if (file) {
      //if you cancel the image uploaded, the event is dispached and the file is null
      await this.resizeImage(file);
    }
  };
  render() {
    const { intl } = this.props;
    return (
      <div>
        {isAndroid() ? (
          <div className="InputImage__buttonContainer">
            <Button
              variant="outlined"
              onClick={this.onClick}
              startIcon={<PhotoCameraIcon />}
              className="InputImage__button"
            >
              {intl.formatMessage(messages.uploadImage)}
            </Button>
          </div>
        ) : (
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
        )}
      </div>
    );
  }
}

export default injectIntl(InputImage);
