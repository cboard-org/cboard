import { getVoices, changeVoice } from '../../speech/actions';
import { setLocales, changeLocale } from '../LanguageProvider/actions';
import { appLocales } from '../../i18n';

// TODO: refactor (too many redux calls when state changes)

function getVoiceByLocale(voices, locale) {
  return voices.find(voice => voice.lang.slice(0, 2) === locale) || {};
}

function getLocalesFromVoices(voices = []) {
  const locales = [];

  voices.forEach(voice => {
    const locale = voice.lang.slice(0, 2);

    if (appLocales.indexOf(locale) !== -1 && locales.indexOf(locale) === -1) {
      locales.push(locale);
    }
  });
  return locales;
}

export function initApp() {
  return (dispatch, getState) => {
    dispatch(getVoices()).then(voices => {
      const locales = getLocalesFromVoices(voices);
      const navLocale = window.navigator.language.slice(0, 2);
      const userLocale = locales[locales.indexOf(navLocale)];
      const locale = getState().language.locale || userLocale || 'en';
      const voiceURI =
        getState().speech.voiceURI || getVoiceByLocale(voices, locale).voiceURI;
        // getState().speech.voiceURI || getVoiceByLocale(voices, 'he').voiceURI || getVoiceByLocale(voices, 'en').voiceURI;
        
      dispatch(setLocales(locales));
      dispatch(changeVoice(voiceURI, getState().speech.lang));
    });
  };
}

export function changeLocaleAndVoice(locale) {
  return (dispatch, getState) => {
    const voice = getVoiceByLocale(getState().speech.voices, locale);
    dispatch(changeLocale(locale));
    dispatch(changeVoice(voice.voiceURI, voice.lang));
  };
}
