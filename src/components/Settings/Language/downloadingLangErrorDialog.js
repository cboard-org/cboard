import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';

import PropTypes from 'prop-types';

import { intlShape, injectIntl } from 'react-intl';
import messages from './Language.messages';

DownloadingLangErrorDialog.propTypes = {
  intl: intlShape.isRequired,
  /**
   * Languages to display
   */
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDialogAcepted: PropTypes.func.isRequired,
  downloadingLangData: PropTypes.object,
  downloadingLangError: PropTypes.object
};

function DownloadingLangErrorDialog(props) {
  const {
    intl,
    open,
    onClose,
    onDialogAcepted,
    downloadingLangData,
    downloadingLangError,
    downloadingLangState
  } = props;
  const { ttsError } = downloadingLangError;
  const { firstClick, continueOnline } = downloadingLangState;

  const handleDialogAcepted = () => {
    onDialogAcepted(downloadingLangData);
  };

  const handleClose = (event, reason) => {
    if (reason === 'backdropClick') {
      return false;
    }
    onclose();
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle id="alert-dialog-title">
        {intl.formatMessage(messages.downloadDialogTitle)}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {ttsError
            ? intl.formatMessage(messages.ttsErrorAlert)
            : firstClick
            ? intl.formatMessage(messages.searchVoiceAlert)
            : intl.formatMessage(messages.langErrorAlert)}
        </DialogContentText>
        {continueOnline && (
          <DialogContentText id="continue-online-description">
            {intl.formatMessage(messages.continueOnlineLangAlert)}
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {intl.formatMessage(messages.CancelInstalation)}
        </Button>
        <Button
          onClick={handleDialogAcepted}
          variant="contained"
          color="primary"
          autoFocus
        >
          {ttsError
            ? intl.formatMessage(messages.checkIt)
            : intl.formatMessage(messages.openApp)}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default injectIntl(DownloadingLangErrorDialog);
