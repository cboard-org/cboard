import * as actions from './Login.actions';
import { LOGIN_SUCCESS, LOGOUT } from './Login.constants';
import { CHANGE_VOICE } from './../../../providers/SpeechProvider/SpeechProvider.constants';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock('../../../api/api');

const mockBoard = {
  name: 'tewt',
  id: '12345678901234567',
  tiles: [{ id: '1234', loadBoard: '456456456456456456456' }],
  isPublic: false,
  email: 'asd@qwe.com',
  markToUpdate: true
};

let initialState;
initialState = {
  app: {
    userData: {
      authToken: 'eyJlbWFybCI6ImFueXRo',
      email: 'anything@cboard.io',
      id: '5bcfa4ed494b20000f8ab98b',
      lastlogin: '2018-10-23T22:47:09.367Z',
      locale: 'en-US',
      name: 'martin bedouret',
      provider: '',
      role: 'user'
    }
  },
  language: { lang: 'en-US' },
  communicator: {
    activeCommunicatorId: 'cboard_default',
    communicators: [
      {
        author: 'Cboard Team',
        boards: ['root'],
        description: "Cboard's default communicator",
        email: 'support@cboard.io',
        id: 'cboard_default',
        name: "Cboard's Communicator",
        rootBoard: 'root'
      }
    ]
  },
  speech: {
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
  },
  board: {
    boards: [mockBoard]
  }
};

const voicesMock = [
  {
    lang: 'es-ES',
    voiceURI: 'Español-español-mock',
    voiceSource: 'local',
    name: 'ESPAÑOL ES'
  },
  {
    lang: 'en-GB',
    voiceURI:
      'urn:moz-tts:sapi:Microsoft Hazel Desktop - English (Great Britain)?en-GB',
    voiceSource: 'local',
    name: 'Microsoft Hazel Desktop - English (Great Britain)'
  }
];

