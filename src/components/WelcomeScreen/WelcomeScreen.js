import React, { Component } from 'react';
import Button from 'material-ui/Button';

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
        <div className="WelcomeScreen__footer">
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
            onClick={() => console.log('finish first visit')}
          >
            Go to the app
          </Button>
        </div>
      </div>
    );
  }
}

export default WelcomeScreen;
