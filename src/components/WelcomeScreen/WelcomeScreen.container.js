import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '../UI/IconButton';
import {
  AppleLoginButton,
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
import {
  isAndroid,
  isElectron,
  isIOS,
  manageKeyboardEvents
} from '../../cordova-util';

export class WelcomeScreen extends Component {
  state = {
    activeView: '',
    keyboard: { isKeyboardOpen: false, keyboardHeight: undefined },
    dialogWithKeyboardStyle: {
      dialogStyle: {},
      dialogContentStyle: {}
    }
  };

  static propTypes = {
    finishFirstVisit: PropTypes.func.isRequired,
    heading: PropTypes.string,
    text: PropTypes.string,
    onClose: PropTypes.func
  };

  handleKeyboardDidShow = event => {
    this.setState({
      keyboard: { isKeyboardOpen: true, keyboardHeight: event.keyboardHeight }
    });
  };

  handleKeyboardDidHide = () => {
    this.setState({
      keyboard: { isKeyboardOpen: false, keyboardHeight: null }
    });
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
    const { intl } = this.props;
    if (isAndroid() || isIOS()) {
      window.plugins.googleplus.login(
        {
          // 'scopes': '... ', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
          offline: true // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
        },
        function(obj) {
          window.location.hash = `#/login/googletoken/callback?access_token=${
            obj.accessToken
          }`;
        },
        function(msg) {
          alert(intl.formatMessage(messages.loginErrorAndroid));
          console.log('error: ' + msg);
        }
      );
    } else {
      window.location = `${API_URL}login/google`;
    }
  };

  handleFacebookLoginClick = () => {
    const { intl } = this.props;
    if (isAndroid() || isIOS()) {
      window.facebookConnectPlugin.login(
        ['email'],
        function(userData) {
          window.facebookConnectPlugin.getAccessToken(function(accesToken) {
            window.location.hash = `#/login/facebooktoken/callback?access_token=${accesToken}`;
          });
        },
        function(msg) {
          alert(intl.formatMessage(messages.loginErrorAndroid));
          console.log(msg);
        }
      );
    } else {
      window.location = `${API_URL}login/facebook`;
    }
  };

  handleAppleLoginClick = () => {
    const intl = this.props.intl;
    if (isIOS()) {
      window.cordova.plugins.SignInWithApple.signin(
        { requestedScopes: [0, 1] },
        function(succ) {
          window.location.hash = `#/login/apple/callback?${
            succ.authorizationCode
          }`;
        },
        function(err) {
          alert(intl.formatMessage(messages.loginErrorAndroid));
          console.error(err);
        }
      );
      return;
    }
    window.location = `${API_URL}login/apple-web`;
  };

  updateDialogStyle() {
    if (!(isAndroid() || isIOS())) return;
    const { isKeyboardOpen, keyboardHeight } = this.state.keyboard;
    if (isKeyboardOpen) {
      const KEYBOARD_MARGIN_TOP = 30;
      const DEFAULT_KEYBOARD_SPACE = 310;
      const keyboardSpace = keyboardHeight
        ? keyboardHeight + KEYBOARD_MARGIN_TOP
        : DEFAULT_KEYBOARD_SPACE;
      return {
        dialogStyle: {
          marginBottom: `${keyboardSpace}px`
        },
        dialogContentStyle: {
          maxHeight: `calc(92vh - ${keyboardSpace}px)`,
          overflow: 'scroll'
        }
      };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (!(isAndroid() || isIOS())) return;
    const { isKeyboardOpen: wasKeyboardOpen } = prevState.keyboard;
    const { isKeyboardOpen } = this.state.keyboard;
    if (wasKeyboardOpen !== isKeyboardOpen) {
      this.setState({
        dialogWithKeyboardStyle: this.updateDialogStyle()
      });
    }
  }

  componentDidMount() {
    if (!(isAndroid() || isIOS())) return;
    manageKeyboardEvents({
      onShow: this.handleKeyboardDidShow,
      onHide: this.handleKeyboardDidHide
    });
  }
  componentWillUnmount() {
    if (!(isAndroid() || isIOS())) return;
    manageKeyboardEvents({
      onShow: this.handleKeyboardDidShow,
      onHide: this.handleKeyboardDidHide,
      removeEvent: true
    });
  }

  render() {
    const { finishFirstVisit, heading, text, onClose } = this.props;
    const { activeView, dialogWithKeyboardStyle } = this.state;

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

              {!isAndroid() && !isElectron() && (
                <AppleLoginButton
                  className="WelcomeScreen__button WelcomeScreen__button--google"
                  onClick={this.handleAppleLoginClick}
                >
                  <FormattedMessage {...messages.apple} />
                </AppleLoginButton>
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
          dialogWithKeyboardStyle={dialogWithKeyboardStyle}
        />
        <ResetPassword
          isDialogOpen={activeView === 'forgot'}
          onClose={this.resetActiveView}
        />
        <SignUp
          isDialogOpen={activeView === 'signup'}
          onClose={this.resetActiveView}
          dialogWithKeyboardStyle={dialogWithKeyboardStyle}
        />
      </div>
    );
  }
}

const mapDispatchToProps = {
  finishFirstVisit
};

export default connect(
  null,
  mapDispatchToProps
)(injectIntl(WelcomeScreen));
