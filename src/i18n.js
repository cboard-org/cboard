import { addLocaleData } from 'react-intl';
import { alpha3TToAlpha2 } from '@cospired/i18n-iso-languages';
import { alpha3ToAlpha2 } from 'i18n-iso-countries';

import { APP_LANGS, DEFAULT_LANG } from './components/App/App.constants';
import { EMPTY_VOICES } from './providers/SpeechProvider/SpeechProvider.constants';

const splitLangRgx = /[_-]+/;

APP_LANGS.forEach(lang => {
  const locale = lang.slice(0, 2);
  var localeData = null;
  try {
    localeData = require(`react-intl/locale-data/${locale}`);
  } catch (err) {
    console.log(err.message);
    console.log(locale);
  }
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
      ? alpha3TToAlpha2(splittedLang[0]) || splittedLang[0]
      : splittedLang[0];

  if (splittedLang.length === 1) {
    return standardLang;
  }

  let standardCountry =
    splittedLang[1].length === 3
      ? alpha3ToAlpha2(splittedLang[1]) || splittedLang[1]
      : splittedLang[1];

  return `${standardLang}-${standardCountry}`;
}

export function getDefaultLang(langs) {
  for (let i = 0; i < langs.length; i++) {
    if (window.navigator.language.slice(0, 2) === langs[i].slice(0, 2)) {
      return langs[i];
    }
  }
  return langs.includes(DEFAULT_LANG) ? DEFAULT_LANG : langs[0];
}

export function getVoicesLangs(voices) {
  let langs = [...new Set(voices.map(voice => voice.lang))].sort();
  langs = langs.map(lang => standardizeLanguageCode(lang));
  langs = langs.map(lang => normalizeLanguageCode(lang));
  langs = [...new Set(langs)].sort();
  return langs.filter(lang => APP_LANGS.includes(lang));
}

export function getSupportedLangs(voices) {
  let supportedLangs = [];
  if (voices.length) {
    const sLanguages = getVoicesLangs(voices);
    if (sLanguages !== undefined && sLanguages.length) {
      supportedLangs = sLanguages;
      //hack just for Alfanum Serbian voices
      //https://github.com/cboard-org/cboard/issues/715
      if (supportedLangs.includes('sr-RS')) {
        supportedLangs.push('sr-SP');
      }
      //hack just for Tetum language
      //https://github.com/cboard-org/cboard/issues/848
      if (
        supportedLangs.includes('pt-BR') ||
        supportedLangs.includes('pt-PT')
      ) {
        supportedLangs.push('pt-TL');
      }
    }
  }
  return supportedLangs;
}

export function filterLocalLangs(voices) {
  let localVoices = [
    ...new Set(voices.filter(voice => voice.voiceSource === 'local'))
  ].sort();
  let localLangs = localVoices.map(voice => voice.lang);
  localLangs = localLangs.map(lang => standardizeLanguageCode(lang));
  localLangs = localLangs.map(lang => normalizeLanguageCode(lang));
  localLangs = [...new Set(localLangs)].sort();
  return localLangs.filter(lang => APP_LANGS.includes(lang));
}

export function getVoiceURI(language, voices) {
  let nVoices = voices.map(({ voiceURI, name, lang }) => ({
    voiceURI,
    name,
    lang: normalizeLanguageCode(standardizeLanguageCode(lang))
  }));

  // special case for tetum-language
  if (language === 'pt-TL') {
    const langs = voices.map(voice => voice.lang);
    if (langs.includes('pt-PT')) {
      language = 'pt-PT';
    } else if (langs.includes('pt-BR')) {
      language = 'pt-BR';
    }
  }

  const nVoice = nVoices.find(
    voice => voice.lang.substring(0, 2) === language.substring(0, 2)
  );
  return typeof nVoice !== 'undefined' ? nVoice.voiceURI : EMPTY_VOICES;
}
