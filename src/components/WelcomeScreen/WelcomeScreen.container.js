import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Button from 'material-ui/Button';

import messages from './WelcomeScreen.messages';
import { finishFirstVisit } from '../App/App.actions';
import Information from './Information';
import Login from './Login';
import SignUp from './SignUp';
import './WelcomeScreen.css';

class WelcomeScreen extends Component {
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
    const { finishFirstVisit } = this.props;
    const { activeView } = this.state;

    return (
      <div className="WelcomeScreen">
        <div className="WelcomeScreen__container">
          <div className="WelcomeScreen__content">
            <Information />
          </div>
          <footer className="WelcomeScreen__footer">
            <Button
              className="WelcomeScreen__button WelcomeScreen__button--login"
              onClick={() => this.handleActiveView('login')}
              variant="raised"
            >
              <FormattedMessage {...messages.login} />
            </Button>
            <Button
              className="WelcomeScreen__button WelcomeScreen__button--signup"
              variant="raised"
              color="primary"
              onClick={() => this.handleActiveView('signup')}
            >
              <FormattedMessage {...messages.signUp} />
            </Button>
            <Button
              className="WelcomeScreen__button WelcomeScreen__button--skip"
              onClick={finishFirstVisit}
              style={{ color: '#fff' }}
            >
              <FormattedMessage {...messages.skipForNow} />
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
    );
  }
}

const mapDispatchToProps = {
  finishFirstVisit
};

export default connect(null, mapDispatchToProps)(WelcomeScreen);
