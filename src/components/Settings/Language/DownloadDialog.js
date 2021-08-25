import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';

import PropTypes from 'prop-types';

DownloadDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDialogAcepted: PropTypes.func.isRequired,
  selectedEngine: PropTypes.string
};

export default function DownloadDialog(props) {
  const { open, onClose, onDialogAcepted, selectedEngine } = props;

  const handleDialogAcepted = () => {
    onDialogAcepted(selectedEngine);
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
          Let Google help apps determine location. This means sending anonymous
          location data to Google, even when no apps are running.
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
