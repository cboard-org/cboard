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
  changeRate
} from '../../../providers/SpeechProvider/SpeechProvider.actions';
import { DEFAULT_VOICE_SOURCE } from '../../../providers/SpeechProvider/SpeechProvider.constants';
import Speech from './Speech.component';
import messages from './Speech.messages';
import API from '../../../api';

export class SpeechContainer extends Component {
  static propTypes = {
    /**
     * Active language
     */
    lang: PropTypes.string,
    speech: PropTypes.object,
    voices: PropTypes.array,
    cancelSpeech: PropTypes.func,
    changeVoice: PropTypes.func,
    changePitch: PropTypes.func,
    changeRate: PropTypes.func,
    history: PropTypes.object.isRequired
  };

  state = {
    selectedVoiceIndex: 0,
    voiceOpen: false,
    anchorEl: null
  };

  speakSample = debounce(() => {
    const { cancelSpeech, intl, speak } = this.props;
    const text = intl.formatMessage(messages.sampleSentence);
    cancelSpeech();
    speak(text);
  }, 500);

  handleClickListItem = event => {
    this.setState({ voiceOpen: true, anchorEl: event.currentTarget });
  };

  handleMenuItemClick = async (
    { voiceURI, lang, voiceSource = DEFAULT_VOICE_SOURCE },
    index
  ) => {
    const { changeVoice } = this.props;
    changeVoice(voiceURI, lang, voiceSource);
    this.speakSample();
    await this.updateSettings('voiceURI', voiceURI);
    await this.updateSettings('voiceSource', voiceSource);
    this.setState({ voiceOpen: false, selectedVoiceIndex: index });
  };

  updateSettings(property, value) {
    if (this.updateSettingsTimeout) {
      clearTimeout(this.updateSettingsTimeout);
    }

    this.updateSettingsTimeout = setTimeout(async () => {
      const {
        speech: {
          options: { voiceURI, pitch, rate, voiceSource }
        }
      } = this.props;

      const speech = {
        voiceURI,
        pitch,
        rate,
        voiceSource,
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

  handleVoiceClose = () => {
    this.setState({ voiceOpen: false });
  };

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
    const voiceArray = voices.filter(v => voiceURI === v.voiceURI);
    const voice = voiceArray[0];

    return (
      <Speech
        {...this.state}
        handleChangePitch={this.handleChangePitch}
        handleChangeRate={this.handleChangeRate}
        handleClickListItem={this.handleClickListItem}
        onMenuItemClick={this.handleMenuItemClick}
        handleVoiceClose={this.handleVoiceClose}
        intl={intl}
        langVoices={langVoices}
        onClose={history.goBack}
        pitch={pitch}
        rate={rate}
        voice={voice}
      />
    );
  }
}

const mapStateToProps = state => ({
  lang: state.language.lang,
  voices: state.speech.voices,
  speech: state.speech
});

const mapDispatchToProps = {
  cancelSpeech,
  changeVoice,
  changePitch,
  changeRate,
  speak
};

const EnhancedSpeechContainer = injectIntl(SpeechContainer);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EnhancedSpeechContainer);
