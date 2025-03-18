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

NoConnectionDialog.propTypes = {
  intl: intlShape.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

function NoConnectionDialog(props) {
  const { open, onClose, intl } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="no-connection" open={open}>
      <DialogTitle id="no-connection-dialog-title">
        {intl.formatMessage(messages.noConnection)}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="no-connection-dialog-description">
          {intl.formatMessage(messages.noConnectionDialogDesc)}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {intl.formatMessage(messages.cancel)}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default injectIntl(NoConnectionDialog);
