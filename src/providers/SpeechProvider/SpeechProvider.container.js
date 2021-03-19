import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import tts from './tts';
import {
  getVoices,
  changeVoice,
  getTtsEngines,
  getTtsDefaultEngine
} from './SpeechProvider.actions';
import {
  changeLang,
  setLangs
} from '../LanguageProvider/LanguageProvider.actions';
import { DEFAULT_LANG } from '../../components/App/App.constants';
import { getVoicesLangs } from '../../i18n';
import { isCordova } from '../../cordova-util';

export class SpeechProvider extends Component {
  static propTypes = {
    langs: PropTypes.array.isRequired,
    children: PropTypes.node.isRequired
  };

  async componentDidMount() {
    const {
      lang: propsLang,
      setLangs,
      changeLang,
      voiceURI,
      changeVoice,
      getVoices,
      getTtsEngines,
      getTtsDefaultEngine
    } = this.props;
    if (tts.isSupported()) {
      const voices = await getVoices();
      let supportedLangs = [DEFAULT_LANG];
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
      const lang = supportedLangs.includes(propsLang)
        ? propsLang
        : this.getDefaultLang(supportedLangs);
      setLangs(supportedLangs);
      changeLang(lang);

      const uris = voices.map(v => {
        return v.voiceURI;
      });
      if (uris.includes(voiceURI)) {
        changeVoice(voiceURI, lang);
      }
      //if (isCordova()) {
      getTtsEngines();
      getTtsDefaultEngine();
      //}
    }
  }

  getDefaultLang(langs) {
    for (let i = 0; i < langs.length; i++) {
      if (window.navigator.language.slice(0, 2) === langs[i].slice(0, 2)) {
        return langs[i];
      }
    }
    return langs.includes(DEFAULT_LANG) ? DEFAULT_LANG : langs[0];
  }

  render() {
    const { children } = this.props;

    return React.Children.only(children);
  }
}

const mapStateToProps = state => ({
  langs: state.speech.langs,
  lang: state.language.lang,
  voiceURI: state.speech.options.voiceURI
});

const mapDispatchToProps = {
  getVoices,
  changeLang,
  setLangs,
  changeVoice,
  getTtsEngines,
  getTtsDefaultEngine
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SpeechProvider);
