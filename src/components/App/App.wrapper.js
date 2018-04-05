import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import AppContainer from './App.container';
import NotFound from '../NotFound';
import Settings from '../Settings';
import WelcomeScreen from '../WelcomeScreen';
import AuthScreen from '../AuthScreen';

const AppWrapper = ({ isFirstVisit }) => (
  <Fragment>
    <Route component={isFirstVisit ? WelcomeScreen : AppContainer} />
    <Switch>
      <Route path="/login-signup" component={AuthScreen} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  </Fragment>
);

AppWrapper.propTypes = {
  isFirstVisit: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  isFirstVisit: state.app.isFirstVisit
});

export default connect(mapStateToProps)(AppWrapper);
