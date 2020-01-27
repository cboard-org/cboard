import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Scanning from './Scanning.component';
import { SCANNING_METHOD_AUTOMATIC } from './Scanning.constants';

jest.mock('./Scanning.messages', () => {
  return {
    scanning: {
      id: 'cboard.components.Settings.Scanning.scanning',
      defaultMessage: 'Scanning'
    },
    enable: {
      id: 'cboard.components.Settings.Scanning.enable',
      defaultMessage: 'Enable'
    },
    enableSecondary: {
      id: 'cboard.components.Settings.Scanning.enableSecondary',
      defaultMessage: 'Start scanning boards immediately'
    },
    delay: {
      id: 'cboard.components.Settings.Scanning.delay',
      defaultMessage: 'Time delay'
    },
    delaySecondary: {
      id: 'cboard.components.Settings.Scanning.delaySecondary',
      defaultMessage: 'Time between two consecutive scanning highlights'
    },
    method: {
      id: 'cboard.components.Settings.Scanning.method',
      defaultMessage: 'Scan method'
    },
    methodSecondary: {
      id: 'cboard.components.Settings.Scanning.methodSecondary',
      defaultMessage: 'Method to be used for board exploration'
    },
    seconds: {
      id: 'cboard.components.Settings.Scanning.seconds',
      defaultMessage: '{value} seconds'
    },
    automatic: {
      id: 'cboard.components.Settings.Scanning.automatic',
      defaultMessage: 'Automatic'
    },
    manual: {
      id: 'cboard.components.Settings.Scanning.manual',
      defaultMessage: 'Manual'
    }
  };
});

const INITIAL_SCANNING_SETTINGS = {
  active: false,
  delay: '2 seconds',
  strategy: SCANNING_METHOD_AUTOMATIC
};

let scanningSettings = INITIAL_SCANNING_SETTINGS;

const COMPONENT_PROPS = {
  scanningSettings,
  updateScanningSettings: payload => {
    scanningSettings = { ...scanningSettings, ...payload };
  },
  onClose: () => {}
};

describe('Scanning tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<Scanning {...COMPONENT_PROPS} />);
  });

  test('options behavior', () => {
    const wrapper = shallow(<Scanning {...COMPONENT_PROPS} />);
    let tree = toJson(wrapper);
    expect(tree).toMatchSnapshot();

    const state = wrapper.state();

    const switchElement = wrapper.find('WithStyles(ForwardRef(Switch))').at(0);
    switchElement.simulate('change');
    /**
    const selects = wrapper.find('Select');
    const delaySelect = selects.at(0);
    const item = delaySelect.at(0);
    item.simulate('change', { target: { value: '2 seconds' } });

    const strategySelect = selects.at(1);
    strategySelect.simulate('change', { target: { value: 'manual' } });
    */
    const newState = wrapper.state();

    expect(state.active).not.toBe(newState.active);
    expect(state.delay).toBe(newState.delay);
    expect(state.strategy).toBe(newState.strategy);

    tree = toJson(wrapper);
    expect(tree).toMatchSnapshot();
  });
});
