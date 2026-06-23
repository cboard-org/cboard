import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { Typography } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';
import { FormattedMessage } from 'react-intl';

import messages from './UnauthenticatedEditModal.messages';
import style from './LoginRequiredModal.module.css';

function UnauthenticatedEditModal({ open, onClose, onContinue }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      aria-labelledby="dialog"
    >
      <DialogContent className={style.content}>
        <WarningIcon fontSize="large" color="action" />
        <Typography variant="h3">
          <FormattedMessage {...messages.title} />
        </Typography>
        <Typography className={style.dialogText} variant="h6">
          <FormattedMessage {...messages.text} />
        </Typography>
        <div className={style.buttons}>
          <Button
            onClick={onContinue}
            color="default"
            variant="outlined"
            size="large"
          >
            <FormattedMessage {...messages.continueEditing} />
          </Button>
          <Button
            onClick={onClose}
            color="primary"
            variant="contained"
            size="large"
            component={Link}
            to="/login-signup"
          >
            <FormattedMessage {...messages.loginSignup} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UnauthenticatedEditModal;
