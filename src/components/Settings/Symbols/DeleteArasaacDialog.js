import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { intlShape, injectIntl } from 'react-intl';
import messages from './Symbols.messages';

import PropTypes from 'prop-types';

DeleteArasaacDialog.propTypes = {
  intl: intlShape.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDialogAcepted: PropTypes.func.isRequired,
  isDeleting: PropTypes.bool.isRequired
};

function DeleteArasaacDialog(props) {
  const { open, onClose, onDialogAcepted, intl, isDeleting } = props;

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
      <DialogTitle id="delet-arasaac-dialog-title">
        {intl.formatMessage(messages.deletArasaac)}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="delet-arasaac-dialog-description">
          {intl.formatMessage(messages.deletArasaacSecondary)}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" disabled={isDeleting}>
          {intl.formatMessage(messages.cancel)}
        </Button>
        <Button
          onClick={handleDialogAccepted}
          variant="contained"
          color="primary"
          autoFocus
          disabled={isDeleting}
        >
          {isDeleting ? (
            <CircularProgress size={25} thickness={7} />
          ) : (
            intl.formatMessage(messages.delete)
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default injectIntl(DeleteArasaacDialog);
