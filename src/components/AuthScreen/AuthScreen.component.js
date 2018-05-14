import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';

import IconButton from '../UI/IconButton';
import Login from '../Account/Login';
import SignUp from '../Account/SignUp';
import messages from './AuthScreen.messages';
import Information from './Information';
import './AuthScreen.css';

class AuthScreen extends Component {
  state = {
    activeView: ''
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
            <IconButton label="Close" onClick={history.goBack}>
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

export default AuthScreen;
