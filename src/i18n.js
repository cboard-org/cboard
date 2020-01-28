import { addLocaleData } from 'react-intl';
import { alpha3TToAlpha2 } from '@cospired/i18n-iso-languages';
import { alpha3ToAlpha2 } from 'i18n-iso-countries';

import { APP_LANGS } from './components/App/App.constants';

const splitLangRgx = /[_-]+/;

APP_LANGS.forEach(lang => {
  const locale = lang.slice(0, 2);
  var localeData = null;
  try {
    localeData = require(`react-intl/locale-data/${locale}`);
  } catch (e) {}
  if (localeData) {
    addLocaleData(localeData);
  }
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

export function standardizeLanguageCode(lang) {
  const splittedLang = lang.split(splitLangRgx);
  if (splittedLang.length < 1) {
    return lang;
  }
  let standardLang =
    splittedLang[0].length === 3
      ? alpha3TToAlpha2(splittedLang[0])
      : splittedLang[0];

  if (splittedLang.length === 1) {
    return standardLang;
  }

  let standardCountry =
    splittedLang[1].length === 3
      ? alpha3ToAlpha2(splittedLang[1])
      : splittedLang[1];

  return `${standardLang}-${standardCountry}`;
}

export function getVoicesLangs(voices) {
  let langs = [...new Set(voices.map(voice => voice.lang))].sort();
  langs = langs.map(lang => standardizeLanguageCode(lang));
  langs = langs.map(lang => normalizeLanguageCode(lang));
  return langs.filter(lang => APP_LANGS.includes(lang));
}

export function getVoiceURI(language, voices) {
  let nVoices = voices.map(({ voiceURI, name, lang }) => ({
    voiceURI,
    name,
    lang: normalizeLanguageCode(standardizeLanguageCode(lang))
  }));
  const nVoice = nVoices.find(voice => voice.lang === language);
  return typeof nVoice.voiceURI !== 'undefined' ? nVoice.voiceURI : null;
}
