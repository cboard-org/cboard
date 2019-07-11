import * as actions from './Login.actions';
import { LOGIN_SUCCESS, LOGOUT } from './Login.constants';
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

  board: {
    boards: [mockBoard]
  }
};
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
  it('should create an action to logout', () => {
    const expectedAction = {
      type: LOGOUT
    };
    expect(actions.logout()).toEqual(expectedAction);
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
});
