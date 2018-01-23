import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from 'material-ui/Button';

import { finishFirstVisit } from '../App/App.actions';
import { getLangsOptions } from './WelcomeScreen.selectors';
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
    finishFirstVisit: PropTypes.func.isRequired,
    langs: PropTypes.array.isRequired
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
    const { finishFirstVisit, langs } = this.props;
    const { activeView } = this.state;
    const CurrentView = views[activeView];

    return (
      <div className="WelcomeScreen">
        <div className="WelcomeScreen__container">
          <div className="WelcomeScreen__content">
            <CurrentView
              handleBack={this.handleBack}
              handleSubmit={this.handleSubmit}
              langs={langs}
            />
          </div>
          <footer className="WelcomeScreen__footer">
            <Button
              className="WelcomeScreen__button WelcomeScreen__button--login"
              raised
              onClick={() => this.handleView('Login')}
            >
              Login
            </Button>
            <Button
              className="WelcomeScreen__button WelcomeScreen__button--signup"
              raised
              color="primary"
              onClick={() => this.handleView('SignUp')}
            >
              Sign up
            </Button>
            <Button
              className="WelcomeScreen__button WelcomeScreen__button--skip"
              style={{ color: '#fff' }}
              onClick={finishFirstVisit}
            >
              Skip for now
            </Button>
          </footer>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  langs: getLangsOptions(state)
});

const mapDispatchToProps = {
  finishFirstVisit
};

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeScreen);
