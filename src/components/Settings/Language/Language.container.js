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

import { isAndroid } from '../../../cordova-util';
import ISO6391 from 'iso-639-1';
//import { normalizeLanguageCode, standardizeLanguageCode } from '../../../i18n';
const downloadablesTts = require('./downloadablesTts.json');

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

  downloadableLangClick = (event, engineId) => {
    alert(engineId);
    event.stopPropagation();
  };
  onUninstaledLangClick = () => {
    alert('install language to can use it');
  };

  prepareDownloadablesLenguages = () => {
    const downloadablesLangs = this.getDownloadablesLenguages();
    const avaliableAndDownloadablesLangs = this.filterAvailablesAndDownloadablesLangs(
      downloadablesLangs
    );
    const downloadablesOnly = this.filterDownloadablesOnlyLangs(
      downloadablesLangs,
      avaliableAndDownloadablesLangs
    );
    return {
      avaliableAndDownloadablesLangs,
      downloadablesOnly
    };
  };

  getDownloadablesLenguages = () => {
    //filter here if tts is already installed
    const downloadablesLangsArray = downloadablesTts.map((tts, index) => {
      return { langs: tts.languagesSupported, id: index };
    });
    const identifiedLangsArray = downloadablesLangsArray.map(langObject =>
      langObject.langs.map(language => {
        return { lang: language, id: langObject.id };
      })
    );
    const downloadablesLangs = identifiedLangsArray.reduce(
      (accumulator, currentValue) => accumulator.concat(currentValue)
    );
    return this.formatLangObject(downloadablesLangs);
  };

  filterAvailablesAndDownloadablesLangs = downloadablesLangs => {
    const { langs } = this.props;
    const slicedLangs = langs.map(lang => lang.slice(0, 2));
    return downloadablesLangs.filter(({ langCode }) =>
      slicedLangs.includes(langCode)
    );
  };

  filterDownloadablesOnlyLangs = (downloadables, availableAndDownloadables) => {
    return downloadables.filter(
      downloadableLang => !availableAndDownloadables.includes(downloadableLang)
    );
  };

  formatLangObject = downloadablesLangs => {
    return downloadablesLangs.map(langObject => {
      const code = ISO6391.getCode(langObject.lang);
      if (code) {
        langObject.langCode = code.toLowerCase();
        langObject.nativeName = ISO6391.getNativeName(langObject.langCode);
        const locale = code;
        const showLangCode =
          downloadablesLangs.filter(
            language => language.langCode?.slice(0, 2).toLowerCase() === locale
          ).length > 1;

        const langCode = showLangCode ? `(${langObject.lang})` : '';
        langObject.nativeName = `${langObject.nativeName} ${langCode}`;
      }
      return langObject;
    });
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
        downloadablesLangs={
          !isAndroid()
            ? this.prepareDownloadablesLenguages()
            : { avaliableAndDownloadablesLangs: [], downloadablesOnly: [] }
        }
        onDownloadableLangClick={this.downloadableLangClick}
        onUninstaledLangClick={this.onUninstaledLangClick}
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
