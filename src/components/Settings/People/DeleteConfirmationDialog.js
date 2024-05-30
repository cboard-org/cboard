import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '../../UI/FormItems';
import { FormattedMessage } from 'react-intl';
import messages from './People.messages';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress
} from '@material-ui/core';

const propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleDeleteConfirmed: PropTypes.func,
  isDeletingAccount: PropTypes.bool,
  errorDeletingAccount: PropTypes.bool
};

const defaultProps = {};

const DeleteConfirmationDialog = ({
  open,
  handleClose,
  handleDeleteConfirmed,
  isDeletingAccount,
  errorDeletingAccount
}) => {
  const [requiredConfirmationText, setRequiredConfirmationText] = useState({});
  const [confirmationText, setConfirmationText] = useState('');
  const [showConfirmationInput, setShowConfirmationInput] = useState(false);

  useEffect(() => {
    setRequiredConfirmationText(
      <FormattedMessage {...messages.confirmationText} />
    );
  }, []);

  useEffect(
    () => {
      if (!open) {
        setConfirmationText('');
        setShowConfirmationInput(false);
      }
    },
    [open]
  );

  const handleConfirmationChange = e => {
    setConfirmationText(e.target.value);
  };

  const handleShowConfirmationInput = () => {
    setShowConfirmationInput(true);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {<FormattedMessage {...messages.deleteAccountPrimary} />}
      </DialogTitle>
      <DialogContent>
        {errorDeletingAccount ? (
          <DialogContentText id="alert-dialog-description">
            <FormattedMessage {...messages.errorDeletingAccount} />
          </DialogContentText>
        ) : (
          <DialogContentText id="alert-dialog-description">
            <FormattedMessage {...messages.deleteAccountConfirmation} />
          </DialogContentText>
        )}
      </DialogContent>
      {!isDeletingAccount && !showConfirmationInput && (
        <DialogActions>
          <Button
            variant="outlined"
            color="secondary"
            className={'delete_button'}
            onClick={handleShowConfirmationInput}
          >
            {<FormattedMessage {...messages.deleteAccountPrimary} />}
          </Button>
          <Button variant="outlined" onClick={handleClose} autoFocus>
            {<FormattedMessage {...messages.cancelDeleteAccount} />}
          </Button>
        </DialogActions>
      )}
      {!isDeletingAccount && showConfirmationInput && (
        <>
          <TextField
            label={<FormattedMessage {...messages.deleteAccountFinal} />}
            value={confirmationText}
            onChange={handleConfirmationChange}
            variant="outlined"
            fullWidth
          />
          <DialogActions>
            <Button
              variant="outlined"
              color="secondary"
              className={'delete_button'}
              disabled={
                confirmationText !==
                requiredConfirmationText.props.defaultMessage
              }
              onClick={handleDeleteConfirmed}
            >
              {<FormattedMessage {...messages.deleteAccountPrimary} />}
            </Button>
            <Button variant="outlined" onClick={handleClose} autoFocus>
              {<FormattedMessage {...messages.cancelDeleteAccount} />}
            </Button>
          </DialogActions>
        </>
      )}
      {isDeletingAccount && <LinearProgress color="secondary" />}
    </Dialog>
  );
};

DeleteConfirmationDialog.propTypes = propTypes;
DeleteConfirmationDialog.defaultProps = defaultProps;

export default DeleteConfirmationDialog;
