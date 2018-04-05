import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Button from 'material-ui/Button';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';

import messages from './AuthScreen.messages';
import { finishFirstVisit } from '../App/App.actions';
import Information from './Information';
import Login from '../Account/Login';
import SignUp from '../Account/SignUp';
import './AuthScreen.css';

class AuthScreen extends Component {
  state = {
    activeView: ''
  };

  static propTypes = {
    finishFirstVisit: PropTypes.func.isRequired
  };

  handleActiveView = activeView => {
    this.setState({
      activeView
    });
  };

  resetActiveView = () => {
    this.setState({
      activeView: ''
    });
  };

  render() {
    const { history } = this.props;
    const { activeView } = this.state;

    return (
      <Dialog fullScreen open onClose={history.goBack}>
        <div className="AuthScreen">
          <div className="AuthScreen__container">
            <IconButton
              color="inherit"
              onClick={history.goBack}
              aria-label="Close"
            >
              <CloseIcon />
            </IconButton>
            <div className="AuthScreen__content">
              <Information />
            </div>
            <footer className="AuthScreen__footer">
              <Button
                className="AuthScreen__button AuthScreen__button--login"
                variant="raised"
                onClick={() => this.handleActiveView('login')}
              >
                <FormattedMessage {...messages.login} />
              </Button>
              <Button
                className="AuthScreen__button AuthScreen__button--signup"
                variant="raised"
                color="primary"
                onClick={() => this.handleActiveView('signup')}
              >
                <FormattedMessage {...messages.signUp} />
              </Button>
            </footer>
          </div>
          <Login
            isDialogOpen={activeView === 'login'}
            onClose={this.resetActiveView}
          />
          <SignUp
            isDialogOpen={activeView === 'signup'}
            onClose={this.resetActiveView}
          />
        </div>
      </Dialog>
    );
  }
}

const mapDispatchToProps = {
  finishFirstVisit
};

export default connect(null, mapDispatchToProps)(AuthScreen);
