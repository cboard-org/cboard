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
    });
  };
}

function startSpeech() {
  return {
    type: START_SPEECH,
    isSpeaking: true
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
    tts.cancel();
    dispatch({ type: CANCEL_SPEECH });
  };
}

export function speak(text) {
  return (dispatch, getState) => {
    const options = getState().speech.options;
    dispatch(startSpeech());

    tts.speak(text, {
      ...options,
      onend: event => {
        dispatch(endSpeech());
      }
    });
  };
}
