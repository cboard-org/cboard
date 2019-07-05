import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
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
const store = mockStore(initialState);

export const getStore = () => store;
