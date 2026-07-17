import speechProviderReducer from '../SpeechProvider.reducer';
import {
  RECEIVE_VOICES,
  CHANGE_VOICE,
  CHANGE_PITCH,
  CHANGE_RATE,
  CHANGE_VOLUME,
  START_SPEECH,
  END_SPEECH,
  CHANGE_ELEVENLABS_API_KEY,
  CACHE_ELEVENLABS_VOICES,
  CLEAR_ELEVENLABS_CACHE,
  CHANGE_ELEVENLABS_STABILITY,
  CHANGE_ELEVENLABS_SIMILARITY,
  CHANGE_ELEVENLABS_STYLE,
  RESET_ELEVENLABS_SETTINGS,
  ELEVEN_LABS
} from '../SpeechProvider.constants';

import { CHANGE_LANG } from '../../LanguageProvider/LanguageProvider.constants';
import {
  LOGIN_SUCCESS,
  LOGOUT
} from '../../../components/Account/Login/Login.constants';

let mockApSpeechProvider, initialState;

describe('reducer', () => {
  beforeEach(() => {
    initialState = {
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
    mockApSpeechProvider = {
      isSpeaking: true,
      langs: [
        'de-DE',
        'en-GB',
        'en-US',
        'es-ES',
        'es-US',
        'fr-FR',
        'hi-IN',
        'id-ID',
        'it-IT',
        'ja-JP',
        'ko-KR',
        'nl-NL',
        'pl-PL',
        'pt-BR',
        'ru-RU',
        'zh-CN',
        'zh-HK',
        'zh-TW'
      ],
      options: {
        lang: 'en-US',
        voiceURI: 'Microsoft David Desktop - English (United States)',
        pitch: 0.75,
        rate: 0.75,
        volume: 1
      },
      voices: [
        {
          voiceURI: 'Google UK English Female',
          lang: 'en-GB',
          name: 'Google UK English Female'
        },
        {
          voiceURI: 'Google UK English Male',
          lang: 'en-GB',
          name: 'Google UK English Male'
        },
        { voiceURI: 'Google español', lang: 'es-ES', name: 'Google español' }
      ]
    };
  });
  it('should return the initial state', () => {
    expect(speechProviderReducer(undefined, {})).toEqual(initialState);
  });
  it('should handle login ', () => {
    const login = {
      type: LOGIN_SUCCESS,
      payload: mockApSpeechProvider
    };
    expect(speechProviderReducer(initialState, login)).toEqual(initialState);
  });
  it('should handle endSpeech ', () => {
    const endSpeech = {
      type: END_SPEECH,
      isSpeaking: false
    };
    expect(speechProviderReducer(initialState, endSpeech)).toEqual({
      ...initialState,
      isSpeaking: false
    });
  });
  it('should handle startSpeech ', () => {
    const startSpeech = {
      type: START_SPEECH,
      isSpeaking: true
    };
    expect(speechProviderReducer(initialState, startSpeech)).toEqual({
      ...initialState,
      isSpeaking: true
    });
  });
  it('should handle changeVolume ', () => {
    const changeVolume = {
      type: CHANGE_VOLUME,
      volume: 0.5
    };
    expect(speechProviderReducer(initialState, changeVolume)).toEqual({
      ...initialState,
      options: { ...initialState.options, volume: 0.5 }
    });
  });
  it('should handle changeRate ', () => {
    const changeRate = {
      type: CHANGE_RATE,
      rate: 0.5
    };
    expect(speechProviderReducer(initialState, changeRate)).toEqual({
      ...initialState,
      options: { ...initialState.options, rate: 0.5 }
    });
  });
  it('should handle changePitch ', () => {
    const changePitch = {
      type: CHANGE_PITCH,
      pitch: 0.5
    };
    expect(speechProviderReducer(initialState, changePitch)).toEqual({
      ...initialState,
      options: { ...initialState.options, pitch: 0.5 }
    });
  });
  it('should handle changeVoice ', () => {
    const changeVoice = {
      type: CHANGE_VOICE,
      voiceURI: 'test',
      lang: 'es-ES'
    };
    expect(speechProviderReducer(initialState, changeVoice)).toEqual({
      ...initialState,
      options: {
        ...initialState.options,
        voiceURI: 'test',
        lang: 'es-ES'
      }
    });
  });
  it('should handle changeLang ', () => {
    const changeLang = {
      type: CHANGE_LANG,
      voiceURI: 'test',
      lang: 'es-ES'
    };
    expect(speechProviderReducer(mockApSpeechProvider, changeLang)).toEqual({
      ...mockApSpeechProvider,
      options: {
        ...mockApSpeechProvider.options,
        voiceURI: 'Google español',
        lang: 'es-ES'
      }
    });
  });
  it('should handle receiveVoices ', () => {
    const receiveVoices = {
      type: RECEIVE_VOICES,
      voices: mockApSpeechProvider.voices
    };
    expect(speechProviderReducer(initialState, receiveVoices)).toEqual({
      ...initialState,
      voices: mockApSpeechProvider.voices,
      langs: ['en-GB', 'es-ES']
    });
  });
  it('should handle changeElevenLabsApiKey', () => {
    const changeElevenLabsApiKey = {
      type: CHANGE_ELEVENLABS_API_KEY,
      elevenLabsApiKey: 'test-api-key'
    };
    expect(speechProviderReducer(initialState, changeElevenLabsApiKey)).toEqual(
      {
        ...initialState,
        elevenLabsApiKey: 'test-api-key'
      }
    );
  });
  describe('ElevenLabs cache and voice settings', () => {
    const elevenLabsVoice = {
      voiceURI: 'ElevenLabs Rachel',
      lang: 'en-US',
      name: 'Rachel',
      voiceSource: ELEVEN_LABS,
      voice_id: 'el-voice-id-1'
    };
    const localVoice = {
      voiceURI: 'Google US English',
      lang: 'en-US',
      name: 'Google US English',
      voiceSource: 'local'
    };
    let stateWithElevenLabsVoice;

    beforeEach(() => {
      stateWithElevenLabsVoice = {
        ...initialState,
        voices: [elevenLabsVoice, localVoice],
        options: {
          ...initialState.options,
          lang: 'en-US',
          voiceURI: elevenLabsVoice.voiceURI
        },
        elevenLabsApiKey: 'test-api-key'
      };
    });

    it('should handle cacheElevenLabsVoices', () => {
      const now = 1700000000000;
      jest.spyOn(Date, 'now').mockReturnValue(now);
      const cacheVoices = {
        type: CACHE_ELEVENLABS_VOICES,
        voices: [elevenLabsVoice]
      };
      expect(speechProviderReducer(initialState, cacheVoices)).toEqual({
        ...initialState,
        elevenLabsCache: {
          ...initialState.elevenLabsCache,
          voices: [elevenLabsVoice],
          timestamp: now
        }
      });
      Date.now.mockRestore();
    });

    it('should handle clearElevenLabsCache', () => {
      const cachedState = {
        ...initialState,
        elevenLabsCache: {
          ...initialState.elevenLabsCache,
          voices: [elevenLabsVoice],
          timestamp: 1700000000000
        }
      };
      const clearCache = { type: CLEAR_ELEVENLABS_CACHE };
      expect(speechProviderReducer(cachedState, clearCache)).toEqual({
        ...initialState,
        elevenLabsCache: {
          ...initialState.elevenLabsCache,
          voices: [],
          timestamp: null
        }
      });
    });

    it('should handle changeElevenLabsStability for the selected ElevenLabs voice', () => {
      const changeStability = {
        type: CHANGE_ELEVENLABS_STABILITY,
        stability: 0.8
      };
      expect(
        speechProviderReducer(stateWithElevenLabsVoice, changeStability)
      ).toEqual({
        ...stateWithElevenLabsVoice,
        options: {
          ...stateWithElevenLabsVoice.options,
          elevenLabsStability: 0.8
        },
        elevenLabsVoiceSettings: {
          [elevenLabsVoice.voice_id]: { stability: 0.8 }
        }
      });
    });

    it('should handle changeElevenLabsSimilarity for the selected ElevenLabs voice', () => {
      const changeSimilarity = {
        type: CHANGE_ELEVENLABS_SIMILARITY,
        similarity: 0.6
      };
      expect(
        speechProviderReducer(stateWithElevenLabsVoice, changeSimilarity)
      ).toEqual({
        ...stateWithElevenLabsVoice,
        options: {
          ...stateWithElevenLabsVoice.options,
          elevenLabsSimilarity: 0.6
        },
        elevenLabsVoiceSettings: {
          [elevenLabsVoice.voice_id]: { similarity_boost: 0.6 }
        }
      });
    });

    it('should handle changeElevenLabsStyle for the selected ElevenLabs voice', () => {
      const changeStyle = {
        type: CHANGE_ELEVENLABS_STYLE,
        style: 0.3
      };
      expect(
        speechProviderReducer(stateWithElevenLabsVoice, changeStyle)
      ).toEqual({
        ...stateWithElevenLabsVoice,
        options: {
          ...stateWithElevenLabsVoice.options,
          elevenLabsStyle: 0.3
        },
        elevenLabsVoiceSettings: {
          [elevenLabsVoice.voice_id]: { style: 0.3 }
        }
      });
    });

    it('should not store voice settings when the selected voice is not from ElevenLabs', () => {
      const localVoiceState = {
        ...stateWithElevenLabsVoice,
        options: {
          ...stateWithElevenLabsVoice.options,
          voiceURI: localVoice.voiceURI
        }
      };
      const changeStability = {
        type: CHANGE_ELEVENLABS_STABILITY,
        stability: 0.8
      };
      expect(speechProviderReducer(localVoiceState, changeStability)).toEqual({
        ...localVoiceState,
        options: {
          ...localVoiceState.options,
          elevenLabsStability: 0.8
        },
        elevenLabsVoiceSettings: {}
      });
    });

    it('should handle resetElevenLabsSettings', () => {
      const modifiedState = {
        ...stateWithElevenLabsVoice,
        options: {
          ...stateWithElevenLabsVoice.options,
          rate: 1.5,
          elevenLabsStability: 0.9,
          elevenLabsSimilarity: 0.2,
          elevenLabsStyle: 0.7
        },
        elevenLabsVoiceSettings: {
          [elevenLabsVoice.voice_id]: {
            stability: 0.9,
            similarity_boost: 0.2,
            style: 0.7
          }
        }
      };
      const reset = { type: RESET_ELEVENLABS_SETTINGS };
      expect(speechProviderReducer(modifiedState, reset)).toEqual({
        ...modifiedState,
        options: {
          ...modifiedState.options,
          rate: 1.0,
          elevenLabsStability: 0.5,
          elevenLabsSimilarity: 0.75,
          elevenLabsStyle: 0.0
        },
        elevenLabsVoiceSettings: {
          [elevenLabsVoice.voice_id]: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0
          }
        }
      });
    });

    it('should clear ElevenLabs data on logout', () => {
      const loggedInState = {
        ...stateWithElevenLabsVoice,
        elevenLabsCache: {
          ...initialState.elevenLabsCache,
          voices: [elevenLabsVoice],
          timestamp: 1700000000000
        },
        elevenLabsVoiceSettings: {
          [elevenLabsVoice.voice_id]: { stability: 0.8 }
        }
      };
      const logout = { type: LOGOUT };
      const nextState = speechProviderReducer(loggedInState, logout);

      expect(nextState.elevenLabsApiKey).toEqual('');
      expect(nextState.elevenLabsCache).toEqual(initialState.elevenLabsCache);
      expect(nextState.elevenLabsVoiceSettings).toEqual({});
      expect(nextState.voices).toEqual([localVoice]);
      // the selected ElevenLabs voice is replaced by a non-ElevenLabs voice
      expect(nextState.options.voiceURI).toEqual(localVoice.voiceURI);
      expect(nextState.options.isCloud).toEqual(null);
      expect(nextState.options.elevenLabsStability).toEqual(0.5);
      expect(nextState.options.elevenLabsSimilarity).toEqual(0.75);
      expect(nextState.options.elevenLabsStyle).toEqual(0.0);
    });
  });
});
