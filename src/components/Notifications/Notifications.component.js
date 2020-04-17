import React from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import { NOTIFICATION_DELAY } from './Notifications.constants';

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
      variant: 'elevation',
      'aria-describedby': 'message-id'
    }}
    message={<span id="message-id">{message}</span>}
    autoHideDuration={NOTIFICATION_DELAY}
    onClose={handleNotificationDismissal}
    // show any queued notifications after the
    // present one transitions out
    onExited={showQueuedNotificationIfAny}
  />
);

Notifications.propTypes = propTypes;

export default Notifications;
