import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

import SettingsComponent from './Settings.component';
import { logout } from '../Account/Login/Login.actions';
import { getUser, isLogged } from '../App/App.selectors';
import { injectIntl, intlShape } from 'react-intl';
import { disableTour } from '../../components/App/App.actions';
import { adMobAds, isAndroid } from '../../cordova-util';

export class SettingsContainer extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    isLogged: PropTypes.bool.isRequired,
    user: PropTypes.object,
    logout: PropTypes.func.isRequired,
    isDownloadingLang: PropTypes.bool
  };
  async componentDidMount() {
    if (isAndroid()) {
      const { bannerAd, interstitialAd } = adMobAds;
      interstitialAd
        .show()
        .catch(msg =>
          console.error('The interstitial advice is not available')
        );
      bannerAd
        .show()
        .catch(msg => console.error('The banner advice is not available'));
    }
  }

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
