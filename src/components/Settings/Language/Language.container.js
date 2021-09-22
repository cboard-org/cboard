import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import {
  changeLang,
  setDownloadingLang
} from '../../../providers/LanguageProvider/LanguageProvider.actions';
import {
  getVoices,
  setTtsEngine,
  updateLangSpeechStatus,
  getTtsEngines
} from '../../../providers/SpeechProvider/SpeechProvider.actions';
import Language from './Language.component';
import messages from './Language.messages';
import API from '../../../api';

import DownloadDialog from './DownloadDialog';

import { isAndroid, onAndroidPause } from '../../../cordova-util';
import ISO6391 from 'iso-639-1';

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

  state = {
    selectedLang: this.props.lang,
    openDialog: { open: false, downloadingLangData: {} },
    downloadingLangError: { ttsError: false, langError: false }
  };

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

  downloadableLangClick = (event, downloadingLangData) => {
    this.setState({ openDialog: { open: true, downloadingLangData } });
    event.stopPropagation();
  };
  onUninstaledLangClick = () => {
    alert('install language to can use it'); //show notification
  };

  onDialogAcepted = downloadingLangData => {
    const { marketId, lang, ttsName } = downloadingLangData;
    this.setState({ openDialog: { open: false, downloadingLangData: {} } });
    onAndroidPause(() => this.pauseCallback());
    const downloadingLangState = {
      isdownloading: true,
      engineName: ttsName,
      marketId: marketId,
      selectedLang: lang
    };
    this.props.setDownloadingLang(downloadingLangState);
    console.log('downloadingLangState', downloadingLangState);
    window.cordova.plugins.market.open(marketId);
  };

  pauseCallback = () => {
    navigator.app.exitApp();
  };

  onCloseDialog = () => {
    this.setState({ openDialog: { open: false, downloadingLangData: {} } });
  };

  prepareDownloadablesLenguages = () => {
    const uninstalledTts = this.filterUninstalledTts();
    console.log('uninstalledTts', uninstalledTts);
    const downloadablesLangsList = this.getDownloadablesLenguages(
      uninstalledTts
    );
    const avaliableAndDownloadablesLangs = this.filterAvailablesAndDownloadablesLangs(
      downloadablesLangsList
    );
    const downloadablesOnly = this.filterDownloadablesOnlyLangs(
      downloadablesLangsList,
      avaliableAndDownloadablesLangs
    );
    return {
      avaliableAndDownloadablesLangs,
      downloadablesOnly
    };
  };

  filterUninstalledTts = () => {
    const { ttsEngines } = this.props;
    const ttsEnginesName = ttsEngines.map(tts => tts.name);
    return downloadablesTts.filter(
      downloadableTts => !ttsEnginesName.includes(downloadableTts.name)
    );
  };

  getDownloadablesLenguages = uninstalledTts => {
    const downloadablesLangsArray = uninstalledTts.map(tts => {
      return { langs: tts.langs, marketId: tts.marketId, ttsName: tts.name };
    });
    const identifiedLangsArray = downloadablesLangsArray.map(langObject =>
      langObject.langs.map(language => {
        return {
          lang: language,
          marketId: langObject.marketId,
          ttsName: langObject.ttsName
        };
      })
    );
    const INITIAL_VALUE = [];
    const downloadablesLangs = identifiedLangsArray.reduce(
      (accumulator, currentValue) => accumulator.concat(currentValue),
      INITIAL_VALUE
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
      //const code = ISO6391.getCode(langObject.lang);
      const { lang } = langObject;
      const code = lang.slice(0, 2).toLowerCase();
      langObject.langCode = code;
      langObject.nativeName = ISO6391.getNativeName(code);
      const showLangCode =
        downloadablesLangs.filter(language => language.langCode === code)
          .length > 1;

      const langFullCode = showLangCode ? `(${lang})` : '';
      langObject.nativeName = `${langObject.nativeName} ${langFullCode}`;
      return langObject;
    });
  };

  handleCheckitClick = () => {
    onAndroidPause(() => this.pauseCallback());
    window.cordova.plugins.market.open(this.props.downloadingLang.marketId);
  };

  componentDidMount = async () => {
    const {
      isdownloading,
      engineName,
      selectedLang
    } = this.props.downloadingLang;

    const { localLangs, ttsEngines, setDownloadingLang, history } = this.props;

    console.log('localLangs', localLangs);
    console.log('selectedLang', selectedLang);
    if (isdownloading) {
      if (!ttsEngines.includes(engineName)) {
        this.setState({
          downloadingLangError: {
            ...this.state.downloadingLangError,
            ttsError: true
          }
        });
        return;
      }
      if (localLangs.includes(selectedLang)) {
        const downloadingLangState = {
          isdownloading: false
        };
        setDownloadingLang(downloadingLangState);
        this.setState({ selectedLang: selectedLang });
        await this.handleSubmit();
        history.push('/settings');
      }
    }
    // if (this.props.ttsEngines.includes(engineName)) {
    //   this.handleSetTtsEngine(engineName);
    // }
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
    const { open, downloadingLangData } = this.state.openDialog;
    const sortedLangs = sortLangs(lang, langs, localLangs);
    console.log('ttsEngines lang component', ttsEngines);
    return (
      <>
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
            isAndroid()
              ? this.prepareDownloadablesLenguages()
              : {
                  //downloadablesLangsList: []
                  //avaliableAndDownloadablesLangs: [],
                  downloadablesOnly: []
                }
          }
          onDownloadableLangClick={this.downloadableLangClick}
          onUninstaledLangClick={this.onUninstaledLangClick}
        />
        <DownloadDialog
          onClose={this.onCloseDialog}
          onDialogAcepted={this.onDialogAcepted}
          downloadingLangData={downloadingLangData}
          open={open}
        />
      </>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.language.lang,
  langs: state.language.langs,
  localLangs: state.language.localLangs,
  ttsEngines: state.speech.ttsEngines,
  ttsEngine: state.speech.ttsEngine,
  downloadingLang: state.language.downloadingLang
});

const mapDispatchToProps = {
  onLangChange: changeLang,
  setTtsEngine,
  getVoices,
  updateLangSpeechStatus,
  setDownloadingLang,
  getTtsEngines
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LanguageContainer);
