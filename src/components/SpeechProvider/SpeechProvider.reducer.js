import {
  RECEIVE_VOICES,
  CHANGE_VOICE,
  CHANGE_PITCH,
  CHANGE_RATE,
  CHANGE_VOLUME,
  START_SPEECH,
  END_SPEECH
} from './SpeechProvider.constants';

import { CHANGE_LANG } from '../LanguageProvider/LanguageProvider.constants';

const initialState = {
  voices: [],
  options: {
    lang: '',
    voiceURI: null,
    pitch: 1.0,
    rate: 1.0,
    volume: 1
  },
  isSpeaking: false
};

function speechProviderReducer(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_VOICES:
      return { ...state, voices: action.voices };
    case CHANGE_VOICE:
      return {
        ...state,
        options: {
          voiceURI: action.voiceURI,
          lang: action.lang
        }
      };
    case CHANGE_LANG:
      return {
        ...state,
        options: {
          lang: action.lang,
          voiceURI: state.voices.find(voice => voice.lang === action.lang)
        }
      };
    case CHANGE_PITCH:
      return { ...state, options: { pitch: action.pitch } };
    case CHANGE_RATE:
      return { ...state, options: { rate: action.rate } };
    case CHANGE_VOLUME:
      return { ...state, options: { rate: action.volume } };
    case START_SPEECH:
      return { ...state, isSpeaking: true };
    case END_SPEECH:
      return { ...state, isSpeaking: false };
    default:
      return state;
  }
}

export default speechProviderReducer;
