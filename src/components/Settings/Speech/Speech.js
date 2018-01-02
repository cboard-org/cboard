import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';
import { injectIntl } from 'react-intl';

import {
  speak,
  changeVoice,
  changePitch,
  changeRate
} from '../../SpeechProvider/SpeechProvider.actions';
import SpeechContainer from './Speech.container';
import messages from './Speech.messages';

export class Speech extends PureComponent {
  static propTypes = {
    /**
     * If true, Speech will be visible
     */
    open: PropTypes.bool,
    /**
     * Active language
     */
    lang: PropTypes.string,
    speech: PropTypes.object,
    voices: PropTypes.array,
    onRequestClose: PropTypes.func,
    changeVoice: PropTypes.func,
    changePitch: PropTypes.func,
    changeRate: PropTypes.func
  };

  state = {
    selectedVoiceIndex: 0,
    voiceOpen: false,
    anchorEl: null
  };

  speakSample = debounce(
    () => {
      const { intl, speak } = this.props;
      const text = intl.formatMessage(messages.sampleSentence);
      speak(text);
    },
    500,
    {}
  );

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
      intl,
      open,
      lang,
      onRequestClose,
      speech: { voices, options: { voiceURI, pitch, rate } }
    } = this.props;

    const langVoices = voices.filter(
      voice => voice.lang.slice(0, 2) === lang.slice(0, 2)
    );

    return (
      <SpeechContainer
        {...this.state}
        handleChangePitch={this.handleChangePitch}
        handleChangeRate={this.handleChangeRate}
        handleClickListItem={this.handleClickListItem}
        handleMenuItemClick={this.handleMenuItemClick}
        handleVoiceRequestClose={this.handleVoiceRequestClose}
        intl={intl}
        langVoices={langVoices}
        onRequestClose={onRequestClose}
        open={open}
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

const mapDispatchToProps = dispatch => ({
  changeVoice: (voiceURI, lang) => {
    dispatch(changeVoice(voiceURI, lang));
  },
  changePitch: pitch => {
    dispatch(changePitch(pitch));
  },
  changeRate: rate => {
    dispatch(changeRate(rate));
  },
  speak: text => {
    dispatch(speak(text));
  }
});

const EnhancedSpeech = injectIntl(Speech);

export default connect(mapStateToProps, mapDispatchToProps)(EnhancedSpeech);
