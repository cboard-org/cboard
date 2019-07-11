import React from 'react';
import { shallow } from 'enzyme';

import Settings from '../Settings.component';

jest.mock('../Settings.messages', () => ({
  settings: {
    id: 'cboard.components.Settings.settings',
    defaultMessage: 'Settings'
  },
  people: {
    id: 'cboard.components.Settings.people',
    defaultMessage: 'People'
  },
  guest: {
    id: 'cboard.components.Settings.guest',
    defaultMessage: 'Guest'
  },
  language: {
    id: 'cboard.components.Settings.language',
    defaultMessage: 'Language'
  },
  speech: {
    id: 'cboard.components.Settings.speech',
    defaultMessage: 'Speech'
  },
  export: {
    id: 'cboard.components.Settings.export',
    defaultMessage: 'Export'
  },
  import: {
    id: 'cboard.components.Settings.import',
    defaultMessage: 'Import'
  },
  display: {
    id: 'cboard.components.Settings.display',
    defaultMessage: 'Display'
  },
  scanning: {
    id: 'cboard.components.Settings.scanning',
    defaultMessage: 'Scanning'
  },
  navigation: {
    id: 'cboard.components.Settings.navigation',
    defaultMessage: 'Navigation'
  },
  system: {
    id: 'cboard.components.Settings.system',
    defaultMessage: 'System'
  },
  about: {
    id: 'cboard.components.Settings.about',
    defaultMessage: 'About Cboard'
  },
  feedback: {
    id: 'cboard.components.Settings.feedback',
    defaultMessage: 'Feedback'
  },
  donate: {
    id: 'cboard.components.Settings.donate',
    defaultMessage: 'Donate'
  },
  username: {
    id: 'cboard.components.Settings.username',
    defaultMessage: 'Username'
  },
  loginSignup: {
    id: 'cboard.components.Settings.loginSignup',
    defaultMessage: 'Login / Sign Up'
  },
  logout: {
    id: 'cboard.components.Settings.logout',
    defaultMessage: 'Logout'
  },
  help: {
    id: 'cboard.components.Settings.help',
    defaultMessage: 'Help'
  },
  userHelp: {
    id: 'cboard.components.Settings.userHelp',
    defaultMessage: 'User Help'
  }
}));

describe('Settings component tests', () => {
  const props = {
    isLogged: false,
    logout: () => {},
    user: {}
  };
  const onClose = jest.fn();

  it('renders without crashing', () => {
    shallow(<Settings {...props} />);
  });
  it('renders ', () => {
    const wrapper = shallow(<Settings {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
  it('renders close', () => {
    const param = {
      ...props,
      history: {
        replace: jest.fn()
      }
    };
    const wrapper = shallow(<Settings {...param} />);
    wrapper.find('.Settings').prop('onClose')();
  });
});
