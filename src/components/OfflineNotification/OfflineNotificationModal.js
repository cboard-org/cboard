import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { Typography } from '@material-ui/core';
import CloudOffIcon from '@material-ui/icons/CloudOff';

import { isLogged } from '../App/App.selectors';
import messages from './OfflineNotification.messages';
import style from './OfflineNotificationModal.module.css';

function OfflineNotificationModal({ isConnected, isLoggedIn }) {
  const [open, setOpen] = useState(false);
  const hasBeenShownRef = useRef(false);
  const prevConnectedRef = useRef(null);

  useEffect(
    () => {
      if (prevConnectedRef.current === null) {
        prevConnectedRef.current = isConnected;
        return;
      }

      const wentOffline =
        prevConnectedRef.current === true && isConnected === false;

      if (wentOffline && !hasBeenShownRef.current && isLoggedIn) {
        setOpen(true);
        hasBeenShownRef.current = true;
      }

      prevConnectedRef.current = isConnected;
    },
    [isConnected, isLoggedIn]
  );

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      aria-labelledby="offline-notification-dialog"
    >
      <DialogContent className={style.content}>
        <CloudOffIcon fontSize="large" color="action" />
        <Typography variant="h3">
          <FormattedMessage {...messages.offlineTitle} />
        </Typography>
        <Typography className={style.dialogText} variant="h6">
          <FormattedMessage {...messages.offlineMessage} />
        </Typography>
        <Button
          onClick={handleClose}
          color="primary"
          variant="contained"
          size="large"
        >
          <FormattedMessage {...messages.gotIt} />
        </Button>
      </DialogContent>
    </Dialog>
  );
}

const mapStateToProps = state => ({
  isConnected: state.app.isConnected,
  isLoggedIn: isLogged(state)
});

export default connect(mapStateToProps)(OfflineNotificationModal);
