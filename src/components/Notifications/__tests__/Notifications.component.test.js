import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';
import Notifications from '../Notifications.component';

const COMPONENT_PROPS = {
  config: {},
  handleNotificationDismissal: () => {},
  message: 'hhh',
  open: true,
  showQueuedNotificationIfAny: () => {}
};

describe('Notifications tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<Notifications {...COMPONENT_PROPS} />);
  });
});
