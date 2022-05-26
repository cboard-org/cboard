import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

import SettingsComponent from './Settings.component';
import { logout } from '../Account/Login/Login.actions';
import { getUser, isLogged } from '../App/App.selectors';
import { injectIntl, intlShape } from 'react-intl';
import { disableTour } from '../../components/App/App.actions';

export class SettingsContainer extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    isLogged: PropTypes.bool.isRequired,
    user: PropTypes.object,
    logout: PropTypes.func.isRequired,
    isDownloadingLang: PropTypes.bool
  };

  render() {
    return <SettingsComponent {...this.props} />;
  }
}

const mapStateToProps = state => ({
  isLogged: isLogged(state),
  user: getUser(state),
  isSettingsTourEnabled: state.app.liveHelp.isSettingsTourEnabled,
  isDownloadingLang: state.language.downloadingLang.isdownloading
});

const mapDispatchToProps = {
  logout,
  disableTour
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(SettingsContainer));
