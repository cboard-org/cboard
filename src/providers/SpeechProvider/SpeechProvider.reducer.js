import {
  RECEIVE_VOICES,
  CHANGE_VOICE,
  CHANGE_PITCH,
  CHANGE_RATE,
  CHANGE_VOLUME,
  START_SPEECH,
  END_SPEECH,
  CANCEL_SPEECH,
  EMPTY_VOICES,
  RECEIVE_TTS_ENGINES,
  RECEIVE_TTS_DEFAULT_ENGINE,
  RECEIVE_TTS_ENGINE
} from './SpeechProvider.constants';
import {
  getVoiceURI,
  normalizeLanguageCode,
  standardizeLanguageCode
} from '../../i18n';
import { CHANGE_LANG } from '../LanguageProvider/LanguageProvider.constants';
import { LOGIN_SUCCESS } from '../../components/Account/Login/Login.constants';
import { DEFAULT_LANG } from '../../components/App/App.constants';

const initialState = {
  voices: [],
  ttsEngines: [],
  ttsDefaultEngine: {},
  ttsEngine: {},
  langs: [],
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
    case LOGIN_SUCCESS:
      const settings = action.payload.settings || {};
      const { speech } = settings || {};

      const pitch = speech && speech.pitch ? speech.pitch : state.options.pitch;
      const rate = speech && speech.rate ? speech.rate : state.options.rate;

      const options = { ...state.options, pitch, rate };

      return {
        ...state,
        options
      };
    case RECEIVE_VOICES:
      const langs = action.voices.map(voice =>
        normalizeLanguageCode(standardizeLanguageCode(voice.lang))
      );
      //hack just for Alfanum Serbian voices
      //https://github.com/cboard-org/cboard/issues/715
      if (langs.includes('sr-RS')) {
        langs.push('sr-SP');
      }
      //hack just for Tetum language
      //https://github.com/cboard-org/cboard/issues/848
      if (langs.includes('pt-BR') || langs.includes('pt-PT')) {
        langs.push('pt-TL');
      }
      return {
        ...state,
        voices: action.voices,
        langs: [...new Set(langs)].sort()
      };
    case CHANGE_VOICE:
      return {
        ...state,
        options: {
          ...state.options,
          voiceURI: action ? action.voiceURI : EMPTY_VOICES,
          lang: action ? action.lang : DEFAULT_LANG
        }
      };
    case RECEIVE_TTS_ENGINES:
      return {
        ...state,
        ttsEngines: action.ttsEngines
      };
    case RECEIVE_TTS_DEFAULT_ENGINE:
      return {
        ...state,
        ttsDefaultEngine: action.ttsDefaultEngine,
        ttsEngine: state.ttsEngine ? state.ttsEngine : action.ttsDefaultEngine
      };
    case RECEIVE_TTS_ENGINE:
      const newTtsEngine = state.ttsEngines.find(
        engine => engine.name === action.ttsEngineName
      );
      return {
        ...state,
        ttsEngine: newTtsEngine ? newTtsEngine : state.ttsEngine
      };
    case CHANGE_LANG:
      //hack just for Alfanum Serbian voices
      //https://github.com/cboard-org/cboard/issues/715
      if (action.lang === 'sr-SP' || action.lang === 'sr-RS') {
        const language = 'sr-RS';
        return {
          ...state,
          options: {
            ...state.options,
            voiceURI:
              state.options.lang !== language
                ? getVoiceURI(language, state.voices)
                : state.options.voiceURI,
            lang: language
          },
          langs: ['sr-SP', 'sr-RS']
        };
      } else {
        return {
          ...state,
          options: {
            ...state.options,
            voiceURI:
              state.options.lang.substring(0, 2) !== action.lang.substring(0, 2)
                ? getVoiceURI(action.lang, state.voices)
                : state.options.voiceURI,
            lang:
              state.options.lang.substring(0, 2) !== action.lang.substring(0, 2)
                ? action.lang
                : state.options.lang
          }
        };
      }
    case CHANGE_PITCH:
      return { ...state, options: { ...state.options, pitch: action.pitch } };
    case CHANGE_RATE:
      return { ...state, options: { ...state.options, rate: action.rate } };
    case CHANGE_VOLUME:
      return { ...state, options: { ...state.options, volume: action.volume } };
    case START_SPEECH:
      return { ...state, isSpeaking: action.isSpeaking };
    case END_SPEECH:
      return { ...state, isSpeaking: action.isSpeaking };
    case CANCEL_SPEECH:
      return { ...state, isSpeaking: action.isSpeaking };
    default:
      return state;
  }
}

export default speechProviderReducer;
