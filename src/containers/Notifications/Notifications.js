import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Snackbar from 'material-ui/Snackbar';
import { hideNotification as hideNotificationActionCreator } from './actions';

class Notifications extends Component {
  handleNotificationDismissal = (event, reason) => {
    this.props.hideNotification();
  };

  render() {
    const { message, open, hideNotification, ...config } = this.props;

    if (message && message.length < 1) {
      return null;
    }

    return (
      <Snackbar
        {...config}
        open={open}
        message={message}
        onRequestClose={this.handleNotificationDismissal}
      />
    );
  }
}

Notifications.defaultProps = {
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'right'
  },
  autoHideDuration: 6000, // ms
  open: false
};

Notifications.propTypes = {
  message: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  hideNotification: PropTypes.func.isRequired
};

function mapStateToProps({ notification: { message, open } }) {
  return {
    message,
    open
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideNotification() {
      dispatch(hideNotificationActionCreator());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
