import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import tts from './tts';
import {
  getVoices,
  getTtsEngines,
  getTtsDefaultEngine,
  updateLangSpeechStatus,
  setTtsEngine,
  setCurrentVoiceSource
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
      ttsEngines,
      ttsEngine,
      ttsDefaultEngine,
      setTtsEngine,
      setCurrentVoiceSource,
      downloadingLang,
      setDownloadingLang
    } = this.props;

    const getTtsEngineName = () => {
      const ttsEnginesNames = ttsEngines?.map(tts => tts.name);
      if (!ttsEnginesNames) return null;
      if (
        downloadingLang?.isdownloading &&
        downloadingLang.engineName &&
        ttsEnginesNames.includes(downloadingLang.engineName)
      ) {
        forceChangeVoice = true;
        return downloadingLang.engineName;
      }

      if (
        ttsEngine &&
        ttsEngine.name &&
        ttsEnginesNames.includes(ttsEngine.name)
      )
        return ttsEngine.name;

      const defaultEngineName = ttsDefaultEngine?.name;
      if (ttsEnginesNames.includes(defaultEngineName)) return defaultEngineName;
      return null;
    };

    let forceChangeVoice = false;
    if (tts.isSupported()) {
      //if android we have to set the tts engine first
      try {
        if (isAndroid()) {
          getTtsEngines();
          getTtsDefaultEngine();
        }
      } catch (error) {
        console.error(error);
      }

      const ttsEngineName = getTtsEngineName();

      if (ttsEngineName) {
        try {
          await setTtsEngine(ttsEngineName);
        } catch (err) {
          console.error(err.message);
          forceChangeVoice = false;
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
    setCurrentVoiceSource();
  }

  render() {
    const { children } = this.props;

    return React.Children.only(children);
  }
}

const mapStateToProps = state => ({
  ttsEngines: state.speech.ttsEngines,
  ttsEngine: state.speech.ttsEngine,
  ttsDefaultEngine: state.speech.ttsDefaultEngine,
  //todo: downloadingVoices
  downloadingLang: state.language.downloadingLang
});

const mapDispatchToProps = {
  getVoices,
  getTtsEngines,
  getTtsDefaultEngine,
  setTtsEngine,
  updateLangSpeechStatus,
  setCurrentVoiceSource,
  //todo: setDownloadingVoices
  setDownloadingLang
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SpeechProvider);
