import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import { injectIntl } from 'react-intl';

import {
  speak,
  cancelSpeech,
  changeVoice,
  changePitch,
  changeRate,
  changeElevenLabsStability,
  changeElevenLabsSimilarity,
  changeElevenLabsStyle,
  resetElevenLabsSettings,
  changeElevenLabsApiKey,
  getVoices
} from '../../../providers/SpeechProvider/SpeechProvider.actions';
import Speech from './Speech.component';
import messages from './Speech.messages';
import API from '../../../api';
import { DEFAULT_LANG } from '../../App/App.constants';
import { EMPTY_VOICES } from '../../../providers/SpeechProvider/SpeechProvider.constants';
import { validateApiKeyFormat } from '../../../providers/SpeechProvider/engine/elevenlabs';
import tts from '../../../providers/SpeechProvider/tts';

export class SpeechContainer extends Component {
  static propTypes = {
    /**
     * Active language
     */
    lang: PropTypes.string,
    /**
     * Current full speech state
     */
    speech: PropTypes.object,
    /**
     * Current full voices state
     */
    voices: PropTypes.array,
    cancelSpeech: PropTypes.func.isRequired,
    changeVoice: PropTypes.func.isRequired,
    changePitch: PropTypes.func.isRequired,
    changeRate: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  };

  state = {
    selectedVoiceIndex: 0,
    isVoiceOpen: false,
    anchorEl: undefined,
    elevenLabsApiKeyInput: '',
    elevenLabsConnected: false,
    elevenLabsValidating: false,
    elevenLabsConnectionError: null
  };

  componentDidMount() {
    const { elevenLabsApiKey } = this.props;
    if (elevenLabsApiKey) {
      this.setState({ elevenLabsApiKeyInput: elevenLabsApiKey });
    }
  }

  componentDidUpdate(prevProps) {
    const { elevenLabsApiKey } = this.props;
    if (
      elevenLabsApiKey !== prevProps.elevenLabsApiKey &&
      elevenLabsApiKey !== this.state.elevenLabsApiKeyInput
    ) {
      this.setState({ elevenLabsApiKeyInput: elevenLabsApiKey || '' });
    }
  }

  validateElevenLabsApiKey = debounce(async apiKey => {
    const { changeElevenLabsApiKey, getVoices } = this.props;

    if (!apiKey) {
      tts.initElevenLabsInstance(null);
      this.setState({
        elevenLabsConnected: false,
        elevenLabsValidating: false,
        elevenLabsConnectionError: null
      });
      changeElevenLabsApiKey(null);
      await this.updateSettings('elevenLabsApiKey', null);
      getVoices();
      return;
    }

    if (!validateApiKeyFormat(apiKey)) {
      this.setState({
        elevenLabsConnected: false,
        elevenLabsValidating: false,
        elevenLabsConnectionError: 'INVALID_FORMAT'
      });
      return;
    }

    this.setState({
      elevenLabsValidating: true,
      elevenLabsConnectionError: null
    });

    tts.initElevenLabsInstance(apiKey);
    const result = await tts.testElevenLabsConnection();

    if (result.isValid) {
      this.setState({
        elevenLabsConnected: true,
        elevenLabsValidating: false,
        elevenLabsConnectionError: null
      });
      changeElevenLabsApiKey(apiKey);
      await this.updateSettings('elevenLabsApiKey', apiKey);
      getVoices();
    } else {
      this.setState({
        elevenLabsConnected: false,
        elevenLabsValidating: false,
        elevenLabsConnectionError: result.error
      });
    }
  }, 500);

  handleUpdateElevenLabsApiKey = apiKey => {
    this.setState({ elevenLabsApiKeyInput: apiKey || '' });
    this.validateElevenLabsApiKey(apiKey);
  };

  speakSample = debounce(() => {
    const { cancelSpeech, intl, speak } = this.props;
    const text = intl.formatMessage(messages.sampleSentence);
    cancelSpeech();
    speak(text);
  }, 500);

  handleClickListItem = event => {
    this.setState({ isVoiceOpen: true, anchorEl: event.currentTarget });
  };

