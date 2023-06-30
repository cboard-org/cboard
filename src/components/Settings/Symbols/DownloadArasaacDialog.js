import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';

import { intlShape, injectIntl } from 'react-intl';
import messages from './Symbols.messages';

import PropTypes from 'prop-types';

DownloadArasaacDialog.propTypes = {
  intl: intlShape.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDialogAcepted: PropTypes.func.isRequired
};

function DownloadArasaacDialog(props) {
  const { open, onClose, onDialogAcepted, intl } = props;

  const handleDialogAccepted = () => {
    onDialogAcepted();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="download-arasaac"
      open={open}
    >
      <DialogTitle id="download-arasaac-dialog-title">
        {intl.formatMessage(messages.downloadArasaac)}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="download-arasaac-dialog-description">
          {intl.formatMessage(messages.downloadArasaacDialogSubtitle)}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {intl.formatMessage(messages.cancel)}
        </Button>
        <Button
          onClick={handleDialogAccepted}
          variant="contained"
          color="primary"
          autoFocus
        >
          {intl.formatMessage(messages.download)}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default injectIntl(DownloadArasaacDialog);
