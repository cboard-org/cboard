import {
  CHANGE_LANG,
  SET_LANGS,
  SET_DOWNLOADING_LANG
} from './LanguageProvider.constants';
import { updateUserData } from '../../components/App/App.actions';

export function changeLang(lang, isNewVoiceAvailable = false) {
  updateUserData();
  return {
    type: CHANGE_LANG,
    lang,
    isNewVoiceAvailable
  };
}

export function setLangs(langs, localLangs) {
  return {
    type: SET_LANGS,
    langs,
    localLangs
  };
}

export function setDownloadingLang(downloadingLangData) {
  return {
    type: SET_DOWNLOADING_LANG,
    downloadingLangData
  };
}
