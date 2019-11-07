import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Button from '@material-ui/core/Button';
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
import { isCordova } from '../../cordova-util';

export class WelcomeScreen extends Component {
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
    const { finishFirstVisit } = this.props;
    const { activeView } = this.state;

    return (
      <div className="WelcomeScreen">
        <div className="WelcomeScreen__container">
          <div className="WelcomeScreen__content">
            <Information />
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
            {!isCordova() && (
              <div className="WelcomeScreen__button WelcomeScreen__button">
                <GoogleLoginButton
                  className="WelcomeScreen__button WelcomeScreen__button--google"
                  onClick={() => {
                    window.location = `${API_URL}/login/google`;
                  }}
                >
                  <FormattedMessage {...messages.google} />
                </GoogleLoginButton>

                <FacebookLoginButton
                  className="WelcomeScreen__button WelcomeScreen__button--facebook"
                  onClick={() => {
                    window.location = `${API_URL}/login/facebook`;
                  }}
                >
                  <FormattedMessage {...messages.facebook} />
                </FacebookLoginButton>
              </div>
            )}

            <Button
              className="WelcomeScreen__button WelcomeScreen__button--skip"
              onClick={finishFirstVisit}
              style={{ color: '#fff', margin: '1em auto 0 auto' }}
            >
              <FormattedMessage {...messages.skipForNow} />
            </Button>
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
    );
  }
}

const mapDispatchToProps = {
  finishFirstVisit
};

export default connect(
  null,
  mapDispatchToProps
)(WelcomeScreen);
