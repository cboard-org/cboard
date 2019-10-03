import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import tts from './tts';
import { getVoices } from './SpeechProvider.actions';
import {
  changeLang,
  setLangs
} from '../LanguageProvider/LanguageProvider.actions';
import { APP_LANGS, DEFAULT_LANG } from '../../components/App/App.constants';

export class SpeechProvider extends Component {
  static propTypes = {
    voices: PropTypes.array.isRequired,
    langs: PropTypes.array.isRequired,
    children: PropTypes.node.isRequired
  };

  componentWillMount() {
    const { lang: propsLang, langs, setLangs, changeLang } = this.props;
    if (tts.isSupported()) {
      this.props.getVoices().then(voices => {
        let supportedLangs = ['en-US'];
        if (voices.length) {
          supportedLangs = this.getVoicesLangs(voices);
        }
        const lang = propsLang || this.getDefaultLang(langs);
        setLangs(supportedLangs);
        changeLang(lang);
      });
    }
  }

  getVoicesLangs(voices) {
    let langs = [...new Set(voices.map(voice => voice.lang))].sort();
    return langs.filter(lang => APP_LANGS.includes(lang));
  }

  getDefaultLang(langs) {
    return langs.includes(window.navigator.language)
      ? window.navigator.language
      : DEFAULT_LANG;
  }

  render() {
    const { voices, children } = this.props;

    return !!voices.length ? React.Children.only(children) : null;
  }
}

const mapStateToProps = state => ({
  voices: state.speech.voices,
  langs: state.speech.langs,
  lang: state.language.lang
});

const mapDispatchToProps = {
  getVoices,
  changeLang,
  setLangs
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SpeechProvider);
