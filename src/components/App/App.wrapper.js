import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import AppContainer from './App.container';
import NotFound from '../NotFound';
import Settings from '../Settings';
import WelcomeScreen from '../WelcomeScreen';
import AuthScreen, { RedirectIfLogged } from '../AuthScreen';
import Activate from '../Account/Activate';
import { isFirstVisit, isLogged } from './App.selectors';

const AppWrapper = ({ isFirstVisit, isLogged }) => (
  <Fragment>
    <Route
      exact
      component={isFirstVisit && !isLogged ? WelcomeScreen : AppContainer}
      path="/"
    />
    <Switch>
      <RedirectIfLogged
        component={AuthScreen}
        isLogged={isLogged}
        path="/login-signup"
        to="/"
      />
      <Route path="/settings" component={Settings} />
      <Route path="/activate/:url" component={Activate} />
      <Route component={NotFound} />
    </Switch>
  </Fragment>
);

AppWrapper.propTypes = {
  isFirstVisit: PropTypes.bool.isRequired,
  isLogged: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  isFirstVisit: isFirstVisit(state),
  isLogged: isLogged(state)
});

export default connect(mapStateToProps)(AppWrapper);
