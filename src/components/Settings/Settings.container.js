import React, { Component } from 'react';
import { connect } from 'react-redux';
import SettingsComponent from './Settings.component';

import { logout } from '../Account/Login/Login.actions';
import { getUser, isLogged } from '../App/App.selectors';
import { setLangs } from '../../providers/LanguageProvider/LanguageProvider.actions';
import { getVoices } from '../../providers/SpeechProvider/SpeechProvider.actions';
import tts from '../../providers/SpeechProvider/tts';
import { DEFAULT_LANG } from '../../components/App/App.constants';
import { getVoicesLangs } from '../../i18n';

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
            const sLanguages = getVoicesLangs(voices);
            if (sLanguages !== undefined && sLanguages.length) {
              supportedLangs = sLanguages;
              //hack just for Alfanum Serbian voices
              //https://github.com/cboard-org/cboard/issues/715
              if (supportedLangs.includes('sr-RS')) {
                supportedLangs.push('sr-SP');
              }
              //hack just for Tetum language
              //https://github.com/cboard-org/cboard/issues/848
              if (
                supportedLangs.includes('pt-BR') ||
                supportedLangs.includes('pt-PT')
              ) {
                supportedLangs.push('pt-TL');
              }
            }
          }
          setLangs(supportedLangs);
        }
      });
    }
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
