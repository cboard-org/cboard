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
import { isAndroid } from '../../cordova-util';

export class SpeechProvider extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    ttsEngine: PropTypes.object,
    setTtsEngine: PropTypes.func
  };

  async componentDidMount() {
    const {
      getVoices,
      updateLangSpeechStatus,
      getTtsEngines,
      getTtsDefaultEngine,
      ttsEngine,
      setTtsEngine,
      setCurrentVoiceSource
    } = this.props;

    if (tts.isSupported()) {
      //if android we have to set the tts engine first
      if (isAndroid()) {
        getTtsEngines();
        getTtsDefaultEngine();
      }
      if (ttsEngine && ttsEngine.name) {
        try {
          await setTtsEngine(ttsEngine.name);
        } catch (err) {
          console.error(err.message);
        }
      }
      try {
        const voices = await getVoices();
        await updateLangSpeechStatus(voices);
      } catch (err) {
        console.error(err.message);
      }
    }
    setCurrentVoiceSource();
  }

  render() {
    const { children } = this.props;

    return React.Children.only(children);
  }
}

const mapStateToProps = state => ({
  ttsEngine: state.speech.ttsEngine
});

const mapDispatchToProps = {
  getVoices,
  getTtsEngines,
  getTtsDefaultEngine,
  setTtsEngine,
  updateLangSpeechStatus,
  setCurrentVoiceSource
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SpeechProvider);
