import {
  RECEIVE_VOICES,
  CHANGE_VOICE,
  CHANGE_PITCH,
  CHANGE_RATE,
  CHANGE_VOLUME
} from './constants';

const initialState = {
  voices: [],
  voiceURI: null,
  lang: '',
  pitch: 1.0,
  rate: 1.0,
  volume: 1
};

function speechReducer(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_VOICES:
      return Object.assign({}, state, { voices: action.voices });
    case CHANGE_VOICE:
      return Object.assign({}, state, {
        voiceURI: action.voiceURI,
        lang: action.lang
      });
    case CHANGE_PITCH:
      return Object.assign({}, state, { pitch: action.pitch });
    case CHANGE_RATE:
      return Object.assign({}, state, { rate: action.rate });
    case CHANGE_VOLUME:
      return Object.assign({}, state, { rate: action.volume });
    default:
      return state;
  }
}

export default speechReducer;
