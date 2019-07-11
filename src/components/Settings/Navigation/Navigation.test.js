import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Navigation from './Navigation.component';

jest.mock('./Navigation.messages', () => {
  return {
    navigation: {
      id: 'cboard.components.Settings.Navigation.navigation',
      defaultMessage: 'Navigation'
    },
    enable: {
      id: 'cboard.components.Settings.Navigation.enable',
      defaultMessage: 'Enable text...'
    },
    enableSecondary: {
      id: 'cboard.components.Settings.Navigation.enableSecondary',
      defaultMessage: 'some text secondary'
    }
  };
});

const INITIAL_NAVIGATION_SETTINGS = {
  active: false
};

let navigationSettings = INITIAL_NAVIGATION_SETTINGS;

const COMPONENT_PROPS = {
  navigationSettings,
  updateNavigationSettings: payload => {
    navigationSettings = { ...navigationSettings, ...payload };
  },
  onClose: () => {},
  onSubmit: () => {}
};

describe('Navigation tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<Navigation {...COMPONENT_PROPS} />);
  });

  test('switch behavior', () => {
    const wrapper = shallow(<Navigation {...COMPONENT_PROPS} />);
    let tree = toJson(wrapper);
    expect(tree).toMatchSnapshot();

    const state = wrapper.state();

    const switchElement = wrapper.find('WithStyles(Switch)').at(0);
    switchElement.simulate('change');

    const newState = wrapper.state();

    expect(state.active).not.toBe(newState.active);

    tree = toJson(wrapper);
    expect(tree).toMatchSnapshot();
  });
  test('switch behavior', () => {
    const wrapper = shallow(<Navigation {...COMPONENT_PROPS} />);

    const state = wrapper.state();

    const switchElement = wrapper.first('FullScreenDialog');
    switchElement.simulate('onSubmit');
  });
});
