import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { DISPLAY_SIZE_STANDARD } from './Display.constants';
import Display from './Display.component';

jest.mock('./Display.messages', () => {
  return {
    display: {
      id: 'cboard.components.Settings.Display.display',
      defaultMessage: 'Display'
    },
    Standard: {
      id: 'cboard.components.Settings.Display.StandardSize',
      defaultMessage: 'Standard'
    },
    Large: {
      id: 'cboard.components.Settings.Display.LargeSize',
      defaultMessage: 'Large'
    },
    Extralarge: {
      id: 'cboard.components.Settings.Display.ExtraLargeSize',
      defaultMessage: 'Extra Large'
    },
    uiSize: {
      id: 'cboard.components.Settings.Display.uiSize',
      defaultMessage: 'UI Size'
    },
    uiSizeSecondary: {
      id: 'cboard.components.Settings.Display.uiSizeSecondary',
      defaultMessage: 'Elements size'
    },
    fontSize: {
      id: 'cboard.components.Settings.Display.fontSize',
      defaultMessage: 'Font Size'
    },
    fontSizeSecondary: {
      id: 'cboard.components.Settings.Display.fontSizeSecondary',
      defaultMessage: 'App font size'
    }
  };
});

const COMPONENT_PROPS = {
  displaySettings: {
    uiSize: DISPLAY_SIZE_STANDARD,
    fontSize: DISPLAY_SIZE_STANDARD
  },
  intl: {
    formatMessage: msg => msg
  },
  onClose: () => {}
};

describe('Display tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<Display {...COMPONENT_PROPS} />);
  });

  test('options behavior', () => {
    const wrapper = shallow(<Display {...COMPONENT_PROPS} />);
    let tree = toJson(wrapper);
    expect(tree).toMatchSnapshot();

    const state = wrapper.state();
    let radioButton = wrapper.find('ForwardRef(RadioGroup)').at(0);
    radioButton.simulate('change', { target: { value: 'something' } });
    const newState = wrapper.state();

    expect(state.uiSize).not.toBe(newState.uiSize);
    expect(state.fontSize).toBe(newState.fontSize);

    tree = toJson(wrapper);
    expect(tree).toMatchSnapshot();
  });
});
