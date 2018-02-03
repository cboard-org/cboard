import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import AppComponent from './App';
import WelcomeScreen from '../WelcomeScreen';

const AppContainer = ({ isFirstVisit }) => (
  <Switch>
    <Route exact path="/">
      {isFirstVisit ? <WelcomeScreen /> : <AppComponent />}
    </Route>
  </Switch>
);

AppContainer.propTypes = {
  isFirstVisit: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  isFirstVisit: state.app.isFirstVisit
});

export default connect(mapStateToProps)(AppContainer);
