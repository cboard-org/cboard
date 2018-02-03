import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Link, Route, Switch, withRouter } from 'react-router-dom';
import Button from 'material-ui/Button';

import messages from './WelcomeScreen.messages';
import { finishFirstVisit } from '../App/App.actions';
import Information from './Information';
import Login from './Login';
import SignUp from './SignUp';
import './WelcomeScreen.css';

class WelcomeScreen extends Component {
  static propTypes = {
    finishFirstVisit: PropTypes.func.isRequired
  };

  render() {
    const { finishFirstVisit } = this.props;

    return (
      <div className="WelcomeScreen">
        <div className="WelcomeScreen__container">
          <div className="WelcomeScreen__content">
            <Switch>
              <Route exact path="/" component={Information} />
              <Route path="/login" component={Login} />
              <Route path="/signup" component={SignUp} />
            </Switch>
          </div>
          <footer className="WelcomeScreen__footer">
            <Button
              className="WelcomeScreen__button WelcomeScreen__button--login"
              component={Link}
              raised
              to="/login"
            >
              <FormattedMessage {...messages.login} />
            </Button>
            <Button
              className="WelcomeScreen__button WelcomeScreen__button--signup"
              color="primary"
              component={Link}
              raised
              to="/signup"
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
      </div>
    );
  }
}

const mapDispatchToProps = {
  finishFirstVisit
};

export default withRouter(connect(null, mapDispatchToProps)(WelcomeScreen));