const userData = {
  authToken: 'eyJhbGciOiJIUzcCI6IkpXVCJ9-Pifi0ZUKqyGcjTSLDV0UoPKUY99bo',
  birthdate: '2018-10-23T22:47:09.367Z',
  boards: [{}],
  communicators: [{}],
  email: 'anything@cboaryd.io',
  id: '5bcfa4ed494b20000f8ab98b',
  lastlogin: '2018-10-23T22:47:09.367Z',
  locale: 'en-US',
  name: 'martin bedouret'
};
describe('actions', () => {
  it('should create an action to loginSuccess', () => {
    const expectedAction = {
      type: LOGIN_SUCCESS,
      payload: userData
    };
    expect(actions.loginSuccess(userData)).toEqual(expectedAction);
  });
  it('should create an action to logout', async () => {
    const store = mockStore(initialState);
    const expectedAction = {
      type: LOGOUT
    };
    await store.dispatch(actions.logout());
    const logoutActions = store.getActions();
    expect(logoutActions).toContainEqual(expectedAction);
  });
  it('should create an action to login', () => {
    const store = mockStore(initialState);
    const user = { email: 'test', password: '1122' };
    store
      .dispatch(actions.login(user, 'local'))
      .then(data => {
        expect(data).toEqual();
      })
      .catch(e => {
        throw new Error(e.message);
      });
  });
  it('should log in and don t change voice', async () => {
    const initialSpeech = {
      voices: [
        {
          lang: 'en-GB',
          voiceURI:
            'urn:moz-tts:sapi:Microsoft Hazel Desktop - English (Great Britain)?en-GB',
          voiceSource: 'local',
          name: 'Microsoft Hazel Desktop - English (Great Britain)'
        }
      ],
      options: {
        voiceURI:
          'urn:moz-tts:sapi:Microsoft Hazel Desktop - English (Great Britain)?en-GB',
        lang: 'en-GB'
      }
    };
    initialState = { ...initialState, speech: initialSpeech };
    const storeWithSpeech = mockStore(initialState);
    const user = { email: 'test', password: '1122' };

    await storeWithSpeech
      .dispatch(actions.login(user, 'local'))
      .catch(() => {});

    const dispatchedActions = storeWithSpeech.getActions();

    expect(dispatchedActions[dispatchedActions.length - 1].type).not.toBe(
      CHANGE_VOICE
    );
  });
  it('should log in and change voice corresponding to the app language', async () => {
    const initialSpeech = {
      voices: voicesMock,
      options: {
        voiceURI:
          'urn:moz-tts:sapi:Microsoft Hazel Desktop - English (Great Britain)?en-GB',
        lang: 'en-GB'
      }
    };
    initialState = {
      ...initialState,
      speech: initialSpeech,
      language: { lang: 'es-ES' }
    };
    const storeWithSpeech = mockStore(initialState);
    const user = { email: 'test', password: '1122' };
    await storeWithSpeech
      .dispatch(actions.login(user, 'local'))
      .catch(() => {});

    const dispatchedActions = storeWithSpeech.getActions();
    const changeVoiceAction = dispatchedActions[dispatchedActions.length - 1];
    expect(changeVoiceAction.type).toBe(CHANGE_VOICE);
    expect(changeVoiceAction.lang.substring(0, 2)).toBe(
      initialState.language.lang.substring(0, 2)
    );
    expect(changeVoiceAction.voiceURI).toBe('Español-español-mock');
  });
  it('should log in and change voice corresponding to the app language even if the voice dialect is not equal to the app dialect', async () => {
    const initialSpeech = {
      voices: [
        {
          lang: 'es-CO',
          voiceURI: 'Español-Colombian-mock',
          voiceSource: 'local',
          name: 'ESPAÑOL Colombian'
        },
        {
          lang: 'en-GB',
          voiceURI:
            'urn:moz-tts:sapi:Microsoft Hazel Desktop - English (Great Britain)?en-GB',
          voiceSource: 'local',
          name: 'Microsoft Hazel Desktop - English (Great Britain)'
        }
      ],
      options: {
        voiceURI:
          'urn:moz-tts:sapi:Microsoft Hazel Desktop - English (Great Britain)?en-GB',
        lang: 'en-GB'
      }
    };
    initialState = {
      ...initialState,
      speech: initialSpeech,
      language: { lang: 'es-ES' }
    };
    const storeWithSpeech = mockStore(initialState);
    const user = { email: 'test', password: '1122' };
    await storeWithSpeech
      .dispatch(actions.login(user, 'local'))
      .catch(() => {});

    const dispatchedActions = storeWithSpeech.getActions();
    const changeVoiceAction = dispatchedActions[dispatchedActions.length - 1];
    expect(changeVoiceAction.type).toBe(CHANGE_VOICE);
    expect(changeVoiceAction.lang.substring(0, 2)).toBe(
      initialState.language.lang.substring(0, 2)
    );
    expect(changeVoiceAction.voiceURI).toBe('Español-Colombian-mock');
    expect(changeVoiceAction.lang).not.toBe(initialState.language.lang);
  });
  it('should log in and change voice to voice stored on DB', async () => {
    const initialSpeech = {
      voices: voicesMock,
      options: {
        voiceURI: 'Español-Colombiano-mock',
        lang: 'es-ES'
      }
    };
    initialState = {
      ...initialState,
      speech: initialSpeech,
      language: { lang: 'en-GB' }
    };
    const storeWithSpeech = mockStore(initialState);
    const user = { email: 'test', password: '1122' };
    await storeWithSpeech
      .dispatch(actions.login(user, 'local'))
      .catch(() => {});

    const dispatchedActions = storeWithSpeech.getActions();
    const changeVoiceAction = dispatchedActions[dispatchedActions.length - 1];
    expect(changeVoiceAction.type).toBe(CHANGE_VOICE);
    expect(changeVoiceAction.lang.substring(0, 2)).toBe(
      initialState.language.lang.substring(0, 2)
    );
  });
  it('should log in and change voice to voice stored on DB even if the voice dialect is not equal to the app dialect', async () => {
    const initialSpeech = {
      voices: voicesMock,
      options: {
        voiceURI: 'Español-Colombiano-mock',
        lang: 'es-ES'
      }
    };
    initialState = {
      ...initialState,
      speech: initialSpeech,
      language: { lang: 'en-US' }
    };
    const storeWithSpeech = mockStore(initialState);
    const user = { email: 'test', password: '1122' };
    await storeWithSpeech
      .dispatch(actions.login(user, 'local'))
      .catch(() => {});

    const dispatchedActions = storeWithSpeech.getActions();
    const changeVoiceAction = dispatchedActions[dispatchedActions.length - 1];
    expect(changeVoiceAction.type).toBe(CHANGE_VOICE);
    expect(changeVoiceAction.lang.substring(0, 2)).toBe(
      initialState.language.lang.substring(0, 2)
    );
    expect(changeVoiceAction.voiceURI).toBe(
      'urn:moz-tts:sapi:Microsoft Hazel Desktop - English (Great Britain)?en-GB'
    );
    expect(changeVoiceAction.lang).not.toBe(initialState.language.lang);
  });
  it('should set empty voice if voices are unavailable for the app language', async () => {
    const initialSpeech = {
      voices: [
        {
          lang: 'es-ES',
          voiceURI: 'Español-Colombiano-mock',
          voiceSource: 'local',
          name: 'Español-Colombiano-mock'
        }
      ],
      options: {
        voiceURI: 'Español-Colombiano-mock',
        lang: 'es-ES'
      }
    };
    initialState = {
      ...initialState,
      speech: initialSpeech,
      language: { lang: 'en-GB' }
    };
    const storeWithSpeech = mockStore(initialState);
    const user = { email: 'test', password: '1122' };
    await storeWithSpeech
      .dispatch(actions.login(user, 'local'))
      .catch(() => {});

    const dispatchedActions = storeWithSpeech.getActions();
    const changeVoiceAction = dispatchedActions[dispatchedActions.length - 1];
    expect(changeVoiceAction.type).toBe(CHANGE_VOICE);
    expect(changeVoiceAction.lang.substring(0, 2)).not.toBe(
      initialState.language.lang.substring(0, 2)
    );
    expect(changeVoiceAction.voiceURI).toBe('empty voices');
  });
  it('if speech options lang is null set the initial state', async () => {
    const initialSpeech = {
      voices: [],
      options: {
        voiceURI: 'empty voices',
        lang: null
      }
    };
    initialState = {
      ...initialState,
      speech: initialSpeech,
      language: { lang: null }
    };
    const storeWithSpeech = mockStore(initialState);
    const user = { email: 'test', password: '1122' };
    await storeWithSpeech
      .dispatch(actions.login(user, 'local'))
      .catch(() => {});

    const dispatchedActions = storeWithSpeech.getActions();
    const changeVoiceAction = dispatchedActions[dispatchedActions.length - 1];
    expect(changeVoiceAction.type).toBe(CHANGE_VOICE);
    expect(changeVoiceAction.lang).toBe('');
    expect(changeVoiceAction.voiceURI).toBe('empty voices');
  });
  it('if any voice is available and speech options lang is the initial state should not dispatch change voice', async () => {
    const initialSpeech = {
      voices: [],
      options: {
        voiceURI: 'empty voices',
        lang: ''
      }
    };
    initialState = {
      ...initialState,
      speech: initialSpeech,
      language: { lang: 'en-US' }
    };
    const storeWithSpeech = mockStore(initialState);
    const user = { email: 'test', password: '1122' };
    await storeWithSpeech
      .dispatch(actions.login(user, 'local'))
      .catch(() => {});

    const dispatchedActions = storeWithSpeech.getActions();
    const changeVoiceAction = dispatchedActions[dispatchedActions.length - 1];
    expect(changeVoiceAction.type).not.toBe(CHANGE_VOICE);
  });
});
