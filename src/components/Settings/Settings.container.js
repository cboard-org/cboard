import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

import SettingsComponent from './Settings.component';
import { logout } from '../Account/Login/Login.actions';
import { getUser, isLogged } from '../App/App.selectors';

export class SettingsContainer extends Component {
  static propTypes = {
    isLogged: PropTypes.bool.isRequired,
    user: PropTypes.object,
    logout: PropTypes.func.isRequired
  };

  render() {
    return <SettingsComponent {...this.props} />;
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
)(SettingsContainer);
