import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import tts from './tts';
import {
  getVoices,
  getTtsEngines,
  getTtsDefaultEngine,
  updateLangSpeechStatus,
  setTtsEngine
} from './SpeechProvider.actions';
import { setDownloadingLang } from '../LanguageProvider/LanguageProvider.actions';

import { isAndroid } from '../../cordova-util';

export class SpeechProvider extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    ttsEngine: PropTypes.object,
    setTtsEngine: PropTypes.func,
    downloadingLang: PropTypes.object,
    setDownloadingLang: PropTypes.func
  };

  async componentDidMount() {
    const {
      getVoices,
      updateLangSpeechStatus,
      getTtsEngines,
      getTtsDefaultEngine,
      ttsEngine,
      setTtsEngine,
      downloadingLang,
      setDownloadingLang
    } = this.props;

    let forceChangeVoice = false;
    if (tts.isSupported()) {
      //if android we have to set the tts engine first
      if (isAndroid()) {
        getTtsEngines();
        getTtsDefaultEngine();
      }
      if (ttsEngine && ttsEngine.name) {
        const ttsEnginesName =
          downloadingLang?.isdownloading &&
          downloadingLang.engineName !== ttsEngine.name
            ? downloadingLang.engineName
            : ttsEngine.name;
        try {
          await setTtsEngine(ttsEnginesName);
          forceChangeVoice = true;
        } catch (err) {
          console.error(err.message);
        }
      }
      try {
        const voices = await getVoices();
        await updateLangSpeechStatus(voices, forceChangeVoice);
      } catch (err) {
        console.error(err.message);
      }
      setDownloadingLang({ ...downloadingLang, isUpdated: true });
    }
  }

  render() {
    const { children } = this.props;

    return React.Children.only(children);
  }
}

const mapStateToProps = state => ({
  ttsEngine: state.speech.ttsEngine,
  //todo: downloadingVoices
  downloadingLang: state.language.downloadingLang
});

const mapDispatchToProps = {
  getVoices,
  getTtsEngines,
  getTtsDefaultEngine,
  setTtsEngine,
  updateLangSpeechStatus,
  //todo: setDownloadingVoices
  setDownloadingLang
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SpeechProvider);
