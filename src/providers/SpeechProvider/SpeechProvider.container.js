import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import tts from './tts';
import { getVoices } from './SpeechProvider.actions';
import {
  changeLang,
  setLangs
} from '../LanguageProvider/LanguageProvider.actions';
import { DEFAULT_LANG } from '../../components/App/App.constants';
import { getVoicesLangs } from '../../i18n';

export class SpeechProvider extends Component {
  static propTypes = {
    langs: PropTypes.array.isRequired,
    children: PropTypes.node.isRequired
  };

  async componentDidMount() {
    const { lang: propsLang, setLangs, changeLang } = this.props;
    if (tts.isSupported()) {
      const voices = await this.props.getVoices();
      let supportedLangs = [DEFAULT_LANG];
      if (voices.length) {
        const sLanguages = getVoicesLangs(voices);
        if (sLanguages !== undefined && sLanguages.length) {
          supportedLangs = sLanguages;
        }
      }
      // hack just for alfanum voice
      if (
        supportedLangs.length &&
        (supportedLangs.includes('sr-RS') || supportedLangs.includes('sr-ME'))
      ) {
        supportedLangs.push('me-ME');
      }
      const lang = supportedLangs.includes(propsLang)
        ? propsLang
        : this.getDefaultLang(supportedLangs);
      setLangs(supportedLangs);
      changeLang(lang);
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
