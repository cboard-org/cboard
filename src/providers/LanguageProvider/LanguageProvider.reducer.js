import {
  CHANGE_LANG,
  SET_LANGS,
  SET_DOWNLOADING_LANG
} from './LanguageProvider.constants';
import { LOGIN_SUCCESS } from '../../components/Account/Login/Login.constants';

import { DEFAULT_LANG } from '../../components/App/App.constants';
import { APP_LANGS } from '../../components/App/App.constants';



function getDir(lang) {
  const locale = lang.slice(0, 2);
  return locale === 'ar' || locale === 'he' ? 'rtl' : 'ltr';
}

// Get browser languages; and check if they are supported
function getLangs() {
  // get the browser language
  var userLang = navigator.language;
  console.log("The user language is: " + userLang);

  var isSupported = false;

  // Language is in the format "en" or "en-US"
  // Language is in the format "xx"
  if (userLang.length === 2) {
    APP_LANGS.forEach(currLang => {
      // only compare the first two characters
      if (currLang.slice(0,2) === userLang) {
        console.log("The user language is supported: " + userLang);
        isSupported = true; 
        // Swith to correct format: xx-XX
        userLang = currLang;
      }
    });

  // Language is in the format "xx-XX"
  } else {
    APP_LANGS.forEach(currLang => {
      if (currLang === userLang) {
        console.log("The user language is supported: " + userLang);
        isSupported = true; 
      }
    });
  }
  // if the language is not support, set it to the default language
  if (!isSupported) {
    console.log("The user language is not supported: " + userLang);
    userLang = DEFAULT_LANG;
  }
  return userLang;
}

var initialState = {
  lang: getLangs(),
  dir: getDir(getLangs()),
  langs: [],
  localLangs: [],
  langsFetched: false,
  downloadingLang: { isdownloading: false }
};

function languageProviderReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      const settings = action.payload.settings || {};
      const { language } = settings;

      const lang =
        language && language.lang && state.langs.indexOf(language.lang) >= 0
          ? language.lang
          : state.lang;
      return {
        ...state,
        lang,
        dir: getDir(lang)
      };
    case CHANGE_LANG:
      return {
        ...state,
        lang: action.lang ? action.lang : state.lang,
        dir: action.lang ? getDir(action.lang) : state.dir
      };
    case SET_LANGS:
      return {
        ...state,
        langs: action.langs.sort(),
        localLangs: action.localLangs || [],
        langsFetched: true
      };
    case SET_DOWNLOADING_LANG:
      return { ...state, downloadingLang: action.downloadingLangData };

    default:
      return state;
  }
}

export default languageProviderReducer;