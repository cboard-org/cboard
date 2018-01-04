import React from 'react';
import PropTypes from 'prop-types';
import Snackbar from 'material-ui/Snackbar';

const propTypes = {
  config: PropTypes.object.isRequired,
  handleNotificationDismissal: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  showQueuedNotificationIfAny: PropTypes.func.isRequired
};

const NotificationsComponent = ({
  config,
  handleNotificationDismissal,
  message,
  open,
  showQueuedNotificationIfAny
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
