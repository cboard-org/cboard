import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';
import { UserIcon } from './UserIcon.component';

jest.mock('./UserIcon.messages', () => {
  return {
    login: {
      id: 'cboard.components.UserIcon.login',
      defaultMessage: 'Login or Sign up'
    }
  };
});

const COMPONENT_PROPS = {
  user: null,
  intl: {
    formatMessage: () => 'label'
  },
  classes: {
    greenAvatar: 'some-green-class'
  }
};

describe('UserIcon tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<UserIcon {...COMPONENT_PROPS} />);
  });

  test('with user', () => {
    const props = {
      ...COMPONENT_PROPS,
      user: {
        name: 'Some Name'
      }
    };
    shallowMatchSnapshot(<UserIcon {...props} />);
  });

  test('with user with facebook photos', () => {
    const props = {
      ...COMPONENT_PROPS,
      user: {
        name: 'Some Name',
        facebook: {
          photos: ['some-picture-link.png']
        }
      }
    };
    shallowMatchSnapshot(<UserIcon {...props} />);
  });
});
