import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import AppContainer from './App.container';
import NotFound from '../NotFound';
import Settings from '../Settings';
import WelcomeScreen from '../WelcomeScreen';
import LoginSignUpScreen from '../LoginSignUpScreen';

const AppWrapper = ({ isFirstVisit }) => [
  <Route component={isFirstVisit ? WelcomeScreen : AppContainer} />,
  <Switch>
    <Route path="/login-signup" component={LoginSignUpScreen} />
    <Route path="/settings" component={Settings} />
    <Route component={NotFound} />
  </Switch>
];

AppWrapper.propTypes = {
  isFirstVisit: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  isFirstVisit: state.app.isFirstVisit
});

export default connect(mapStateToProps)(AppWrapper);
