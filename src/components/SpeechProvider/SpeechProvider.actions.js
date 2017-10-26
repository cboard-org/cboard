import {
  REQUEST_VOICES,
  RECEIVE_VOICES,
  CHANGE_VOICE,
  CHANGE_PITCH,
  CHANGE_RATE,
  START_SPEECH,
  CANCEL_SPEECH,
  END_SPEECH
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

export function startSpeech() {
  return {
    type: START_SPEECH
  };
}

export function endSpeech() {
  return {
    type: END_SPEECH
  };
}

export function cancelSpeech() {
  return {
    type: CANCEL_SPEECH
  };
}

export function speak(text) {
  return dispatch => {
    dispatch(startSpeech());
    tts.speak(text);
  };
}
