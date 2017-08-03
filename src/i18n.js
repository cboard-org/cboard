import { addLocaleData } from 'react-intl';

export const appLocales = [
  'ar',
  'bn',
  'cs',
  'da',
  'de',
  'el',
  'en',
  'es',
  'fi',
  'fr',
  'he',
  'hi',
  'hu',
  'id',
  'it',
  'ja',
  'km',
  'ko',
  'ne',
  'nl',
  'no',
  'pl',
  'pt',
  'ro',
  'ru',
  'si',
  'sk',
  'sv',
  'th',
  'tr',
  'uk',
  'vi',
  'zh',
  'zu'
];

const localeData = {};
appLocales.forEach(locale => {
  localeData[locale] = require(`react-intl/locale-data/${locale}`);
  addLocaleData(localeData[locale]);
});

export function loadLocaleData(locale) {
  return import(`./translations/${locale}.json`);
}

export function stripRegionCode(language) {
  if (!language) {
    return null;
  }
  return language.toLowerCase().split(/[_-]+/)[0];
}

export function normalizeLanguageCode(language) {
  let normalizedCode = language.split(/[_-]+/);

  if (normalizedCode.length === 1) {
    normalizedCode = normalizedCode[0].toLowerCase();
  } else {
    normalizedCode[0] = normalizedCode[0].toLowerCase();
    normalizedCode[1] = normalizedCode[1].toUpperCase();
    normalizedCode = normalizedCode.join('-');
  }
  return normalizedCode;
}

export const navigatorLanguage = normalizeLanguageCode(navigator.language);
