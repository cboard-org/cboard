import React from 'react';
import { shallow, mount } from 'enzyme';

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

it('renders without crashing', () => {
  const props = {
    isLogged: false,
    logout: () => {},
    user: {}
  };
  shallow(<Settings {...props} />);
});

// it('renders with button child', () => {
//   const wrapper = mount(<Tile />);
//   expect(wrapper.find('button')).toHaveLength(1);
// });

// it('renders with <Scannable /> child', () => {
//   const props = {
//     label: 'dummy label',
//     img: 'path/to/img.svg'
//   };
//   const wrapper = mount(<Tile {...props} />);
//   const scannable = wrapper.find(Scannable);
//   expect(scannable.length).toEqual(1);
// });

// it('renders with a folder className', () => {
//   const folderClassName = 'Tile--folder';
//   const props = {
//     variant: 'folder'
//   };
//   const wrapper = mount(<Tile {...props} />);
//   expect(wrapper.find('button').hasClass(folderClassName)).toEqual(true);
// });

// it('Tile is a stateless functional component', () => {
//   const wrapper = shallow(<Tile />);
//   const instance = wrapper.instance();
//   expect(instance).toEqual(null);
// });

// it('on tile focus', () => {
//   const props = {
//     id: '42',
//     onFocus: jest.fn()
//   };
//   const wrapper = shallow(<Tile {...props} />);
//   wrapper.find('button').simulate('focus');
//   expect(props.onFocus.mock.calls.length).toEqual(1);
// });

// it('on tile click', () => {
//   const props = {
//     id: '42',
//     variant: 'button',
//     onClick: jest.fn()
//   };
//   const wrapper = shallow(<Tile {...props} />);
//   wrapper.find('button').simulate('click');
//   expect(props.onClick.mock.calls.length).toEqual(1);
// });

// it('on tile click and props', () => {
//   const props = {
//     id: '42',
//     variant: 'button',
//     borderColor: '#fffff',
//     backgroundColor: '#fffff',
//     variant: 'folder',
//     onClick: jest.fn(),
//     onSelect: jest.fn()
//   };
//   const wrapper = shallow(<Tile {...props} />);
// });
