import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';

import PropTypes from 'prop-types';

//import messages

DownloadingLangErrorDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDialogAcepted: PropTypes.func.isRequired,
  downloadingLangData: PropTypes.object,
  downloadingLangError: PropTypes.object
};

export default function DownloadingLangErrorDialog(props) {
  const {
    open,
    onClose,
    onDialogAcepted,
    downloadingLangData,
    downloadingLangError
  } = props;
  const { ttsError } = downloadingLangError;

  const handleDialogAcepted = () => {
    onDialogAcepted(downloadingLangData);
  };

  const ttsErrorData = {
    alert: "Cboard didn't detect the new app. please Checkit",
    chekit: ''
  };

  return (
    <Dialog
      onBackdropClick="false"
      onClose={onClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle id="alert-dialog-title">
        {'Downloading Language'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {ttsError ? ttsErrorData.alert : <p>error lang msg</p>}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel instalation
        </Button>
        <Button
          onClick={handleDialogAcepted}
          variant="contained"
          color="primary"
          autoFocus
        >
          {ttsError ? <p>CheckIt</p> : <p>open app</p>}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
