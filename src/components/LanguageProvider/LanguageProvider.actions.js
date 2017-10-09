import { CHANGE_LOCALE, SET_LOCALES } from './LanguageProvider.constants';

export function changeLocale(locale) {
  return {
    type: CHANGE_LOCALE,
    locale
  };
}

export function setLocales(locales) {
  return {
    type: SET_LOCALES,
    locales
  };
}
