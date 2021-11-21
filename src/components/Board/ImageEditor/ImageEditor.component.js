import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '../../UI/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import messages from './ImageEditor.messages';
import RotateRightIcon from '@material-ui/icons/RotateRight';
import DoneIcon from '@material-ui/icons/Done';
import CropIcon from '@material-ui/icons/Crop';
import BlockIcon from '@material-ui/icons/Block';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';

import './ImageEditor.css';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

class ImageEditor extends PureComponent {
  static defaultProps = {
    open: false
  };
  static propTypes = {
    open: PropTypes.bool,
    onImageEditorClose: PropTypes.func,
    onImageEditorDone: PropTypes.func,
    image: PropTypes.string,
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    const setImageSize = () => {
      if (window.innerWidth < 576) {
        return { width: 248, height: 182 };
      } else {
        return { width: 492, height: 369 };
      }
    };
    this.state = {
      isCropActive: false,
      imgCropped: null,
      style: setImageSize()
    };
  }

  handleOnClickCrop = () => {
    this.setState({ isCropActive: true });
    this.state.cropper.setDragMode('crop');
    this.state.cropper.crop();
  };
  handleOnClickDoneCrop = () => {
    const { cropper } = this.state;
    this.setState({
      isCropActive: false,
      imgCropped: cropper.getCroppedCanvas().toDataURL()
    });
    this.state.cropper.setDragMode('move');
  };
  handleOnClickClose = () => {
    this.setState({ isCropActive: false, imgCropped: null });
    this.state.cropper.destroy();
    this.props.onImageEditorClose();
  };

  handleOnClickDone = async () => {
    const { cropper } = this.state;
    cropper.setDragMode('move');
    this.setState({ imgCropped: null });
    this.props.onImageEditorClose();
    cropper
      .getCroppedCanvas({
        maxWidth: 200,
        maxHeight: 200,
        fillColor: '#fff',
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
      })
      .toBlob(
        blob => {
          this.props.onImageEditorDone(blob);
        },
        'image/png',
        1
      );
    cropper.destroy();
  };
  handleOnClickCancelCrop = () => {
    this.setState({ isCropActive: false });
    this.state.cropper.clear();
    this.state.cropper.setDragMode('move');
  };

  render() {
    const { intl, open, onImageEditorClose, image } = this.props;
    const srcImage = this.state.imgCropped ? this.state.imgCropped : image;
    return (
      <React.Fragment>
        <Dialog
          open={open}
          onClose={onImageEditorClose}
          fullScreen={false}
          className="ImageEditor__container"
        >
          <DialogTitle className="ImageEditor__title">
            <div className="ImageEditor__Container">
              <FormattedMessage {...messages.title} />
            </div>
          </DialogTitle>
          <DialogContent>
            <Cropper
              style={this.state.style}
              zoomTo={0}
              src={srcImage}
              viewMode={0}
              background={true}
              responsive={true}
              checkOrientation={false}
              guides={true}
              dragMode="move"
              autoCrop={false}
              onInitialized={instance => {
                this.setState({ cropper: instance });
              }}
            />
            <div className="ImageEditor__actionBar">
              <IconButton
                label={intl.formatMessage(messages.rotateRight)}
                onClick={() => {
                  this.state.cropper.rotate(90);
                }}
              >
                <RotateRightIcon />
              </IconButton>
              {this.state.isCropActive ? (
                <React.Fragment>
                  <IconButton
                    label={intl.formatMessage(messages.cropImage)}
                    onClick={this.handleOnClickDoneCrop}
                  >
                    <DoneIcon />
                  </IconButton>
                  <IconButton
                    label={intl.formatMessage(messages.cancelCrop)}
                    onClick={this.handleOnClickCancelCrop}
                  >
                    <BlockIcon />
                  </IconButton>
                </React.Fragment>
              ) : (
                <IconButton
                  label={intl.formatMessage(messages.cropImage)}
                  onClick={this.handleOnClickCrop}
                >
                  <CropIcon />
                </IconButton>
              )}
              <IconButton
                label={intl.formatMessage(messages.zoomIn)}
                onClick={() => this.state.cropper.zoom(0.1)}
              >
                <ZoomInIcon />
              </IconButton>
              <IconButton
                label={intl.formatMessage(messages.zoomOut)}
                onClick={() => this.state.cropper.zoom(-0.1)}
              >
                <ZoomOutIcon />
              </IconButton>
            </div>
          </DialogContent>
          <DialogActions>
            <IconButton
              label={intl.formatMessage(messages.done)}
              onClick={this.handleOnClickDone}
              disabled={this.state.isCropActive}
            >
              <DoneIcon />
            </IconButton>

            <IconButton
              label={intl.formatMessage(messages.close)}
              onClick={this.handleOnClickClose}
            >
              <CloseIcon />
            </IconButton>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

export default withMobileDialog()(ImageEditor);
