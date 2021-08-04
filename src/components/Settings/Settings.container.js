import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

import SettingsComponent from './Settings.component';
import { logout } from '../Account/Login/Login.actions';
import { getUser, isLogged } from '../App/App.selectors';
import { setLangs } from '../../providers/LanguageProvider/LanguageProvider.actions';
import { getVoices } from '../../providers/SpeechProvider/SpeechProvider.actions';
import tts from '../../providers/SpeechProvider/tts';
import { DEFAULT_LANG } from '../../components/App/App.constants';
import { getVoicesLangs } from '../../i18n';
import { injectIntl, intlShape } from 'react-intl';
import { disableTour } from '../../components/App/App.actions';

export class SettingsContainer extends Component {
  static propTypes = {
    intl: intlShape.isRequired
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
  user: getUser(state),
  isSettingsTourEnabled: state.app.liveHelp.isSettingsTourEnabled
});

const mapDispatchToProps = {
  logout,
  disableTour
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(SettingsContainer));
