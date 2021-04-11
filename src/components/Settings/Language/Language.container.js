import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { changeLang } from '../../../providers/LanguageProvider/LanguageProvider.actions';
import { setTtsEngine } from '../../../providers/SpeechProvider/SpeechProvider.actions';
import Language from './Language.component';
import messages from './Language.messages';
import API from '../../../api';

const sortLangs = (lang, [...langs] = []) => {
  const langIndex = langs.indexOf(lang);
  if (langIndex >= 0) {
    const temp = langs[0];
    langs[0] = langs[langIndex];
    langs[langIndex] = temp;
  }
  return langs;
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
    history: PropTypes.object.isRequired
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

  render() {
    const {
      history,
      lang,
      langs,
      ttsEngines,
      ttsEngine,
      setTtsEngine
    } = this.props;
    const sortedLangs = sortLangs(lang, langs);

    return (
      <Language
        title={<FormattedMessage {...messages.language} />}
        selectedLang={this.state.selectedLang}
        langs={sortedLangs}
        ttsEngines={ttsEngines ? ttsEngines : []}
        ttsEngine={ttsEngine}
        onLangClick={this.handleLangClick}
        onClose={history.goBack}
        onSubmitLang={this.handleSubmit}
        setTtsEngine={setTtsEngine}
      />
    );
  }
}

const mapStateToProps = state => ({
  lang: state.language.lang,
  langs: state.language.langs,
  ttsEngines: state.speech.ttsEngines,
  ttsEngine: state.speech.ttsEngine
});

const mapDispatchToProps = {
  onLangChange: changeLang,
  setTtsEngine
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LanguageContainer);
