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
import { getArasaacDB } from '../../../idb/arasaac/arasaacdb';

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
    updateLangSpeechStatus: PropTypes.func.isRequired,
    /**
     * Object that contain properties refered to "download a language feature"
     */
    downloadingLang: PropTypes.shape({
      // the indicator that the user is trying to download a language.
      isdownloading: PropTypes.bool,
      // the indicator that availables voices have been updated.
      isUpdated: PropTypes.bool,
      // the indicator that the user pressed the 'configure a local voice' button.
      isDiferentTts: PropTypes.bool,
      // the tts engine name that the user is trying to download.
      engineName: PropTypes.string,
      // the tts Engine market ID that the user is trying to download.
      marketId: PropTypes.string,
      // the lang that the user is trying to download.
      selectedLang: PropTypes.string,
      // the indicator that the lang is already available online and the app would change the lang after starting downloading.
      continueOnline: PropTypes.bool,
      // the indicator that the user clicks to download and the tts is already available. is Used to show a different message.
      firstClick: PropTypes.bool
    })
  };

  state = {
    selectedLang: this.props.lang,
    openDialog: { open: false, downloadingLangData: {} },
    downloadablesLangs: {
      avaliableAndDownloadablesLangs: [],
      downloadablesOnly: []
    },
    downloadLangLoading: false,
    downloadingLangError: { ttsError: false, langError: false }
  };

  componentDidMount = () => {
    if (isAndroid()) {
      const { isdownloading } = this.props.downloadingLang;
      this.refreshAndroidLanguageList();
      this.setState({
        downloadLangLoading: isdownloading
      });
      document.addEventListener(
        'backbutton',
        this.handleAndroidBackButton,
        false
      );
    }
  };

  componentWillUnmount = () => {
    if (isAndroid())
      document.removeEventListener(
        'backbutton',
        this.handleAndroidBackButton,
        false
      );
  };

  componentDidUpdate = async () => {
    if (isAndroid()) {
      const { isdownloading, isUpdated } = this.props.downloadingLang;
      if (isdownloading && isUpdated) {
        await this.lookDownloadingLang();
      }
    }
  };

  refreshAndroidLanguageList = () => {
    if (!isAndroid()) return;
    const prepareDownloadablesLenguages = () => {
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
          return {
            langs: tts.langs,
            marketId: tts.marketId,
            ttsName: tts.name
          };
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
        const { ttsEngines } = this.props;
        const { langs } = this.props;
        const ttsEnginesNames = ttsEngines.map(tts => tts.name);

        const availableAndDownloadableLang = downloadablesLangs.filter(
          ({ lang, ttsName }) => langs.includes(lang)
        );

        return availableAndDownloadableLang.map(item => {
          item.ttsAvailable = ttsEnginesNames.includes(item.ttsName);
          return item;
        });
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

      const downloadablesLangsList = getDownloadablesLenguages(
        downloadablesTts
      );
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
    this.setState({
      downloadablesLangs: prepareDownloadablesLenguages()
    });
  };

  handleSubmit = async (optionalLang = null, isNewVoiceAvailable = false) => {
    const { onLangChange } = this.props;
    const selectedLang = optionalLang ? optionalLang : this.state.selectedLang;
    onLangChange(selectedLang, isNewVoiceAvailable);
    this.initArasaacDB(selectedLang);
    try {
      await API.updateSettings({
        language: { lang: selectedLang }
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  initArasaacDB = async lang => {
    const arasaacDB = getArasaacDB();
    arasaacDB.initTextStore(lang.slice(0, 2));
  };

  onClose = () => {
    const { history } = this.props;
    const { downloadLangLoading } = this.state;
    if (downloadLangLoading) return;
    if (history.length > 1) {
      history.goBack();
      return;
    }
    history.push('/settings');
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
      this.refreshAndroidLanguageList();
    } catch (err) {
      throw new Error('TTS engine selection error on handleSetTtsEngine');
    }
  };

  downloadableLangClick = (event, downloadingLangData) => {
    const { avaliableAndDownloadablesLangs } = this.state.downloadablesLangs;
    const { lang: appLang, localLangs } = this.props;
    const continueOnline =
      avaliableAndDownloadablesLangs
        .map(langTtsData => langTtsData.lang)
        .filter(availableLang => !localLangs.includes(availableLang))
        .includes(downloadingLangData.lang) &&
      appLang !== downloadingLangData.lang
        ? true
        : false;
    this.setState({
      openDialog: {
        open: true,
        downloadingLangData: { ...downloadingLangData, continueOnline }
      }
    });
    event.stopPropagation();
  };

  onUninstalledLangClick = () => {
    this.props.showNotification(
      <FormattedMessage {...messages.uninstalledLangNotification} />
    );
  };

  onDownloadLocalVoiceClick = (event, downloadingLangData) => {
    const { avaliableAndDownloadablesLangs } = this.state.downloadablesLangs;
    const { localLangs, lang: appLang } = this.props;
    const continueOnline =
      avaliableAndDownloadablesLangs
        .map(langTtsData => langTtsData.lang)
        .filter(availableLang => !localLangs.includes(availableLang))
        .includes(downloadingLangData.lang) &&
      appLang !== downloadingLangData.lang
        ? true
        : false;
    const { marketId, lang, ttsName } = downloadingLangData;
    const downloadingLangState = {
      isdownloading: true,
      isDiferentTts: false,
      engineName: ttsName,
      marketId: marketId,
      selectedLang: lang,
      firstClick: true,
      continueOnline
    };
    this.props.setDownloadingLang(downloadingLangState);
    this.setState({
      downloadingLangError: {
        ttsError: false,
        langError: true
      }
    });
  };

  onDialogAcepted = downloadingLangData => {
    const { marketId, lang, ttsName, continueOnline } = downloadingLangData;
    this.setState({ openDialog: { open: false, downloadingLangData: {} } });
    const downloadingLangState = {
      isdownloading: true,
      isDiferentTts: false,
      engineName: ttsName,
      marketId: marketId,
      isUpdated: false,
      selectedLang: lang,
      firstClick: false,
      continueOnline: false
    };
    this.props.setDownloadingLang(downloadingLangState);
    if (continueOnline) this.handleSubmit(lang);
    window.cordova.plugins.market.open(marketId);
    navigator.app.exitApp();
  };

  onCloseDialog = () => {
    this.setState({ openDialog: { open: false, downloadingLangData: {} } });
  };

  pauseCallback = () => {
    const downloadingLangState = {
      ...this.props.downloadingLang,
      firstClick: false,
      continueOnline: false
    };
    this.props.setDownloadingLang(downloadingLangState);
    navigator.app.exitApp();
  };

  langOnAvailableTtsClick = async (
    event,
    downloadingLangData,
    firstClick = false
  ) => {
    const { setDownloadingLang, localLangs, lang: appLang } = this.props;
    const { ttsName, lang, marketId } = downloadingLangData;
    const { avaliableAndDownloadablesLangs } = this.state.downloadablesLangs;

    const continueOnline =
      avaliableAndDownloadablesLangs
        .map(langTtsData => langTtsData.lang)
        .filter(availableLang => !localLangs.includes(availableLang))
        .includes(downloadingLangData.lang) && appLang !== lang
        ? true
        : false;
    event.stopPropagation();
    this.setState({ downloadLangLoading: true });
    try {
      await this.handleSetTtsEngine(ttsName);
    } catch (err) {
      console.error(err);
    }
    const downloadingLangState = {
      isdownloading: true,
      isDiferentTts: true,
      engineName: ttsName,
      marketId: marketId,
      selectedLang: lang,
      isUpdated: true,
      continueOnline,
      firstClick
    };
    setDownloadingLang(downloadingLangState);
  };

  handleAndroidBackButton = () => {
    if (this.props.downloadingLang.isdownloading) {
      this.onErrorDialogCancel();
      return;
    }
    this.onClose();
  };

  onErrorDialogAcepted = () => {
    const { ttsError } = this.state.downloadingLangError;
    const { marketId, continueOnline, lang } = this.props.downloadingLang;
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
    if (continueOnline) this.handleSubmit(lang);
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

    const { selectedLang, continueOnline } = this.props.downloadingLang;
    this.props.setDownloadingLang(downloadingLangState);
    if (continueOnline) this.handleLangClick(selectedLang);

    this.setState({
      downloadingLangError: {
        ttsError: false,
        langError: false
      }
    });
  };

  lookDownloadingLang = async () => {
    const { setDownloadingLang, downloadingLang } = this.props;

    const processUpdates = async () => {
      const { isDiferentTts, engineName, selectedLang } = downloadingLang;

      const {
        localLangs,
        ttsEngines,
        ttsEngine,
        history,
        showNotification
      } = this.props;

      if (engineName === ttsEngine.name && localLangs.includes(selectedLang)) {
        setDownloadingLang({ isdownloading: false, isUpdated: false });
        this.setState({ selectedLang: selectedLang });
        if (isDiferentTts) return;
        await this.handleSubmit(selectedLang);
        showNotification(
          <FormattedMessage {...messages.instaledLangSuccesNotification} />
        );
        history.push('/settings');
        return;
      }

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

      this.setState({
        downloadingLangError: {
          ttsError: false,
          langError: true
        }
      });
      return;
    };

    setDownloadingLang({ ...downloadingLang, isUpdated: false });
    await processUpdates();
    this.setState({ downloadLangLoading: false });
  };

  render() {
    const { lang, langs, localLangs, ttsEngines, ttsEngine } = this.props;

    const {
      openDialog,
      downloadingLangError,
      downloadLangLoading,
      downloadablesLangs
    } = this.state;

    const { open, downloadingLangData } = openDialog;
    const { ttsError, langError } = downloadingLangError;
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
          onClose={this.onClose}
          onSubmitLang={this.handleSubmit}
          onSetTtsEngine={this.handleSetTtsEngine}
          downloadablesLangs={downloadablesLangs}
          onDownloadableLangClick={this.downloadableLangClick}
          onUninstalledLangClick={this.onUninstalledLangClick}
          langOnAvailableTtsClick={this.langOnAvailableTtsClick}
          onDownloadLocalVoiceClick={this.onDownloadLocalVoiceClick}
          downloadLangLoading={downloadLangLoading}
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
          handleLangClick={this.handleLangClick}
          downloadingLangData={downloadingLangData}
          open={ttsError || langError}
          downloadingLangError={downloadingLangError}
          downloadingLangState={this.props.downloadingLang}
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
