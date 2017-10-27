import { CHANGE_LANG, SET_LANGS } from './LanguageProvider.constants';
import { APP_LANGS } from '../App/App.constants';

function getDir(lang) {
  return lang === 'ar' || lang === 'he' ? 'rtl' : 'ltr';
}

const initialState = {
  lang: '',
  dir: '',
  langs: APP_LANGS
};

function languageProviderReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_LANG:
      return {
        ...state,
        lang: action.lang,
        dir: getDir(action.lang)
      };
    case SET_LANGS:
      return { ...state, langs: action.langs };
    default:
      return state;
  }
}

export default languageProviderReducer;
