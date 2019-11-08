import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import {
  FacebookLoginButton,
  GoogleLoginButton
} from 'react-social-login-buttons';

import IconButton from '../UI/IconButton';
import Login from '../Account/Login';
import SignUp from '../Account/SignUp';
import ResetPassword from '../Account/ResetPassword';
import messages from './AuthScreen.messages';
import Information from './Information';
import CboardLogo from '../WelcomeScreen/CboardLogo/CboardLogo.component';
import './AuthScreen.css';
import { API_URL } from '../../constants';
import { isCordova } from '../../cordova-util';

class AuthScreen extends Component {
  state = {
    activeView: ''
  };

  handleActiveView = activeView => {
    this.setState({
      activeView
    });
  };

  onResetPasswordClick = () => {
    this.resetActiveView();
    this.handleActiveView('forgot');
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
              <CboardLogo />
            </div>

            <footer className="AuthScreen__footer">
              <Button
                className="AuthScreen__button AuthScreen__button--login"
                variant="contained"
                onClick={() => this.handleActiveView('login')}
              >
                <FormattedMessage {...messages.login} />
              </Button>
              <Button
                className="AuthScreen__button AuthScreen__button--signup"
                variant="contained"
                color="primary"
                onClick={() => this.handleActiveView('signup')}
              >
                <FormattedMessage {...messages.signUp} />
              </Button>

              {!isCordova() && (
                <div className="AuthScreen__button AuthScreen__button">
                  <GoogleLoginButton
                    className="AuthScreen__button AuthScreen__button--google"
                    onClick={() => {
                      window.location = `${API_URL}/login/google`;
                    }}
                  >
                    <FormattedMessage {...messages.google} />
                  </GoogleLoginButton>

                  <FacebookLoginButton
                    className="AuthScreen__button AuthScreen__button--facebook"
                    onClick={() => {
                      window.location = `${API_URL}/login/facebook`;
                    }}
                  >
                    <FormattedMessage {...messages.facebook} />
                  </FacebookLoginButton>
                </div>
              )}
            </footer>
          </div>
          <Login
            isDialogOpen={activeView === 'login'}
            onResetPasswordClick={this.onResetPasswordClick}
            onClose={this.resetActiveView}
          />
          <ResetPassword
            isDialogOpen={activeView === 'forgot'}
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
