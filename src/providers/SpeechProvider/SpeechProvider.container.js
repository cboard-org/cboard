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
import { isAndroid } from '../../cordova-util';

export class SpeechProvider extends Component {
  static propTypes = {
    langs: PropTypes.array.isRequired,
    children: PropTypes.node.isRequired,
    ttsEngine: PropTypes.object,
    setTtsEngine: PropTypes.func
  };

  state = { voicesRecived: false };

  async componentDidMount() {
    const prepareVoicesWithTimeout = async () => {
      const timeLimitOnMs = 5000;
      const prepareVoices = async () => {
        const {
          getVoices,
          updateLangSpeechStatus,
          getTtsEngines,
          getTtsDefaultEngine,
          ttsEngine,
          setTtsEngine
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
      };

      let timeoutHandle;
      const timeoutPromise = new Promise((_resolve, reject) => {
        timeoutHandle = setTimeout(
          () => reject(new Error('Prepare Voice timeout limit reached')),
          timeLimitOnMs
        );
      });

      return Promise.race([prepareVoices(), timeoutPromise])
        .then(() => {
          clearTimeout(timeoutHandle);
          return;
        })
        .catch(err => {
          console.error(err.message);
        });
    };

    await prepareVoicesWithTimeout();
    this.setState({ voicesRecived: true });
  }

  render() {
    if (!this.state.voicesRecived) return null;
    const { children } = this.props;

    return React.Children.only(children);
  }
}

const mapStateToProps = state => ({
  langs: state.speech.langs,
  lang: state.language.lang,
  voiceURI: state.speech.options.voiceURI,
  ttsEngine: state.speech.ttsEngine
});

const mapDispatchToProps = {
  getVoices,
  getTtsEngines,
  getTtsDefaultEngine,
  setTtsEngine,
  updateLangSpeechStatus
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SpeechProvider);
