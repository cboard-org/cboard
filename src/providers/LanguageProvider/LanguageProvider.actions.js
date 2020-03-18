import { CHANGE_LANG, SET_LANGS } from './LanguageProvider.constants';
import { updateUserData } from '../../components/App/App.actions';

export function changeLang(lang) {
  updateUserData();
  return {
    type: CHANGE_LANG,
    lang
  };
}

export function setLangs(langs) {
  return {
    type: SET_LANGS,
    langs
  };
}
