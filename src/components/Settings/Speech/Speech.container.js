import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';
import { injectIntl } from 'react-intl';

import {
  speak,
  changeVoice,
  changePitch,
  changeRate
} from '../../../providers/SpeechProvider/SpeechProvider.actions';
import Speech from './Speech.component';
import messages from './Speech.messages';

export class SpeechContainer extends Component {
  static propTypes = {
    /**
     * Active language
     */
    lang: PropTypes.string,
    speech: PropTypes.object,
    voices: PropTypes.array,
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
    const { intl, speak } = this.props;

    const text = intl.formatMessage(messages.sampleSentence);
    speak(text);
  }, 500);

  handleClickListItem = event => {
    this.setState({ voiceOpen: true, anchorEl: event.currentTarget });
  };

  handleMenuItemClick = ({ voiceURI, lang }, index) => {
    const { changeVoice } = this.props;

    changeVoice(voiceURI, lang);
    this.speakSample();
    this.setState({ voiceOpen: false, selectedVoiceIndex: index });
  };

  handleChangePitch = value => {
    const { changePitch } = this.props;

    changePitch(value);
    this.speakSample();
  };

  handleChangeRate = value => {
    const { changeRate } = this.props;

    changeRate(value);
    this.speakSample();
  };

  handleVoiceRequestClose = () => {
    this.setState({ voiceOpen: false });
  };

  render() {
    const {
      history,
      intl,
      lang,
      speech: { voices, options: { voiceURI, pitch, rate } }
    } = this.props;

    const langVoices = voices.filter(
      voice => voice.lang.slice(0, 2) === lang.slice(0, 2)
    );

    return (
      <Speech
        {...this.state}
        handleChangePitch={this.handleChangePitch}
        handleChangeRate={this.handleChangeRate}
        handleClickListItem={this.handleClickListItem}
        handleMenuItemClick={this.handleMenuItemClick}
        handleVoiceRequestClose={this.handleVoiceRequestClose}
        intl={intl}
        langVoices={langVoices}
        onRequestClose={history.goBack}
        pitch={pitch}
        rate={rate}
        voiceURI={voiceURI}
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
  changeVoice,
  changePitch,
  changeRate,
  speak
};

const EnhancedSpeech = injectIntl(Speech);

export default connect(mapStateToProps, mapDispatchToProps)(EnhancedSpeech);
