import React from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import { NOTIFICATION_DELAY } from './Notifications.constants';
import { FormattedMessage } from 'react-intl';
import messages from './Notifications.messages';

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
  >
    {kind === 'refresh' ? (
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
    ) : null}
  </Snackbar>
);

Notifications.propTypes = propTypes;

export default Notifications;
