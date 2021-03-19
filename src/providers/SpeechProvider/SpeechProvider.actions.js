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
  console.log(ttsEngines);
  return {
    type: RECEIVE_TTS_ENGINES,
    ttsEngines
  };
}

export function setTtsEngine(ttsEngineName) {
  return dispatch => {
    dispatch(requestTtsEngine());

    return tts.setTtsEngine(ttsEngineName).then(pvoices => {
      if (!pvoices.length) {
        return;
      }
      let voices = [];
      console.log(pvoices);
      try {
        voices = pvoices.map(({ voiceURI, lang, name }) => ({
          voiceURI,
          lang,
          name
        }));
        dispatch(receiveTtsEngine(ttsEngineName));
        dispatch(receiveVoices(voices));
      } catch (err) {
        console.log(err.message);
        voices = [];
      } finally {
        return voices;
      }
    });
  };
}

export function getTtsDefaultEngine() {
  const ttsDefaultEngine = tts.getTtsDefaultEngine();
  console.log(ttsDefaultEngine);
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
  return dispatch => {
    dispatch(requestVoices());

    return tts.getVoices().then(pvoices => {
      let voices = [];
      try {
        voices = pvoices.map(({ voiceURI, lang, name }) => ({
          voiceURI,
          lang,
          name
        }));
        dispatch(receiveVoices(voices));
      } catch (err) {
        console.log(err.message);
        voices = [];
      } finally {
        return voices;
      }
    });
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
    dispatch({ type: CANCEL_SPEECH });
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
