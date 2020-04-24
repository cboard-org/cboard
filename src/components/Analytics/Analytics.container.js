import React, { Component } from 'react';
import { connect } from 'react-redux';
import AnalyticsComponent from './Analytics.component';

import { logout } from '../Account/Login/Login.actions';
import { getUser, isLogged } from '../App/App.selectors';

export class AnalyticsContainer extends Component {
  static propTypes = {};

  componentDidUpdate(prevProps) {}

  render() {
    return <AnalyticsComponent {...this.props} />;
  }
}

const mapStateToProps = state => ({
  isLogged: isLogged(state),
  user: getUser(state)
});

const mapDispatchToProps = {
  logout
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnalyticsContainer);