  handleMenuItemClick = async ({ voiceURI, lang }, index) => {
    const { changeVoice } = this.props;
    changeVoice(voiceURI, lang);
    this.speakSample();
    await this.updateSettings('voiceURI', voiceURI);
    this.setState({ isVoiceOpen: false, selectedVoiceIndex: index });
  };

  updateSettings(property, value) {
    if (this.updateSettingsTimeout) {
      clearTimeout(this.updateSettingsTimeout);
    }

    this.updateSettingsTimeout = setTimeout(async () => {
      const {
        speech: {
          options: { voiceURI, pitch, rate }
        },
        elevenLabsApiKey
      } = this.props;

      const speech = {
        voiceURI,
        pitch,
        rate,
        elevenLabsApiKey,
        [property]: value
      };

      try {
        await API.updateSettings({ speech });
      } catch (e) {}
    }, 500);
  }

  handleChangePitch = async (event, value) => {
    const { changePitch } = this.props;
    await this.updateSettings('pitch', value);
    changePitch(value);
    this.speakSample();
  };

  handleChangeRate = async (event, value) => {
    const { changeRate } = this.props;
    await this.updateSettings('rate', value);
    changeRate(value);
    this.speakSample();
  };

  handleChangeElevenLabsStability = async (event, value) => {
    const { changeElevenLabsStability } = this.props;
    const {
      speech: {
        options: { voiceURI }
      }
    } = this.props;
    const voice = this.props.speech.voices.find(v => v.voiceURI === voiceURI);

    if (voice?.voiceSource === 'elevenlabs') {
      changeElevenLabsStability(voice.voice_id, value);
      this.speakSample();
    }
  };

  handleChangeElevenLabsSimilarity = async (event, value) => {
    const { changeElevenLabsSimilarity } = this.props;
    const {
      speech: {
        options: { voiceURI }
      }
    } = this.props;
    const voice = this.props.speech.voices.find(v => v.voiceURI === voiceURI);

    if (voice?.voiceSource === 'elevenlabs') {
      changeElevenLabsSimilarity(voice.voice_id, value);
      this.speakSample();
    }
  };

  handleChangeElevenLabsStyle = async (event, value) => {
    const { changeElevenLabsStyle } = this.props;
    const {
      speech: {
        options: { voiceURI }
      }
    } = this.props;
    const voice = this.props.speech.voices.find(v => v.voiceURI === voiceURI);

    if (voice?.voiceSource === 'elevenlabs') {
      changeElevenLabsStyle(voice.voice_id, value);
      this.speakSample();
    }
  };

  handleResetElevenLabsSettings = async () => {
    const { resetElevenLabsSettings } = this.props;
    const {
      speech: {
        options: { voiceURI }
      }
    } = this.props;
    const voice = this.props.speech.voices.find(v => v.voiceURI === voiceURI);

    if (voice?.voiceSource === 'elevenlabs') {
      resetElevenLabsSettings(voice.voice_id);
      this.speakSample();
    }
  };

  handleVoiceClose = () => {
    this.setState({ isVoiceOpen: false });
  };

  handleElevenLabsApiKeyChange = async event => {
    const apiKey = event.target.value;
    this.setState({
      elevenLabsApiKey: apiKey,
      elevenLabsValidationError: '',
      elevenLabsConnected: false
    });

    if (apiKey) {
      API.saveElevenLabsApiKey(apiKey);
      await this.validateApiKey(apiKey, true);
    } else {
      API.saveElevenLabsApiKey('');
    }
  };

