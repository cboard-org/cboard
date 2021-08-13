import {
  REQUEST_VOICES,
  RECEIVE_VOICES,
  RECEIVE_TTS_ENGINES,
  RECEIVE_TTS_DEFAULT_ENGINE,
  REQUEST_TTS_ENGINE,
  RECEIVE_TTS_ENGINE,
  CHANGE_VOICE,
  CHANGE_PITCH,
  CHANGE_RATE,
  START_SPEECH,
  END_SPEECH,
  CANCEL_SPEECH
} from './SpeechProvider.constants';

import {
  setLangs,
  changeLang
} from '../LanguageProvider/LanguageProvider.actions';
import {
  getSupportedLangs,
  getDefaultLang,
  getVoiceURI,
  filterLocalLangs
} from '../../i18n';
import tts from './tts';

export function requestVoices() {
  return {
    type: REQUEST_VOICES
  };
}

export function receiveVoices(voices) {
  return {
    type: RECEIVE_VOICES,
    voices
  };
}

export function requestTtsEngine() {
  return {
    type: REQUEST_TTS_ENGINE
  };
}

export function receiveTtsEngine(ttsEngineName) {
  return {
    type: RECEIVE_TTS_ENGINE,
    ttsEngineName
  };
}

export function getTtsEngines() {
  const ttsEngines = tts.getTtsEngines();
  return {
    type: RECEIVE_TTS_ENGINES,
    ttsEngines
  };
}

export function setTtsEngine(ttsEngineName) {
  return async dispatch => {
    dispatch(requestTtsEngine());
    try {
      const voices = await tts.setTtsEngine(ttsEngineName);
      dispatch(receiveTtsEngine(ttsEngineName));
      if (!voices.length) {
        throw new Error('TTS engine does not have a language.');
      }
    } catch (err) {
      throw new Error('TTS engine selection error on setTtsEngine');
    }
  };
}

export function updateLangSpeechStatus(voices) {
  return async (dispatch, getState) => {
    try {
      // once we got the voices, we calculate what are the supported languages
      const supportedLangs = getSupportedLangs(voices);
      if (!supportedLangs.length) {
        throw new Error('TTS engine does not have a supported language.');
      }
      const localLangs = filterLocalLangs(voices);
      dispatch(setLangs(supportedLangs, localLangs));

      // now we set the actual language based on the state
      const language = getState().language.lang;
      const lang = supportedLangs.includes(language)
        ? language
        : getDefaultLang(supportedLangs);
      dispatch(changeLang(lang));

      // last step is to change voice in case it is available
      if (
        getState().speech.options.lang.substring(0, 2) !== lang.substring(0, 2)
      ) {
        const uris = voices.map(v => {
          return v.voiceURI;
        });
        let voiceURI = '';
        if (uris.includes(voiceURI)) {
          voiceURI = getState().speech.options.voiceURI;
        } else {
          voiceURI = getVoiceURI(lang, voices);
        }
        dispatch(changeVoice(voiceURI, lang));
      }

      return voices;
    } catch (err) {
      throw new Error(
        'TTS engine does not have a supported language.' + err.message
      );
    }
  };
}

export function getTtsDefaultEngine() {
  const ttsDefaultEngine = tts.getTtsDefaultEngine();
  return {
    type: RECEIVE_TTS_DEFAULT_ENGINE,
    ttsDefaultEngine
  };
}

export function changeVoice(voiceURI, lang) {
  return {
    type: CHANGE_VOICE,
    voiceURI,
    lang
  };
}

export function changePitch(pitch) {
  return {
    type: CHANGE_PITCH,
    pitch
  };
}

export function changeRate(rate) {
  return {
    type: CHANGE_RATE,
    rate
  };
}

export function getVoices() {
  return async dispatch => {
    let voices = [];
    dispatch(requestVoices());
    try {
      const pvoices = await tts.getVoices();
      // some TTS engines do return invalid voices, so we filter them
      const regex = new RegExp('^[a-zA-Z]{2,}-$', 'g');
      const fvoices = pvoices.filter(voice => !regex.test(voice.lang));
      voices = fvoices.map(
        ({ voiceURI, lang, name, Locale, ShortName, DisplayName, Gender }) => {
          let voice = {};
          if (lang) {
            voice.lang = lang;
          } else if (Locale) {
            voice.lang = Locale;
          }
          if (voiceURI) {
            voice.voiceURI = voiceURI;
            voice.voiceSource = 'local';
          } else if (ShortName) {
            voice.voiceURI = ShortName;
            voice.voiceSource = 'cloud';
          }
          if (name) {
            voice.name = name;
          } else if (DisplayName) {
            voice.name = `${DisplayName} (${voice.lang}) - ${Gender}`;
          }
          return voice;
        }
      );
      dispatch(receiveVoices(voices));
    } catch (err) {
      console.error(err.message);
      voices = [];
    } finally {
      return voices;
    }
  };
}

function startSpeech(message) {
  return {
    type: START_SPEECH,
    isSpeaking: true,
    text: message.trim()
  };
}

function endSpeech() {
  return {
    type: END_SPEECH,
    isSpeaking: false
  };
}

export function cancelSpeech() {
  return dispatch => {
    dispatch({
      type: CANCEL_SPEECH,
      isSpeaking: false
    });
    tts.cancel();
  };
}

export function speak(text, onend = () => {}) {
  return (dispatch, getState) => {
    const options = getState().speech.options;
    dispatch(startSpeech(text));

    tts.speak(text, {
      ...options,
      onend: event => {
        onend();
        dispatch(endSpeech());
      }
    });
  };
}
