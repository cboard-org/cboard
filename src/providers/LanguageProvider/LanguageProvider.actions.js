import { CHANGE_LANG, SET_LANGS } from './LanguageProvider.constants';

export function changeLang(lang) {
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