  validateApiKey = async (apiKey, showMessages = true) => {
    const { intl } = this.props;

    this.setState({ elevenLabsValidating: true });

    try {
      const result = await API.validateElevenLabsApiKey(apiKey);

      let errorMessage = '';
      if (!result.isValid && showMessages) {
        switch (result.error) {
          case 'INVALID_FORMAT':
            errorMessage = intl.formatMessage(messages.elevenLabsApiKeyInvalid);
            break;
          case 'UNAUTHORIZED':
            errorMessage = intl.formatMessage(
              messages.elevenLabsApiKeyUnauthorized
            );
            break;
          default:
            errorMessage = intl.formatMessage(messages.elevenLabsTestError);
            break;
        }
      }

      this.setState({
        elevenLabsConnected: result.isValid,
        elevenLabsValidationError: errorMessage,
        elevenLabsValidating: false
      });

      return result.isValid;
    } catch (error) {
      this.setState({
        elevenLabsConnected: false,
        elevenLabsValidationError: showMessages
          ? intl.formatMessage(messages.elevenLabsTestError)
          : '',
        elevenLabsValidating: false
      });

      return false;
    }
  };

  testElevenLabsConnection = async () => {
    const { elevenLabsApiKey } = this.state;
    if (!elevenLabsApiKey) {
      return;
    }
    await this.validateApiKey(elevenLabsApiKey, true);
  };

  getElevenLabsSettings(voice) {
    if (!voice || voice?.voiceSource !== 'elevenlabs') {
      return { stability: 0.5, similarity: 0.75, style: 0.0 };
    }

    const settings = voice.settings || {};
    return {
      stability: settings.stability ?? 0.5,
      similarity: settings.similarity_boost ?? 0.75,
      style: settings.style ?? 0.0
    };
  }

  render() {
    const {
      history,
      intl,
      lang,
      speech: {
        voices,
        options: { voiceURI, pitch, rate }
      }
    } = this.props;

    const langVoices = voices.filter(
      voice => voice.lang.slice(0, 2) === lang.slice(0, 2)
    );
    // typically, voice should be found
    let voice = voices.find(v => voiceURI === v.voiceURI);
    // handle exceptional cases
    if (!voice && voices && voices.length) {
      // rare case
      voice = voices[0];
    } else if (!voice && !voices) {
      // should never happen
      voice = {
        lang: DEFAULT_LANG,
        voiceURI: EMPTY_VOICES,
        voiceSource: 'local',
        name: EMPTY_VOICES
      };
    }

    const elevenLabsSettings = this.getElevenLabsSettings(voice);

    return (
      <Speech
        {...this.state}
        handleChangePitch={this.handleChangePitch}
        handleChangeRate={this.handleChangeRate}
        handleChangeElevenLabsStability={this.handleChangeElevenLabsStability}
        handleChangeElevenLabsSimilarity={this.handleChangeElevenLabsSimilarity}
        handleChangeElevenLabsStyle={this.handleChangeElevenLabsStyle}
        handleResetElevenLabsSettings={this.handleResetElevenLabsSettings}
        handleClickListItem={this.handleClickListItem}
        onMenuItemClick={this.handleMenuItemClick}
        handleVoiceClose={this.handleVoiceClose}
        intl={intl}
        langVoices={langVoices}
        onClose={history.goBack}
        pitch={pitch}
        rate={rate}
        voice={voice}
        elevenLabsSettings={elevenLabsSettings}
        handleElevenLabsApiKeyChange={this.handleElevenLabsApiKeyChange}
        testElevenLabsConnection={this.testElevenLabsConnection}
        elevenLabsValidationError={this.state.elevenLabsValidationError}
        elevenLabsValidating={this.state.elevenLabsValidating}
        elevenLabsApiKey={this.state.elevenLabsApiKeyInput}
        handleUpdateElevenLabsApiKey={this.handleUpdateElevenLabsApiKey}
      />
    );
  }
}

const mapStateToProps = state => ({
  lang: state.language.lang,
  voices: state.speech.voices,
  speech: state.speech,
  isConnected: state.app.isConnected,
  elevenLabsApiKey: state.speech.elevenLabsApiKey
});

const mapDispatchToProps = {
  cancelSpeech,
  changeVoice,
  changePitch,
  changeRate,
  changeElevenLabsStability,
  changeElevenLabsSimilarity,
  changeElevenLabsStyle,
  resetElevenLabsSettings,
  changeElevenLabsApiKey,
  speak,
  getVoices
};

const EnhancedSpeechContainer = injectIntl(SpeechContainer);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EnhancedSpeechContainer);
