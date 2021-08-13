import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { changeLang } from '../../../providers/LanguageProvider/LanguageProvider.actions';
import {
  getVoices,
  setTtsEngine,
  updateLangSpeechStatus
} from '../../../providers/SpeechProvider/SpeechProvider.actions';
import Language from './Language.component';
import messages from './Language.messages';
import API from '../../../api';

const sortLangs = (activeLang, langs = [], localLangs = []) => {
  const cloudLangs = langs.filter(lang => !localLangs.includes(lang));
  let sortedLangs = localLangs.concat(cloudLangs);
  const activeLangIndex = sortedLangs.indexOf(activeLang);
  if (activeLangIndex > 0) {
    sortedLangs.splice(activeLangIndex, 1);
    sortedLangs.unshift(activeLang);
  }
  return sortedLangs;
};

export class LanguageContainer extends Component {
  static propTypes = {
    /**
     * Active language
     */
    lang: PropTypes.string.isRequired,
    /**
     * Language list
     */
    langs: PropTypes.arrayOf(PropTypes.string).isRequired,
    /**
     * Local available languages list
     */
    localLangs: PropTypes.arrayOf(PropTypes.string),
    /**
     * TTS engines list
     */
    ttsEngines: PropTypes.arrayOf(PropTypes.object),
    /**
     * TTS default engine
     */
    ttsDefaultEngine: PropTypes.object,
    /**
     * Callback fired when language changes
     */
    onLangChange: PropTypes.func,
    /**
     * Callback fired when tts engine changes
     */
    setTtsEngine: PropTypes.func.isRequired,
    /**
     * Callback fired when clicking the back button
     */
    onClose: PropTypes.func,
    history: PropTypes.object.isRequired,
    getVoices: PropTypes.func.isRequired,
    updateLangSpeechStatus: PropTypes.func.isRequired
  };

  state = { selectedLang: this.props.lang };

  handleSubmit = async () => {
    const { onLangChange } = this.props;

    try {
      await API.updateSettings({ language: { lang: this.state.selectedLang } });
    } catch (err) {
      console.log(err.message);
    }
    onLangChange(this.state.selectedLang);
  };

  handleLangClick = lang => {
    this.setState({ selectedLang: lang });
  };

  handleSetTtsEngine = async engineName => {
    const { setTtsEngine, getVoices, updateLangSpeechStatus } = this.props;
    try {
      await setTtsEngine(engineName);
      const voices = await getVoices();
      await updateLangSpeechStatus(voices);
    } catch (err) {
      throw new Error('TTS engine selection error on handleSetTtsEngine');
    }
  };

  render() {
    const {
      history,
      lang,
      langs,
      localLangs,
      ttsEngines,
      ttsEngine
    } = this.props;
    const sortedLangs = sortLangs(lang, langs, localLangs);

    return (
      <Language
        title={<FormattedMessage {...messages.language} />}
        selectedLang={this.state.selectedLang}
        langs={sortedLangs}
        localLangs={localLangs}
        ttsEngines={ttsEngines ? ttsEngines : []}
        ttsEngine={ttsEngine}
        onLangClick={this.handleLangClick}
        onClose={history.goBack}
        onSubmitLang={this.handleSubmit}
        onSetTtsEngine={this.handleSetTtsEngine}
      />
    );
  }
}

const mapStateToProps = state => ({
  lang: state.language.lang,
  langs: state.language.langs,
  localLangs: state.language.localLangs,
  ttsEngines: state.speech.ttsEngines,
  ttsEngine: state.speech.ttsEngine
});

const mapDispatchToProps = {
  onLangChange: changeLang,
  setTtsEngine,
  getVoices,
  updateLangSpeechStatus
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LanguageContainer);
