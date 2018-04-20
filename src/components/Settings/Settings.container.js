import React from 'react';
import { connect } from 'react-redux';
import SettingsComponent from './Settings.component';

import { logout } from '../Account/Login/Login.actions';
import { getUser, isLogged } from '../App/App.selectors';

const SettingsContainer = props => <SettingsComponent {...props} />;

const mapStateToProps = state => ({
  isLogged: isLogged(state),
  user: getUser(state)
});

const mapDispatchToProps = {
  logout
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer);
