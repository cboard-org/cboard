import {
  RECEIVE_VOICES,
  CHANGE_VOICE,
  CHANGE_PITCH,
  CHANGE_RATE,
  CHANGE_VOLUME
} from './SpeechProvider.constants';

const initialState = {
  voices: [],
  voiceURI: null,
  lang: '',
  pitch: 1.0,
  rate: 1.0,
  volume: 1
};

function speechProviderReducer(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_VOICES:
      return { ...state, voices: action.voices };
    case CHANGE_VOICE:
      return {
        ...state,
        voiceURI: action.voiceURI,
        lang: action.lang
      };
    case CHANGE_PITCH:
      return { ...state, pitch: action.pitch };
    case CHANGE_RATE:
      return { ...state, rate: action.rate };
    case CHANGE_VOLUME:
      return { ...state, rate: action.volume };
    default:
      return state;
  }
}

export default speechProviderReducer;
