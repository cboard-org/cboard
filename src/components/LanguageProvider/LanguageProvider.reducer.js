import { CHANGE_LOCALE, SET_LOCALES } from './LanguageProvider.constants';
import { appLocales } from '../../i18n';

function getDir(locale) {
  return locale === 'ar' || locale === 'he' ? 'rtl' : 'ltr';
}

const initialState = {
  locale: '',
  dir: '',
  locales: appLocales
};

function languageProviderReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_LOCALE:
      return {
        ...state,
        locale: action.locale,
        dir: getDir(action.locale)
      };
    case SET_LOCALES:
      return { ...state, locales: action.locales };
    default:
      return state;
  }
}

export default languageProviderReducer;
