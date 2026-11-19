import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Navigation from './Navigation.component';
import { NAVIGATION_BUTTONS_STYLE_SIDES } from './Navigation.constants';

jest.mock('./Navigation.messages', () => {
  return {
    boardNavigationMode: {
      id: 'boardNavigationMode',
      defaultMessage: 'Board navigation mode'
    },
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
    },
    togglePinVisibility: {
      id: 'cboard.components.Settings.Navigation.togglePinVisibility',
      defaultMessage: 'Toggle PIN visibility'
    }
  };
});

const INITIAL_NAVIGATION_SETTINGS = {
  active: false,
  shareShowActive: false,
  caBackButtonActive: false,
  bigScrollButtonsActive: false,
  navigationButtonsStyle: NAVIGATION_BUTTONS_STYLE_SIDES,
  quickUnlockActive: false,
  removeOutputActive: false,
  vocalizeFolders: false,
  quietBuilderMode: false,
  pinLockEnabled: false,
  pinCode: ''
};

let navigationSettings = INITIAL_NAVIGATION_SETTINGS;

const COMPONENT_PROPS = {
  navigationSettings,
  updateNavigationSettings: (payload) => {
    navigationSettings = { ...navigationSettings, ...payload };
  },
  changeLiveMode: () => {},
  onClose: () => {},
  onSubmit: () => {}
};

describe('Navigation tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<Navigation {...COMPONENT_PROPS} />);
  });

  test('switchs behavior', () => {
    const wrapper = shallow(<Navigation {...COMPONENT_PROPS} />).dive();
    let tree = toJson(wrapper);
    expect(tree).toMatchSnapshot();

    const state = wrapper.state();

    const switch0 = wrapper.find('WithStyles(ForwardRef(Switch))').at(0);
    switch0.simulate('change');
    const switch1 = wrapper.find('WithStyles(ForwardRef(Switch))').at(1);
    switch1.simulate('change');
    const switch2 = wrapper.find('WithStyles(ForwardRef(Switch))').at(2);
    switch2.simulate('change');
    const switch3 = wrapper.find('WithStyles(ForwardRef(Switch))').at(3);
    switch3.simulate('change');

    const newState = wrapper.state();

    expect(state.caBackButtonActive).not.toBe(newState.caBackButtonActive);
    expect(state.bigScrollButtonsActive).not.toBe(
      newState.bigScrollButtonsActive
    );
    expect(state.shareShowActive).not.toBe(newState.shareShowActive);
    expect(state.removeOutputActive).not.toBe(newState.removeOutputActive);

    tree = toJson(wrapper);
    expect(tree).toMatchSnapshot();
  });
  test('switch behavior', () => {
    const wrapper = shallow(<Navigation {...COMPONENT_PROPS} />).dive();

    const switchElement = wrapper.first('FullScreenDialog');
    switchElement.simulate('onSubmit');
  });
});

test('defaults to scroll and submits the chosen navigation mode through existing settings', () => {
  const updateNavigationSettings = jest.fn();
  const wrapper = shallow(
    <Navigation
      {...COMPONENT_PROPS}
      updateNavigationSettings={updateNavigationSettings}
    />
  ).dive();
  const select = () => wrapper.find('WithStyles(ForwardRef(Select))').at(0);
  expect(select().prop('value')).toBe('scroll');
  select().simulate('change', { target: { value: 'pagination' } });
  wrapper.instance().onSubmit();
  expect(updateNavigationSettings).toHaveBeenCalledWith(
    expect.objectContaining({ boardNavigationMode: 'pagination' })
  );
});

test('disables the big scroll buttons switch only in pagination mode', () => {
  const wrapper = shallow(
    <Navigation
      {...COMPONENT_PROPS}
      navigationSettings={{
        ...INITIAL_NAVIGATION_SETTINGS,
        bigScrollButtonsActive: true
      }}
    />
  ).dive();
  const bigScrollSwitch = () =>
    wrapper.find('WithStyles(ForwardRef(Switch))').at(1);
  const select = () => wrapper.find('WithStyles(ForwardRef(Select))').at(0);
  expect(bigScrollSwitch().prop('disabled')).toBe(false);
  select().simulate('change', { target: { value: 'pagination' } });
  expect(bigScrollSwitch().prop('disabled')).toBe(true);
  expect(bigScrollSwitch().prop('checked')).toBe(true);
  select().simulate('change', { target: { value: 'scroll' } });
  expect(bigScrollSwitch().prop('disabled')).toBe(false);
});

test.each([
  ['scroll', false, false],
  ['scroll', true, false],
  ['pagination', false, true],
  ['pagination', true, true]
])(
  'navigation buttons style in %s mode with back buttons %s is disabled: %s',
  (mode, caBackButtonActive, disabled) => {
    const wrapper = shallow(
      <Navigation
        {...COMPONENT_PROPS}
        navigationSettings={{
          ...INITIAL_NAVIGATION_SETTINGS,
          boardNavigationMode: mode,
          bigScrollButtonsActive: true,
          caBackButtonActive
        }}
      />
    ).dive();
    const styleSelect = wrapper
      .find('WithStyles(ForwardRef(Select))')
      .filterWhere(
        (select) => select.prop('name') === 'navigationButtonsStyle'
      );
    expect(styleSelect.prop('disabled')).toBe(disabled);
  }
);
