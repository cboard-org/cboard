import { CHANGE_LANG, SET_LANGS } from './LanguageProvider.constants';
import { LOGIN_SUCCESS } from '../../components/Account/Login/Login.constants';

function getDir(lang) {
  const locale = lang.slice(0, 2);
  return locale === 'ar' || locale === 'he' ? 'rtl' : 'ltr';
}

const initialState = {
  lang: '',
  dir: '',
  langs: []
};

function languageProviderReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      const settings = action.payload.settings || {};
      const { language } = settings;

      const lang = language && language.lang && state.langs.indexOf(language.lang) >= 0 ? language.lang : state.lang;
      return {
        ...state,
        lang,
        dir: getDir(lang)
      };
    case CHANGE_LANG:
      return {
        ...state,
        lang: action.lang,
        dir: getDir(action.lang)
      };
    case SET_LANGS:
      return { ...state, langs: action.langs.sort() };
    default:
      return state;
  }
}

export default languageProviderReducer;
