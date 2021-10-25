import React, { Component } from 'react';
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

import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

class InputImage extends Component {
  static propTypes = {
    /**
     * @ignore
     */
    intl: intlShape.isRequired,
    user: PropTypes.object,
    /**
     * Callback fired when input changes
     */
    onChange: PropTypes.func.isRequired,
    rotateDeg: PropTypes.number,
    image: PropTypes.bool,
    resetRotation: PropTypes.func.isRequired
  };
  state = {
    loading: false,
    resizedImage: null,
    fileName: ''
  };

  componentDidUpdate(prevProps) {
    console.log(this.props.isRotationArrowActive);
    if (
      prevProps.rotateDeg !== this.props.rotateDeg &&
      this.props.isRotationArrowActive
    ) {
      this.rotateImage(this.state.resizedImage, this.state.fileName);
    }
  }

  async rotateImage(resizedImage, fileName) {
    const { onChange, rotateDeg } = this.props;
    const imgRotated = await this.drawRotated(resizedImage, rotateDeg);
    onChange(imgRotated, fileName);
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
    this.props.resetRotation();
    const file = event.target.files[0];
    this.handleFile(file);
  };

  handleFile = async file => {
    const { onChange } = this.props;
    const resizedImage = await this.resizeImage(file);
    this.setState({ resizedImage: resizedImage, fileName: file.name });
    const imgBase64 = await this.blobToBase64(resizedImage);
    const config = {
      quality: 1,
      maxWidth: 800,
      maxHeight: 800,
      autoRotate: true,
      debug: false,
      mimeType: 'image/png'
    };
    const originalFile = await this.resizeImage(file, config);
    const originalFileBs64 = await this.blobToBase64(originalFile);
    onChange(imgBase64, file.name, originalFileBs64);
  };

  fileToDataUri = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = event => {
        resolve(event.target.result);
      };
      reader.readAsDataURL(file);
    });

  drawRotated(blob, degrees) {
    return new Promise((resolve, reject) => {
      var image = new Image();
      var urlCreator = window.URL || window.webkitURL;
      var imageUrl = urlCreator.createObjectURL(blob);
      image.src = imageUrl;
      image.onload = () => {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.style.width = '20%';

        if (degrees === 90 || degrees === 270) {
          canvas.width = image.height;
          canvas.height = image.width;
        } else {
          canvas.width = image.width;
          canvas.height = image.height;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (degrees === 90 || degrees === 270) {
          ctx.translate(image.height / 2, image.width / 2);
        } else {
          ctx.translate(image.width / 2, image.height / 2);
        }
        ctx.rotate((degrees * Math.PI) / 180);
        ctx.drawImage(image, -image.width / 2, -image.height / 2);
        const imgRotated = canvas.toDataURL('image/png');
        //var imgFinal = this.dataURItoBlob(imgRotated);
        resolve(imgRotated);
      };
    });
  }

  blobToBase64(blob) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  }
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
