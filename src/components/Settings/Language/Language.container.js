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
import DownloadingLangErrorDialog from './downloadingLangErrorDialog';

import { isAndroid, onAndroidPause } from '../../../cordova-util';
import ISO6391 from 'iso-639-1';
import { showNotification } from '../../Notifications/Notifications.actions';

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

  handleSubmit = async (optionalLang = null) => {
    const { onLangChange } = this.props;
    const selectedLang = optionalLang ? optionalLang : this.state.selectedLang;
    try {
      await API.updateSettings({ language: { lang: selectedLang } });
    } catch (err) {
      console.log(err.message);
    }
    onLangChange(selectedLang);
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
    this.props.showNotification(
      <FormattedMessage {...messages.unninstaledLangNotification} />
    );
  };

  onDialogAcepted = downloadingLangData => {
    const { marketId, lang, ttsName } = downloadingLangData;
    this.setState({ openDialog: { open: false, downloadingLangData: {} } });
    onAndroidPause(() => this.pauseCallback());
    const downloadingLangState = {
      isdownloading: true,
      isDiferentTts: false,
      engineName: ttsName,
      marketId: marketId,
      selectedLang: lang
    };
    this.props.setDownloadingLang(downloadingLangState);
    window.cordova.plugins.market.open(marketId);
  };

  onCloseDialog = () => {
    this.setState({ openDialog: { open: false, downloadingLangData: {} } });
  };

  prepareDownloadablesLenguages = () => {
    const getDownloadablesLenguages = downloadablesTts => {
      const formatLangObject = downloadablesLangs => {
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
      const downloadablesLangsArray = downloadablesTts.map(tts => {
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
      return formatLangObject(downloadablesLangs);
    };

    const filterAvailablesAndDownloadablesLangs = downloadablesLangs => {
      const { langs } = this.props;
      const slicedLangs = langs.map(lang => lang.slice(0, 2));
      return downloadablesLangs.filter(({ langCode }) =>
        slicedLangs.includes(langCode)
      );
    };

    const filterDownloadablesOnlyLangs = (
      downloadables,
      availableAndDownloadables
    ) => {
      return downloadables.filter(
        downloadableLang =>
          !availableAndDownloadables.includes(downloadableLang)
      );
    };

    const downloadablesLangsList = getDownloadablesLenguages(downloadablesTts);
    const avaliableAndDownloadablesLangs = filterAvailablesAndDownloadablesLangs(
      downloadablesLangsList
    );
    const downloadablesOnly = filterDownloadablesOnlyLangs(
      downloadablesLangsList,
      avaliableAndDownloadablesLangs
    );
    return {
      avaliableAndDownloadablesLangs,
      downloadablesOnly
    };
  };

  pauseCallback = () => {
    navigator.app.exitApp();
  };

  langOnAvailableTtsClick = async (event, downloadingLangData) => {
    const { setDownloadingLang, ttsEngine } = this.props;
    const { ttsName, lang, marketId } = downloadingLangData;
    if (ttsEngine.name === ttsName) {
      const downloadingLangState = {
        isdownloading: true,
        isDiferentTts: false,
        engineName: ttsName,
        marketId: marketId,
        selectedLang: lang
      };
      setDownloadingLang(downloadingLangState);
      this.setState({
        downloadingLangError: {
          ttsError: false,
          langError: true
        }
      });
      return;
    }
    const downloadingLangState = {
      isdownloading: true,
      isDiferentTts: true,
      engineName: ttsName,
      marketId: marketId,
      selectedLang: lang
    };
    setDownloadingLang(downloadingLangState);
    await this.handleSetTtsEngine(ttsName); //after tts change it fires a remounting
  };

  onErrorDialogAcepted = () => {
    const { ttsError } = this.state.downloadingLangError;
    const { marketId } = this.props.downloadingLang;
    const handleCheckitClick = () => {
      onAndroidPause(() => this.pauseCallback());
      window.cordova.plugins.market.open(marketId);
    };
    const handleOpenApp = () => {
      onAndroidPause(() => this.pauseCallback());
      // eslint-disable-next-line no-undef
      startApp
        .set({
          application: marketId
        })
        .start();
    };

    if (ttsError) {
      this.setState({
        downloadingLangError: { ttsError: false, langError: false }
      });
      handleCheckitClick();
      return;
    }
    this.setState({
      downloadingLangError: { ttsError: false, langError: false }
    });
    handleOpenApp();
  };

  onErrorDialogCancel = () => {
    const downloadingLangState = {
      isdownloading: false
    };
    this.props.setDownloadingLang(downloadingLangState);
    this.setState({
      downloadingLangError: { ttsError: false, langError: false }
    });
  };

  lookDownloadingLang = async () => {
    const {
      isDiferentTts,
      engineName,
      selectedLang
    } = this.props.downloadingLang;

    const {
      setDownloadingLang,
      localLangs,
      ttsEngines,
      ttsEngine,
      history,
      showNotification
    } = this.props;

    const ttsEnginesNames = ttsEngines.map(tts => tts.name);
    if (!ttsEnginesNames.includes(engineName)) {
      this.setState({
        downloadingLangError: {
          ...this.state.downloadingLangError,
          ttsError: true
        }
      });
      return;
    }
    if (ttsEngine.name !== engineName) {
      try {
        await this.handleSetTtsEngine(engineName);
      } catch {
        this.setState({
          downloadingLangError: {
            ttsError: false,
            langError: true
          }
        });
        return;
      }
    }
    if (!localLangs.includes(selectedLang)) {
      this.setState({
        downloadingLangError: {
          ttsError: false,
          langError: true
        }
      });
      return;
    }
    const downloadingLangState = {
      isdownloading: false
    };
    setDownloadingLang(downloadingLangState);
    this.setState({ selectedLang: selectedLang });
    if (isDiferentTts) return;
    await this.handleSubmit(selectedLang);
    showNotification(
      <FormattedMessage {...messages.instaledLangSuccesNotification} />
    );
    history.push('/settings');
  };

  componentDidMount = async () => {
    const { isdownloading } = this.props.downloadingLang;

    if (isdownloading) await this.lookDownloadingLang();
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
    const { ttsError, langError } = this.state.downloadingLangError;
    const sortedLangs = sortLangs(lang, langs, localLangs);
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
          onClose={
            history.length > 1
              ? history.goBack
              : () => history.push('/settings')
          }
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
          langOnAvailableTtsClick={this.langOnAvailableTtsClick}
        />
        <DownloadDialog
          onClose={this.onCloseDialog}
          onDialogAcepted={this.onDialogAcepted}
          downloadingLangData={downloadingLangData}
          open={open}
        />
        <DownloadingLangErrorDialog
          onClose={this.onErrorDialogCancel}
          onDialogAcepted={this.onErrorDialogAcepted}
          downloadingLangData={downloadingLangData}
          open={ttsError || langError}
          downloadingLangError={this.state.downloadingLangError}
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
  getTtsEngines,
  showNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LanguageContainer);
