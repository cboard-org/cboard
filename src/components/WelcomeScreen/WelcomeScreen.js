import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MobileStepper from 'material-ui/MobileStepper';

import Intro from './Intro/index';
import SignUp from './SignUp/index';
import './WelcomeScreen.css';

class WelcomeScreen extends Component {
  static propTypes = {};

  state = {
    activeStep: 0
  };

  handleNext = () => {
    this.setState({
      activeStep: this.state.activeStep + 1
    });
  };

  handleBack = () => {
    this.setState({
      activeStep: this.state.activeStep - 1
    });
  };

  render() {
    let content = null;

    switch (this.state.activeStep) {
      case 0:
        content = <Intro />;
        break;
      case 1:
        content = <SignUp />;
        break;
      default:
      // no default
    }

    return (
      <div className="WelcomeScreen">
        <div className="WelcomeScreen__content">{content}</div>
        <div className="WelcomeScreen__footer">
          <MobileStepper
            type="dots"
            steps={2}
            position="static"
            activeStep={this.state.activeStep}
            onBack={this.handleBack}
            onNext={this.handleNext}
            disableBack={this.state.activeStep === 0}
            disableNext={this.state.activeStep === 1}
          />
        </div>
      </div>
    );
  }
}

export default WelcomeScreen;
