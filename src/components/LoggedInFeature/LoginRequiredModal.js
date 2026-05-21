import React from 'react';
import { connect } from 'react-redux';
import { hideLoginRequired } from '../../providers/SubscriptionProvider/SubscriptionProvider.actions';
import { Dialog } from '@material-ui/core';
import { Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';

import WarningIcon from '@material-ui/icons/Warning';
import DialogContent from '@material-ui/core/DialogContent';
import { Typography } from '@material-ui/core';

import messages from './LoginRequiredModal.messages';
import { FormattedMessage } from 'react-intl';

import style from './LoginRequiredModal.module.css';

export function LoginRequiredModalPure({
  hideLoginRequired,
  loginRequiredModalState,
  open: openProp,
  onClose,
  onContinue,
  title,
  text
}) {
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : loginRequiredModalState.open;
  const handleClose = isControlled ? onClose : hideLoginRequired;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      aria-labelledby="dialog"
    >
      <DialogContent className={style.content}>
        <WarningIcon fontSize="large" color="action" />
        <Typography variant="h3">
          {title || <FormattedMessage {...messages.featureBlockedTitle} />}
        </Typography>
        <Typography className={style.dialogText} variant="h6">
          {text || <FormattedMessage {...messages.featureBlockedText} />}
        </Typography>
        <div className={style.buttons}>
          {onContinue && (
            <Button
              onClick={onContinue}
              color="default"
              variant="outlined"
              size="large"
            >
              <FormattedMessage {...messages.continueWithoutSaving} />
            </Button>
          )}
          <Button
            onClick={handleClose}
            color="primary"
            variant="contained"
            size="large"
            component={Link}
            to="/login-signup"
          >
            <FormattedMessage {...messages.loginSignupNow} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const mapStateToProps = ({ subscription: { loginRequiredModalState } }) => ({
  loginRequiredModalState
});

const mapDispatchToProps = {
  hideLoginRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginRequiredModalPure);
