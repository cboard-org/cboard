import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';

import { intlShape, injectIntl } from 'react-intl';
import messages from './Language.messages';

import PropTypes from 'prop-types';

DownloadDialog.propTypes = {
  intl: intlShape.isRequired,
  /**
   * Languages to display
   */
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDialogAcepted: PropTypes.func.isRequired,
  downloadingLangData: PropTypes.object
};

function DownloadDialog(props) {
  const { open, onClose, onDialogAcepted, downloadingLangData, intl } = props;
  const { continueOnline } = downloadingLangData;
  const handleDialogAccepted = () => {
    onDialogAcepted(downloadingLangData);
  };
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="redirect-to-playstore"
      open={open}
    >
      <DialogTitle id="playstore-dialog-title">
        {intl.formatMessage(messages.downloadDialogTitle)}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="playstore-dialog-description">
          {intl.formatMessage(messages.downloadDialogSubtitle)}
        </DialogContentText>
        {continueOnline && (
          <DialogContentText id="continue-online-description">
            {intl.formatMessage(messages.continueOnlineLangAlert)}
          </DialogContentText>
        )}
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

export default injectIntl(DownloadDialog);
