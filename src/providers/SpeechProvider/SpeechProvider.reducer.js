import {
  RECEIVE_VOICES,
  CHANGE_VOICE,
  CHANGE_PITCH,
  CHANGE_RATE,
  CHANGE_ELEVENLABS_API_KEY,
  CHANGE_VOLUME,
  START_SPEECH,
  END_SPEECH,
  CANCEL_SPEECH,
  EMPTY_VOICES,
  RECEIVE_TTS_ENGINES,
  RECEIVE_TTS_DEFAULT_ENGINE,
  RECEIVE_TTS_ENGINE,
  CACHE_ELEVENLABS_VOICES,
  CLEAR_ELEVENLABS_CACHE,
  CHANGE_ELEVENLABS_STABILITY,
  CHANGE_ELEVENLABS_SIMILARITY,
  CHANGE_ELEVENLABS_STYLE,
  RESET_ELEVENLABS_SETTINGS,
  ELEVEN_LABS
} from './SpeechProvider.constants';
import {
  getVoiceURI,
  normalizeLanguageCode,
  standardizeLanguageCode
} from '../../i18n';
import { CHANGE_LANG } from '../LanguageProvider/LanguageProvider.constants';
import {
  LOGIN_SUCCESS,
  LOGOUT
} from '../../components/Account/Login/Login.constants';
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
    isCloud: null,
    pitch: 1.0,
    rate: 1.0,
    volume: 1,
    elevenLabsStability: 0.5,
    elevenLabsSimilarity: 0.75,
    elevenLabsStyle: 0.0
  },
  isSpeaking: false,
  elevenLabsCache: {
    voices: [],
    timestamp: null,
    ttl: 24 * 60 * 60 * 1000
  },
  elevenLabsApiKey: '',
  elevenLabsVoiceSettings: {}
};

function updateElevenLabsVoiceSetting(state, settingKey, settingValue) {
  const currentVoice = state.voices.find(
    v => v.voiceURI === state.options.voiceURI
  );
  const voiceId = currentVoice?.voice_id;

  const updatedVoiceSettings = {};
  if (voiceId && currentVoice?.voiceSource === ELEVEN_LABS) {
    updatedVoiceSettings[voiceId] = {
      ...(state.elevenLabsVoiceSettings[voiceId] || {}),
      [settingKey]: settingValue
    };
  }

  return {
    ...state.elevenLabsVoiceSettings,
    ...updatedVoiceSettings
  };
}

function resetElevenLabsVoiceSettings(state) {
  const currentVoice = state.voices.find(
    v => v.voiceURI === state.options.voiceURI
  );
  const voiceId = currentVoice?.voice_id;

  const updatedVoiceSettings = {};
  if (voiceId && currentVoice?.voiceSource === ELEVEN_LABS) {
    updatedVoiceSettings[voiceId] = {
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0.0
    };
  }

  return {
    ...state.elevenLabsVoiceSettings,
    ...updatedVoiceSettings
  };
}

function speechProviderReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      const settings = action.payload.settings || {};
      const { speech } = settings || {};

      const pitch = speech && speech.pitch ? speech.pitch : state.options.pitch;
      const rate = speech && speech.rate ? speech.rate : state.options.rate;
      const elevenLabsApiKey =
        speech && speech.elevenLabsApiKey
          ? speech.elevenLabsApiKey
          : state.elevenLabsApiKey;

      const savedVoiceSettings =
        speech && speech.elevenLabsVoiceSettings
          ? speech.elevenLabsVoiceSettings
          : {};

      const currentVoiceURI = state.options.voiceURI;
      const currentVoice = state.voices.find(
        v => v.voiceURI === currentVoiceURI
      );
      const currentVoiceId = currentVoice?.voice_id;

      const currentVoiceSettings =
        currentVoiceId && savedVoiceSettings[currentVoiceId]
          ? savedVoiceSettings[currentVoiceId]
          : {
              stability: state.options.elevenLabsStability,
              similarity_boost: state.options.elevenLabsSimilarity,
              style: state.options.elevenLabsStyle
            };

      const options = {
        ...state.options,
        pitch,
        rate,
        elevenLabsStability: currentVoiceSettings.stability ?? 0.5,
        elevenLabsSimilarity: currentVoiceSettings.similarity_boost ?? 0.75,
        elevenLabsStyle: currentVoiceSettings.style ?? 0.0
      };

      return {
        ...state,
        options,
        elevenLabsApiKey,
        elevenLabsVoiceSettings: savedVoiceSettings
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
      const newVoice = state.voices.find(v => v.voiceURI === action.voiceURI);
      const newVoiceId = newVoice?.voice_id;

      let elevenLabsOptions = {};
      if (newVoice?.voiceSource === ELEVEN_LABS && newVoiceId) {
        const voiceSettings = state.elevenLabsVoiceSettings[newVoiceId];
        if (voiceSettings) {
          elevenLabsOptions = {
            elevenLabsStability: voiceSettings.stability ?? 0.5,
            elevenLabsSimilarity: voiceSettings.similarity_boost ?? 0.75,
            elevenLabsStyle: voiceSettings.style ?? 0.0
          };
        } else {
          elevenLabsOptions = {
            elevenLabsStability: 0.5,
            elevenLabsSimilarity: 0.75,
            elevenLabsStyle: 0.0
          };
        }
      }

      return {
        ...state,
        options: {
          ...state.options,
          voiceURI: action ? action.voiceURI : EMPTY_VOICES,
          lang: action ? action.lang : DEFAULT_LANG,
          isCloud: action ? action.isCloud || null : null,
          ...elevenLabsOptions
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
              state.options.lang.substring(0, 2) !==
                action.lang.substring(0, 2) || action.isNewVoiceAvailable
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
    case CHANGE_ELEVENLABS_API_KEY:
      return {
        ...state,
        elevenLabsApiKey: action.elevenLabsApiKey
      };
    case CHANGE_VOLUME:
      return { ...state, options: { ...state.options, volume: action.volume } };
    case START_SPEECH:
      return { ...state, isSpeaking: action.isSpeaking };
    case END_SPEECH:
      return { ...state, isSpeaking: action.isSpeaking };
    case CANCEL_SPEECH:
      return { ...state, isSpeaking: action.isSpeaking };
    case CACHE_ELEVENLABS_VOICES:
      return {
        ...state,
        elevenLabsCache: {
          ...state.elevenLabsCache,
          voices: action.voices,
          timestamp: Date.now()
        }
      };
    case CLEAR_ELEVENLABS_CACHE:
      return {
        ...state,
        elevenLabsCache: {
          ...state.elevenLabsCache,
          voices: [],
          timestamp: null
        }
      };
    case CHANGE_ELEVENLABS_STABILITY:
      return {
        ...state,
        options: {
          ...state.options,
          elevenLabsStability: action.stability
        },
        elevenLabsVoiceSettings: updateElevenLabsVoiceSetting(
          state,
          'stability',
          action.stability
        )
      };
    case CHANGE_ELEVENLABS_SIMILARITY:
      return {
        ...state,
        options: {
          ...state.options,
          elevenLabsSimilarity: action.similarity
        },
        elevenLabsVoiceSettings: updateElevenLabsVoiceSetting(
          state,
          'similarity_boost',
          action.similarity
        )
      };
    case CHANGE_ELEVENLABS_STYLE:
      return {
        ...state,
        options: {
          ...state.options,
          elevenLabsStyle: action.style
        },
        elevenLabsVoiceSettings: updateElevenLabsVoiceSetting(
          state,
          'style',
          action.style
        )
      };
    case RESET_ELEVENLABS_SETTINGS:
      return {
        ...state,
        options: {
          ...state.options,
          rate: 1.0,
          elevenLabsStability: 0.5,
          elevenLabsSimilarity: 0.75,
          elevenLabsStyle: 0.0
        },
        elevenLabsVoiceSettings: resetElevenLabsVoiceSettings(state)
      };
    case LOGOUT: {
      const nonElevenLabsVoices = state.voices.filter(
        voice => voice.voiceSource !== ELEVEN_LABS
      );

      const currentVoice = state.voices.find(
        v => v.voiceURI === state.options.voiceURI
      );
      const isCurrentVoiceElevenLabs =
        currentVoice?.voiceSource === ELEVEN_LABS;

      const logoutVoiceURI = isCurrentVoiceElevenLabs
        ? getVoiceURI(state.options.lang, nonElevenLabsVoices)
        : state.options.voiceURI;

      const logoutVoice = isCurrentVoiceElevenLabs
        ? nonElevenLabsVoices.find(v => v.voiceURI === logoutVoiceURI)
        : null;

      const logoutIsCloud = isCurrentVoiceElevenLabs
        ? logoutVoice?.voiceSource === 'cloud' ?? null
        : state.options.isCloud;

      return {
        ...state,
        elevenLabsApiKey: '',
        elevenLabsCache: {
          voices: [],
          timestamp: null,
          ttl: 24 * 60 * 60 * 1000
        },
        elevenLabsVoiceSettings: {},
        voices: nonElevenLabsVoices,
        options: {
          ...state.options,
          voiceURI: logoutVoiceURI,
          isCloud: logoutIsCloud,
          elevenLabsStability: 0.5,
          elevenLabsSimilarity: 0.75,
          elevenLabsStyle: 0.0
        }
      };
    }
    default:
      return state;
  }
}

export default speechProviderReducer;
