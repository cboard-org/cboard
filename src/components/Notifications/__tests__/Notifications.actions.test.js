import * as actions from '../Notifications.actions';
import * as types from '../Notifications.constants';

describe('actions', () => {
  it('should create an action to show notifications', () => {
    const message = 'dummy message';

    const expectedAction = {
      type: types.SHOW_NOTIFICATION,
      message,
      open: true
    };
    expect(actions.showNotification(message)).toEqual(expectedAction);
  });

  it('should create an action to hide notification', () => {
    const expectedAction = {
      type: types.HIDE_NOTIFICATION,
      open: false
    };
    expect(actions.hideNotification()).toEqual(expectedAction);
  });
});
