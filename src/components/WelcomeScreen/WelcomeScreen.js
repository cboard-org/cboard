import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from 'material-ui/Button';

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

  handleSubmit = values => {
    console.log(values);
  };

  render() {
    const { finishFirstVisit } = this.props;
    const { activeView } = this.state;
    const CurrentView = views[activeView];

    return (
      <div className="WelcomeScreen">
        <div className="WelcomeScreen__content">
          <CurrentView
            handleBack={this.handleBack}
            handleSubmit={this.handleSubmit}
          />
        </div>
        <footer className="WelcomeScreen__footer">
          <Button
            raised
            color="primary"
            onClick={() => this.handleView('SignUp')}
          >
            Sign up
          </Button>
          <Button
            raised
            color="primary"
            onClick={() => this.handleView('Login')}
          >
            Sign in
          </Button>
          <Button
            raised
            color="primary"
            className="GoToApp"
            onClick={finishFirstVisit}
          >
            Go to the app
          </Button>
        </footer>
      </div>
    );
  }
}

const mapDispatchToProps = {
  finishFirstVisit
};

export default connect(null, mapDispatchToProps)(WelcomeScreen);
