import React from 'react';
import PropTypes from 'prop-types';
import Snackbar from 'material-ui/Snackbar';

const propTypes = {
  open: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  showQueuedNotificationIfAny: PropTypes.func.isRequired,
  handleNotificationDismissal: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired
};

const NotificationsComponent = ({
  open,
  message,
  showQueuedNotificationIfAny,
  handleNotificationDismissal,
  config
}) => (
  <Snackbar
    {...config}
    open={open}
    SnackbarContentProps={{
      'aria-describedby': 'message-id'
    }}
    message={<span id="message-id">{message}</span>}
    onClose={handleNotificationDismissal}
    // show any queued notifications after the
    // present one transitions out
    onExited={showQueuedNotificationIfAny}
  />
);

NotificationsComponent.propTypes = propTypes;

export default NotificationsComponent;
