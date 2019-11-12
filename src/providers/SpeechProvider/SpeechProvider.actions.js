import {
  REQUEST_VOICES,
  RECEIVE_VOICES,
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

    return tts.getVoices().then(voices => {
      voices = voices.map(({ voiceURI, lang, name }) => ({
        voiceURI,
        lang,
        name
      }));
      dispatch(receiveVoices(voices));
      return voices;
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
