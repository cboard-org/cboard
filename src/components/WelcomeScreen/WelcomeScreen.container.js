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

const views = {
  Information,
  Login,
  SignUp
};

class WelcomeScreen extends Component {
  static propTypes = {
    finishFirstVisit: PropTypes.func.isRequired
  };

  state = {
    activeView: 'Information'
  };

  handleBack = () => {
    this.setState({ activeView: 'Information' });
  };

  handleView = activeView => {
    this.setState({ activeView });
  };

  render() {
    const { finishFirstVisit } = this.props;
    const { activeView } = this.state;
    const CurrentView = views[activeView];

    return (
      <div className="WelcomeScreen">
        <div className="WelcomeScreen__container">
          <div className="WelcomeScreen__content">
            <CurrentView handleBack={this.handleBack} />
          </div>
          <footer className="WelcomeScreen__footer">
            <Button
              className="WelcomeScreen__button WelcomeScreen__button--login"
              raised
              onClick={() => this.handleView('Login')}
            >
              <FormattedMessage {...messages.login} />
            </Button>
            <Button
              className="WelcomeScreen__button WelcomeScreen__button--signup"
              raised
              color="primary"
              onClick={() => this.handleView('SignUp')}
            >
              <FormattedMessage {...messages.signUp} />
            </Button>
            <Button
              className="WelcomeScreen__button WelcomeScreen__button--skip"
              style={{ color: '#fff' }}
              onClick={finishFirstVisit}
            >
              <FormattedMessage {...messages.skipForNow} />
            </Button>
          </footer>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  finishFirstVisit
};

export default connect(null, mapDispatchToProps)(WelcomeScreen);
