import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';

import AppComponent from './App';
import WelcomeScreen from '../WelcomeScreen';

const AppContainer = ({ isFirstVisit }) => (
  <Route path="/" component={isFirstVisit ? WelcomeScreen : AppComponent} />
);

AppContainer.propTypes = {
  isFirstVisit: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  isFirstVisit: state.app.isFirstVisit
});

export default connect(mapStateToProps)(AppContainer);
