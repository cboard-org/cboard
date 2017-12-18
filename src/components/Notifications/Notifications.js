import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Snackbar from 'material-ui/Snackbar';
import {
  hideNotification as hideNotificationActionCreator,
  showNotification as showNotificationActionCreator
} from './Notifications.actions';

class Notifications extends Component {
  static propTypes = {
    /**
     * If true, notification bar is open, used by showNotification
     */
    open: PropTypes.bool.isRequired,
    /**
     * The Message to display
     */
    message: PropTypes.string.isRequired,
    /**
     * Shows notification bar
     */
    showNotification: PropTypes.func.isRequired,
    /**
     * Hids notification bar
     */
    hideNotification: PropTypes.func.isRequired
  };

  static defaultProps = {
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'center'
    },
    autoHideDuration: 5000, // ms
    open: false
  };

  // maintain queued notifications
  // a notification is queued if already another
  // notification is already displayed
  // this is not part of the state beacuase
  // we do not want a change in this to re-render
  // our component
  queuedNotifications = [];

  shouldComponentUpdate(nextProps) {
    // following the material design guidelines
    // we can only show one notification at a time
    // here we ignore updates to an already displayed
    // notifcation and instead queue them to be shown
    // after the present one transitions out
    if (
      this.props.open &&
      nextProps.open &&
      this.props.message !== nextProps.message
    ) {
      this.queuedNotifications.push(nextProps.message);
      return false;
    } else {
      return true;
    }
  }

  handleNotificationDismissal = (event, reason) => {
    this.props.hideNotification();
  };

  showQueuedNotificationIfAny = () => {
    if (this.queuedNotifications.length !== 0) {
      console.log('before', this.queuedNotifications);
      this.props.showNotification(this.queuedNotifications[0]);
      this.queuedNotifications.splice(0, 1);
      console.log('after', this.queuedNotifications);
    }
  };

  render() {
    const {
      open,
      message,
      showNotification,
      hideNotification,
      ...config
    } = this.props;

    if (message && message.length < 1) {
      return null;
    }

    return (
      <Snackbar
        {...config}
        open={open}
        SnackbarContentProps={{
          'aria-describedby': 'message-id'
        }}
        message={<span id="message-id">{message}</span>}
        onClose={this.handleNotificationDismissal}
        // show any queued notifications after the
        // present one transitions out
        onExited={this.showQueuedNotificationIfAny}
      />
    );
  }
}

const mapStateToProps = ({ notification: { message, open } }) => ({
  message,
  open
});

const mapDispatchToProps = dispatch => ({
  showNotification(message) {
    dispatch(showNotificationActionCreator(message));
  },

  hideNotification() {
    dispatch(hideNotificationActionCreator());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
