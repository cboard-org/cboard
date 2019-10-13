import React, { Component } from 'react';
import { connect } from 'react-redux';
import SettingsComponent from './Settings.component';

import { logout } from '../Account/Login/Login.actions';
import { getUser, isLogged } from '../App/App.selectors';
import { setLangs } from '../../providers/LanguageProvider/LanguageProvider.actions';
import { getVoices } from '../../providers/SpeechProvider/SpeechProvider.actions';
import tts from '../../providers/SpeechProvider/tts';
import { APP_LANGS, DEFAULT_LANG } from '../../components/App/App.constants';

export class SettingsContainer extends Component {
  static propTypes = {};

  componentDidUpdate(prevProps) {
    const { setLangs, getVoices } = this.props;
    if (tts.isSupported()) {
      getVoices().then(voices => {
        const prevVoices = prevProps.voices.map(({ voiceURI }) => voiceURI);
        const currentVoices = voices.map(({ voiceURI }) => voiceURI);
        if (JSON.stringify(currentVoices) !== JSON.stringify(prevVoices)) {
          let supportedLangs = DEFAULT_LANG;
          if (voices.length) {
            const sLanguages = this.getVoicesLangs(voices);
            if (sLanguages !== undefined && sLanguages.length) {
              supportedLangs = sLanguages;
            }
          }
          // hack just for alfanum voice
          if (supportedLangs.length === 1 && supportedLangs[0] === 'sr-RS') {
            supportedLangs.push('hr-HR');
            supportedLangs.push('me-ME');
          }
          setLangs(supportedLangs);
        }
      });
    }
  }

  getVoicesLangs(voices) {
    let langs = [...new Set(voices.map(voice => voice.lang))].sort();
    return langs.filter(lang => APP_LANGS.includes(lang));
  }

  render() {
    return <SettingsComponent {...this.props} />;
  }
}

const mapStateToProps = state => ({
  isLogged: isLogged(state),
  user: getUser(state),
  voices: state.speech.voices
});

const mapDispatchToProps = {
  logout,
  setLangs,
  getVoices
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsContainer);
