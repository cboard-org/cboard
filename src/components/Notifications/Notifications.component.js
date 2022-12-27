import React from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import { NOTIFICATION_DELAY } from './Notifications.constants';
import { FormattedMessage } from 'react-intl';
import messages from './Notifications.messages';
import { Link } from 'react-router-dom';

const propTypes = {
  config: PropTypes.object.isRequired,
  handleNotificationDismissal: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  kind: PropTypes.string
};

function onRefreshPage() {
  window.location.reload(true);
}

const Notifications = ({
  config,
  handleNotificationDismissal,
  message,
  open,
  kind
}) => {
  const childrenDependKind = kind => {
    if (!kind) return null;
    if (kind === 'refresh')
      return (
        <Alert
          elevation={6}
          variant="filled"
          onClose={handleNotificationDismissal}
          severity="info"
          action={
            <Button variant="outlined" onClick={onRefreshPage}>
              <FormattedMessage {...messages.refreshPage} />
            </Button>
          }
        >
          <span id="message-id">{message}</span>
        </Alert>
      );
    if (kind === 'cloudSpeakError' || kind === 'cloudVoiceIsSeted') {
      const isCloudError = !!(kind === 'cloudSpeakError');
      return (
        <Alert
          variant="filled"
          severity={isCloudError ? 'error' : 'info'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          action={
            isCloudError ? (
              <Button
                size="small"
                variant="outlined"
                style={{
                  color: 'white',
                  borderColor: 'white',
                  textAlign: 'center'
                }}
                component={Link}
                to="/settings/speech"
              >
                <FormattedMessage {...messages.changeVoiceOnError} />
              </Button>
            ) : null
          }
        >
          {isCloudError ? (
            <FormattedMessage {...messages.cloudSpeakErrorAlert} />
          ) : (
            <FormattedMessage {...messages.cloudVoiceIsSetedAlert} />
          )}
        </Alert>
      );
    }
  };
  return (
    <Snackbar
      {...config}
      open={open}
      ContentProps={{
        variant: 'elevation',
        'aria-describedby': 'message-id'
      }}
      message={<span id="message-id">{message}</span>}
      autoHideDuration={NOTIFICATION_DELAY}
      onClose={handleNotificationDismissal}
    >
      {childrenDependKind(kind)}
    </Snackbar>
  );
};

Notifications.propTypes = propTypes;

export default Notifications;
