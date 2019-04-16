import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hideNotification, showNotification } from './Notifications.actions';
import { injectIntl, intlShape } from 'react-intl';
import Notifications from './Notifications.component';

class NotificationsContainer extends Component {
  static propTypes = {
    /**
     * @ignore
     */
    intl: intlShape.isRequired,
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
     * Hides notification bar
     */
    hideNotification: PropTypes.func.isRequired,
    /**
     * The actions at the end of the notification
     */
    action: PropTypes.node
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
      this.queuedNotifications.push({
        message: nextProps.message,
        action: nextProps.action
      });
      return false;
    } else {
      return true;
    }
  }

  handleNotificationDismissal = (event, reason) => {
    const { hideNotification } = this.props;
    if (reason === 'clickaway') {
      return;
    }
    hideNotification();
  };

  showQueuedNotificationIfAny = () => {
    if (this.queuedNotifications.length !== 0) {
      console.log('before', this.queuedNotifications);

      const nextInQueue = this.queuedNotifications[0];
      this.props.showNotification(nextInQueue.message, nextInQueue.action);
      this.queuedNotifications.splice(0, 1);
      console.log('after', this.queuedNotifications);
    }
  };

  render() {
    const {
      open,
      message,
      action,
      showNotification,
      hideNotification,
      intl,
      ...config
    } = this.props;

    if (message && message.length < 1) {
      return null;
    }

    return (
      <Notifications
        config={config}
        open={open}
        message={message}
        action={action}
        handleNotificationDismissal={this.handleNotificationDismissal}
        showQueuedNotificationIfAny={this.showQueuedNotificationIfAny}
      />
    );
  }
}

const mapStateToProps = ({ notification: { message, open, action } }) => ({
  message,
  open,
  action
});

const mapDispatchToProps = {
  showNotification,
  hideNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(NotificationsContainer));
