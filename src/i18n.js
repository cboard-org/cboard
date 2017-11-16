import { addLocaleData } from 'react-intl';

import { APP_LANGS } from './components/App/App.constants';

const splitLangRgx = /[_-]+/;

APP_LANGS.forEach(lang => {
  const locale = lang.slice(0, 2);
  const localeData = require(`react-intl/locale-data/${locale}`);
  addLocaleData(localeData);
});

export function importTranslation(lang) {
  return import(`./translations/${lang}.json`);
}

export function stripRegionCode(lang) {
  return lang.split(splitLangRgx)[0].toLowerCase();
}

export function normalizeLanguageCode(lang) {
  const splittedLang = lang.split(splitLangRgx);
  let normalizedLang =
    splittedLang.length === 1
      ? splittedLang[0].toLowerCase()
      : `${splittedLang[0].toLowerCase()}-${splittedLang[1].toUpperCase()}`;
  return normalizedLang;
}
