import React, { Component } from 'react';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

import './WelcomeScreen.css';

class WelcomeScreen extends Component {
  render() {
    return (
      <div className="WelcomeScreen">
        <Typography type="display3" className="WelcomeScreen__heading">
          Welcome to Cboard!
        </Typography>
        <div className="WelcomeScreen__content">
          <p>
            Cboard is an augmentative and alternative communication (AAC) web
            application, allowing users with speech and language impairments to
            communicate by symbols and text-to-speech.
          </p>
          <p>
            Cboard is a web application for children and adults with speech and
            language impairment, aiding communication with pictures and
            text-to-speech.
          </p>
          <p>
            You don't need an account to use Cboard, but if you sign up, your
            data will be shared between the devices you log in.
          </p>
        </div>
        <div className="WelcomeScreen__footer">
          <Button
            raised
            color="primary"
            onClick={() => console.log('create account')}
          >
            Create an account
          </Button>
          <Button
            raised
            color="primary"
            onClick={() => console.log('go to login')}
          >
            Login
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
