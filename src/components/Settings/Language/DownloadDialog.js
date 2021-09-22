import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';

import PropTypes from 'prop-types';

//import messages

DownloadDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDialogAcepted: PropTypes.func.isRequired,
  downloadingLangData: PropTypes.object
};

export default function DownloadDialog(props) {
  const { open, onClose, onDialogAcepted, downloadingLangData } = props;

  const handleDialogAcepted = () => {
    onDialogAcepted(downloadingLangData);
  };
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle id="alert-dialog-title">{'Download language'}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          you will be redirect to the Google playstore in order to download and
          install the language you have chosen. do you want to proced?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleDialogAcepted}
          variant="contained"
          color="primary"
          autoFocus
        >
          Download
        </Button>
      </DialogActions>
    </Dialog>
  );
}
