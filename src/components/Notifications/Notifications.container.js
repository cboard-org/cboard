import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hideNotification, showNotification } from './Notifications.actions';
import { injectIntl, intlShape } from 'react-intl';
import messages from './Notifications.messages';
import Notifications from './Notifications.component';
import Button from '@material-ui/core/Button';

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
     * Should show undo button
     */
    showUndo: PropTypes.bool
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
        showUndo: nextProps.showUndo
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
      this.props.showNotification(nextInQueue.message, nextInQueue.showUndo);
      this.queuedNotifications.splice(0, 1);
      console.log('after', this.queuedNotifications);
    }
  };

  render() {
    const {
      open,
      message,
      showUndo,
      showNotification,
      hideNotification,
      intl,
      ...config
    } = this.props;

    if (message && message.length < 1) {
      return null;
    }

    const undoButton = showUndo
      ? [
          <Button key="undo" color="secondary" size="medium">
            {intl.formatMessage(messages.undo)}
          </Button>
        ]
      : [];

    return (
      <Notifications
        config={config}
        open={open}
        message={message}
        action={undoButton}
        handleNotificationDismissal={this.handleNotificationDismissal}
        showQueuedNotificationIfAny={this.showQueuedNotificationIfAny}
      />
    );
  }
}

const mapStateToProps = ({ notification: { message, open, showUndo } }) => ({
  message,
  open,
  showUndo
});

const mapDispatchToProps = {
  showNotification,
  hideNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(NotificationsContainer));
