import React from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';

const propTypes = {
  config: PropTypes.object.isRequired,
  handleNotificationDismissal: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  showQueuedNotificationIfAny: PropTypes.func.isRequired
};

const Notifications = ({
  config,
  handleNotificationDismissal,
  message,
  open,
  showQueuedNotificationIfAny
}) => (
  <Snackbar
    {...config}
    open={open}
    ContentProps={{
      'aria-describedby': 'message-id'
    }}
    message={<span id="message-id">{message}</span>}
    autoHideDuration={5000}
    onClose={handleNotificationDismissal}
    // show any queued notifications after the
    // present one transitions out
    onExited={showQueuedNotificationIfAny}
  />
);

Notifications.propTypes = propTypes;

export default Notifications;
