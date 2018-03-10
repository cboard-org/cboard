import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hideNotification, showNotification } from './Notifications.actions';
import NotificationsComponent from './Notifications.component';

class NotificationsContainer extends Component {
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
    // notification and instead queue them to be shown
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
    const { hideNotification } = this.props;

    hideNotification();
  };

  showQueuedNotificationIfAny = () => {
    if (this.queuedNotifications.length !== 0) {
      this.props.showNotification(this.queuedNotifications[0]);
      this.queuedNotifications.splice(0, 1);
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
      <NotificationsComponent
        open={open}
        message={message}
        showQueuedNotificationIfAny={this.showQueuedNotificationIfAny}
        handleNotificationDismissal={this.handleNotificationDismissal}
        config={config}
      />
    );
  }
}

const mapStateToProps = ({ notification: { message, open } }) => ({
  message,
  open
});

const mapDispatchToProps = {
  showNotification,
  hideNotification
};

export default connect(mapStateToProps, mapDispatchToProps)(
  NotificationsContainer
);
