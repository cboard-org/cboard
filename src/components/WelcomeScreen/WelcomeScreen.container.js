import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '../UI/IconButton';
import {
  FacebookLoginButton,
  GoogleLoginButton
} from 'react-social-login-buttons';

import messages from './WelcomeScreen.messages';
import { finishFirstVisit } from '../App/App.actions';
import Information from './Information';
import Login from '../Account/Login';
import SignUp from '../Account/SignUp';
import ResetPassword from '../Account/ResetPassword';
import CboardLogo from './CboardLogo/CboardLogo.component';
import './WelcomeScreen.css';
import { API_URL } from '../../constants';
import { isAndroid, isElectron } from '../../cordova-util';
import { login } from '../Account/Login/Login.actions';

export class WelcomeScreen extends Component {
  state = {
    activeView: ''
  };

  static propTypes = {
    finishFirstVisit: PropTypes.func.isRequired,
    heading: PropTypes.string,
    text: PropTypes.string,
    onClose: PropTypes.func
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

  handleGoogleLoginClick = () => {
    const { intl, login } = this.props;
    if (isAndroid()) {
      window.plugins.googleplus.login(
        {
          // 'scopes': '... ', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
          offline: true // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
        },
        function(obj) {
          login(
            {
              email: 'googletoken',
              password: `?access_token=${obj.accessToken}`
            },
            'oAuth'
          );
        },
        function(msg) {
          alert(intl.formatMessage(messages.loginErrorAndroid));
          console.log('error: ' + msg);
        }
      );
    } else {
      window.location = `${API_URL}/login/google`;
    }
  };

  handleFacebookLoginClick = () => {
    const { intl, login } = this.props;
    if (isAndroid()) {
      window.facebookConnectPlugin.login(
        ['email'],
        function(userData) {
          window.facebookConnectPlugin.getAccessToken(function(accesToken) {
            login(
              {
                email: 'facebooktoken',
                password: `?access_token=${accesToken}`
              },
              'oAuth'
            );
          });
        },
        function(msg) {
          alert(intl.formatMessage(messages.loginErrorAndroid));
          console.log(msg);
        }
      );
    } else {
      window.location = `${API_URL}/login/facebook`;
    }
  };

  render() {
    const { finishFirstVisit, heading, text, onClose } = this.props;
    const { activeView } = this.state;

    return (
      <div className="WelcomeScreen">
        <div className="WelcomeScreen__container">
          {onClose && (
            <IconButton label="close" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          )}
          <div className="WelcomeScreen__content">
            <Information heading={heading} text={text} />
          </div>
          <div className="WelcomeScreen__logo">
            <CboardLogo />
          </div>
          <footer className="WelcomeScreen__footer">
            <Button
              className="WelcomeScreen__button WelcomeScreen__button--login"
              variant="contained"
              onClick={() => this.handleActiveView('login')}
            >
              <FormattedMessage {...messages.login} />
            </Button>
            <Button
              className="WelcomeScreen__button WelcomeScreen__button--signup"
              variant="contained"
              color="primary"
              onClick={() => this.handleActiveView('signup')}
            >
              <FormattedMessage {...messages.signUp} />
            </Button>

            <div className="WelcomeScreen__button WelcomeScreen__button">
              {!isElectron() && (
                <GoogleLoginButton
                  className="WelcomeScreen__button WelcomeScreen__button--google"
                  onClick={this.handleGoogleLoginClick}
                >
                  <FormattedMessage {...messages.google} />
                </GoogleLoginButton>
              )}

              {!isElectron() && (
                <FacebookLoginButton
                  className="WelcomeScreen__button WelcomeScreen__button--facebook"
                  onClick={this.handleFacebookLoginClick}
                >
                  <FormattedMessage {...messages.facebook} />
                </FacebookLoginButton>
              )}
            </div>

            {!onClose && (
              <Button
                className="WelcomeScreen__button WelcomeScreen__button--skip"
                onClick={finishFirstVisit}
                style={{ color: '#fff', margin: '1em auto 0 auto' }}
              >
                <FormattedMessage {...messages.skipForNow} />
              </Button>
            )}
          </footer>
          <div className="WelcomeScreen__links">
            <Link
              href="https://www.cboard.io/privacy/"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
            >
              <FormattedMessage {...messages.privacy} />
            </Link>
            <Link
              href="https://www.cboard.io/terms-of-use/"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
            >
              <FormattedMessage {...messages.terms} />
            </Link>
          </div>
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
    );
  }
}

const mapDispatchToProps = {
  finishFirstVisit,
  login
};

export default connect(
  null,
  mapDispatchToProps
)(injectIntl(WelcomeScreen));
