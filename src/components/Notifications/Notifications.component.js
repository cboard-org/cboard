import React from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { NOTIFICATION_DELAY } from './Notifications.constants';

const propTypes = {
  config: PropTypes.object.isRequired,
  handleNotificationDismissal: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  kind:PropTypes.string.isRequired,
  showQueuedNotificationIfAny: PropTypes.func.isRequired
};

const Notifications = ({
  config,
  handleNotificationDismissal,
  message,
  open,
  kind,
  showQueuedNotificationIfAny
}) => (
  <Snackbar 
    {...config}
    open={open}
    ContentProps={{
      variant: 'elevation',
      'aria-describedby': 'message-id'
      }}
    autoHideDuration={NOTIFICATION_DELAY} 
    onClose={handleNotificationDismissal}
    // show any queued notifications after the  
    // present one transitions outhandleNotificationDismissal
    onExited={showQueuedNotificationIfAny}>
    {kind==='refresh' && <MuiAlert elevation={6} variant="filled" onClose={handleNotificationDismissal} severity='info'>
      <span id="message-id">{message}</span>
    </MuiAlert>}
  </Snackbar>
  // <Snackbar
  //   {...config}
  //   open={open}
  //   ContentProps={{
  //     variant: 'elevation',
  //     'aria-describedby': 'message-id'
  //   }}
  //   message={kind === 'newContent'? <span id="message-id">{message}</span> : 'sabe'}
  //   autoHideDuration={NOTIFICATION_DELAY}
  //   onClose={handleNotificationDismissal}
  //   // show any queued notifications after the
  //   // present one transitions outhandleNotificationDismissal
  //   onExited={showQueuedNotificationIfAny}
  // />
);

Notifications.propTypes = propTypes;

export default Notifications;
