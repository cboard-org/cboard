import speechProviderReducer from '../SpeechProvider.reducer';
import {
  RECEIVE_VOICES,
  CHANGE_VOICE,
  CHANGE_PITCH,
  CHANGE_RATE,
  CHANGE_VOLUME,
  START_SPEECH,
  END_SPEECH
} from '../SpeechProvider.constants';

import { CHANGE_LANG } from '../../LanguageProvider/LanguageProvider.constants';
import { LOGIN_SUCCESS } from '../../../components/Account/Login/Login.constants';

let mockApSpeechProvider, initialState;

describe('reducer', () => {
  beforeEach(() => {
    initialState = {
      voices: [],
      langs: [],
      options: {
        lang: '',
        voiceURI: null,
        pitch: 1.0,
        rate: 1.0,
        volume: 1
      },
      isSpeaking: false,
      ttsDefaultEngine: {},
      ttsEngine: {},
      ttsEngines: []
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
});
