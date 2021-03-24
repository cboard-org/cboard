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
import { getSupportedLangs, getDefaultLang } from '../../i18n';
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
      const supportedLangs = getSupportedLangs(voices);
      const lang = supportedLangs.includes(propsLang)
        ? propsLang
        : getDefaultLang(supportedLangs);
      setLangs(supportedLangs);
      changeLang(lang);

      const uris = voices.map(v => {
        return v.voiceURI;
      });
      if (uris.includes(voiceURI)) {
        changeVoice(voiceURI, lang);
      }
      if (isCordova()) {
        getTtsEngines();
        getTtsDefaultEngine();
      }
    }
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
