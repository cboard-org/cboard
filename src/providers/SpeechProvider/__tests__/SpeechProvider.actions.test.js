import * as actions from '../SpeechProvider.actions';
import * as types from '../SpeechProvider.constants';
import tts from '../tts';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

jest.mock('../tts', () => ({
  __esModule: true,
  default: {
    speak: jest.fn(),
    cancel: jest.fn(),
    getVoiceByVoiceURI: jest.fn(() => null)
  }
}));

global.window.speechSynthesis = {
  getVoices: jest.fn(() => [
    { voiceURI: 'test-voice-en', lang: 'en-US', name: 'Test Voice' }
  ]),
  speak: jest.fn(),
  cancel: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn()
};

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

let initialState;
initialState = {
  app: {
    userData: {
      authToken:
        'eyJhbGciOiJIUtI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFybCI6ImFueXRoaW5nQGNib2FyZC5pbyIsImlkIjoiNWJjZmE0ZWQ0OTRiMjAwMDBmOGFiOThiIiwiaXNzdWVyIjoiY2JvYXJkLmlvIiwiaWF0IjoxNTU5NzU1NTU3fQ.2ENI4GyaHwV1B-Pifi0ZUKqyGcjTSLDV0UoPKUY99bo',
      email: 'anything@cboard.io',
      id: '5bcfa4ed494b20000f8ab98b',
      lastlogin: '2018-10-23T22:47:09.367Z',
      locale: 'en-US',
      name: 'martin bedouret',
      provider: '',
      role: 'user'
    }
  },
  speech: {
    isSpeaking: false,
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
    voices: []
  }
};
let voices = [
  { voiceURI: 'Google Deutsch', lang: 'de-DE', name: 'Google Deutsch' },
  { voiceURI: 'Google US English', lang: 'en-US', name: 'Google US English' },
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
];

describe('actions', () => {
  it('should create an action to request voices', () => {
    const expectedAction = {
      type: types.REQUEST_VOICES
    };
    expect(actions.requestVoices()).toEqual(expectedAction);
  });

  it('should create an action to receive voices', () => {
    const voices = [{}, {}];
    const expectedAction = {
      type: types.RECEIVE_VOICES,
      voices
    };
    expect(actions.receiveVoices(voices)).toEqual(expectedAction);
  });

  it('should create an action to change voice', () => {
    const voiceURI = 'Shay Hebrew Voice';
    const lang = 'he';
    const store = mockStore(initialState);
    store.dispatch(actions.changeVoice(voiceURI, lang));
    const dispatchedActions = store.getActions();
    const changeVoiceAction = dispatchedActions.find(
      a => a.type === types.CHANGE_VOICE
    );
    expect(changeVoiceAction).toEqual(
      expect.objectContaining({ type: types.CHANGE_VOICE, voiceURI, lang })
    );
  });

  it('should create an action to change pitch', () => {
    const pitch = 2;
    const expectedAction = {
      type: types.CHANGE_PITCH,
      pitch
    };
    expect(actions.changePitch(pitch)).toEqual(expectedAction);
  });

  it('should create an action to change rate', () => {
    const rate = 2;
    const expectedAction = {
      type: types.CHANGE_RATE,
      rate
    };
    expect(actions.changeRate(rate)).toEqual(expectedAction);
  });
  it('should create an action to cancelSpeech', () => {
    const store = mockStore(initialState);
    store.dispatch(actions.cancelSpeech());
    expect(store.getActions()).toEqual([
      { type: types.CANCEL_SPEECH, isSpeaking: false }
    ]);
    expect(tts.cancel).toHaveBeenCalled();
  });
  it('should create an action to speak ', () => {
    const store = mockStore(initialState);
    const onend = jest.fn();
    store.dispatch(actions.speak('aaa', onend));
    expect(store.getActions()).toEqual([
      { type: types.START_SPEECH, isSpeaking: true, text: 'aaa' }
    ]);
    expect(tts.speak).toHaveBeenCalledWith(
      'aaa',
      expect.objectContaining({
        ...initialState.speech.options,
        onend: expect.any(Function)
      }),
      expect.any(Function)
    );
  });
  it('should create an action to change ElevenLabs API key', () => {
    const elevenLabsApiKey = 'test-api-key';
    const expectedAction = {
      type: types.CHANGE_ELEVENLABS_API_KEY,
      elevenLabsApiKey
    };
    expect(actions.changeElevenLabsApiKey(elevenLabsApiKey)).toEqual(
      expectedAction
    );
  });
  it('should create an action to cache ElevenLabs voices', () => {
    const expectedAction = {
      type: types.CACHE_ELEVENLABS_VOICES,
      voices
    };
    expect(actions.cacheElevenLabsVoices(voices)).toEqual(expectedAction);
  });
  it('should create an action to clear the ElevenLabs cache', () => {
    const expectedAction = {
      type: types.CLEAR_ELEVENLABS_CACHE
    };
    expect(actions.clearElevenLabsCache()).toEqual(expectedAction);
  });
  it('should create an action to change ElevenLabs stability', () => {
    const stability = 0.8;
    const expectedAction = {
      type: types.CHANGE_ELEVENLABS_STABILITY,
      stability
    };
    expect(actions.changeElevenLabsStability(stability)).toEqual(
      expectedAction
    );
  });
  it('should create an action to change ElevenLabs similarity', () => {
    const similarity = 0.6;
    const expectedAction = {
      type: types.CHANGE_ELEVENLABS_SIMILARITY,
      similarity
    };
    expect(actions.changeElevenLabsSimilarity(similarity)).toEqual(
      expectedAction
    );
  });
  it('should create an action to change ElevenLabs style', () => {
    const style = 0.3;
    const expectedAction = {
      type: types.CHANGE_ELEVENLABS_STYLE,
      style
    };
    expect(actions.changeElevenLabsStyle(style)).toEqual(expectedAction);
  });
  it('should create an action to reset ElevenLabs settings', () => {
    const expectedAction = {
      type: types.RESET_ELEVENLABS_SETTINGS
    };
    expect(actions.resetElevenLabsSettings()).toEqual(expectedAction);
  });
});
