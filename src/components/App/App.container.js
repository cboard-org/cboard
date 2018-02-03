import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';

import AppComponent from './App';
import WelcomeScreen from '../WelcomeScreen';

const AppContainer = ({ isFirstVisit }) => (
  <Switch>
    <Route
      path="/"
      render={props => (isFirstVisit ? <WelcomeScreen /> : <AppComponent />)}
    />
  </Switch>
);

AppContainer.propTypes = {
  isFirstVisit: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  isFirstVisit: state.app.isFirstVisit
});

export default withRouter(connect(mapStateToProps)(AppContainer));
