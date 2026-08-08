import React, { useEffect, useState } from 'react';
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

function ImageEditor(props) {
  const { intl, open, onImageEditorClose, onImageEditorDone, image } = props;

  const [isCropActive, setIsCropActive] = useState(false);
  const [imgCropped, setImgCropped] = useState(null);
  const [style, setStyle] = useState(getInitialStyle);

  const [cropper, setCropper] = useState(null);
  const srcImage = imgCropped ? imgCropped : image;

  function getInitialStyle() {
    return window.innerWidth < 576
      ? { with: 248, height: 182 }
      : { with: 492, height: 369 };
  }

  const handleOnClickCrop = () => {
    setIsCropActive(true);
    cropper.setDragMode('crop');
    cropper.crop();
  };

  const handleOnClickDoneCrop = () => {
    setImgCropped(cropper.getCroppedCanvas().toDataURL());
    setIsCropActive(false);
    cropper.setDragMode('move');
  };

  const handleOnClickClose = () => {
    setIsCropActive(false);
    setImgCropped(null);
    cropper?.destroy?.();
    onImageEditorClose();
  };

  const handleOnClickDone = async () => {
    cropper.setDragMode('move');
    setImgCropped(null);
    onImageEditorClose();
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
          onImageEditorDone(blob);
        },
        'image/png',
        1
      );
    cropper.destroy();
  };
  const handleOnClickCancelCrop = () => {
    cropper.setDragMode('move');
    cropper.clear();
    setIsCropActive(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setStyle(getInitialStyle());
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
          <div className="ImageEditor__actionBar">
            <IconButton
              label={intl.formatMessage(messages.rotateRight)}
              onClick={() => {
                cropper.rotate(90);
              }}
            >
              <RotateRightIcon />
            </IconButton>
            {isCropActive ? (
              <React.Fragment>
                <IconButton
                  label={intl.formatMessage(messages.cropImage)}
                  onClick={handleOnClickDoneCrop}
                >
                  <DoneIcon />
                </IconButton>
                <IconButton
                  label={intl.formatMessage(messages.cancelCrop)}
                  onClick={handleOnClickCancelCrop}
                >
                  <BlockIcon />
                </IconButton>
              </React.Fragment>
            ) : (
              <IconButton
                label={intl.formatMessage(messages.cropImage)}
                onClick={handleOnClickCrop}
              >
                <CropIcon />
              </IconButton>
            )}
            <IconButton
              label={intl.formatMessage(messages.zoomIn)}
              onClick={() => cropper.zoom(0.1)}
            >
              <ZoomInIcon />
            </IconButton>
            <IconButton
              label={intl.formatMessage(messages.zoomOut)}
              onClick={() => cropper.zoom(-0.1)}
            >
              <ZoomOutIcon />
            </IconButton>
          </div>
          <Cropper
            style={style}
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
              setCropper(instance);
            }}
          />
        </DialogContent>
        <DialogActions>
          <IconButton
            label={intl.formatMessage(messages.done)}
            onClick={handleOnClickDone}
            disabled={isCropActive}
          >
            <DoneIcon />
          </IconButton>

          <IconButton
            label={intl.formatMessage(messages.close)}
            onClick={handleOnClickClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

ImageEditor.propTypes = {
  open: PropTypes.bool,
  onImageEditorClose: PropTypes.func,
  onImageEditorDone: PropTypes.func,
  image: PropTypes.string,
  intl: PropTypes.object.isRequired
};

export default withMobileDialog()(ImageEditor);
