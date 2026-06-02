import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import LoadingIcon from '../../../UI/LoadingIcon';
import PremiumFeature from '../../../PremiumFeature';
import messages from '../CommunicatorDialog.messages';

/**
 * Generic confirmation dialog used for delete / copy flows. Handles its own
 * loading state while the async `onConfirm` resolves.
 */
const ConfirmDialog = ({
  intl,
  open,
  title,
  description,
  premium,
  onConfirm,
  onClose
}) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const confirmButton = (
    <Button
      onClick={handleConfirm}
      variant="contained"
      color="primary"
      disabled={loading}
    >
      {loading ? <LoadingIcon /> : intl.formatMessage(messages.accept)}
    </Button>
  );

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      aria-labelledby="confirm-dialog-title"
    >
      <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" disabled={loading}>
          {intl.formatMessage(messages.close)}
        </Button>
        {premium ? (
          <PremiumFeature>{confirmButton}</PremiumFeature>
        ) : (
          confirmButton
        )}
      </DialogActions>
    </Dialog>
  );
};

ConfirmDialog.propTypes = {
  intl: intlShape.isRequired,
  open: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
  premium: PropTypes.bool,
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default ConfirmDialog;
