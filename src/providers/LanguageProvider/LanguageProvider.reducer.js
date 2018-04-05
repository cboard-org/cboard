import { CHANGE_LANG, SET_LANGS } from './LanguageProvider.constants';

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
