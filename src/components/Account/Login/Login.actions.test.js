import * as actions from './Login.actions';
import { LOGIN_SUCCESS, LOGOUT } from './Login.constants';

const userData = {
  authToken: "eyJhbGciOiJIUzcCI6IkpXVCJ9-Pifi0ZUKqyGcjTSLDV0UoPKUY99bo",
  birthdate: "2018-10-23T22:47:09.367Z",
  boards: [{}],
  communicators: [{}],
  email: "anything@cboard.io",
  id: "5bcfa4ed494b20000f8ab98b",
  lastlogin: "2018-10-23T22:47:09.367Z",
  locale: "en-US",
  name: "martin bedouret"
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
    const dispatch = jest.fn();
    const getState = jest.fn();
    actions.login('fff', 'kkk')(dispatch, getState)
      .then(data => { expect(data).toEqual(userData) });
  });
});
