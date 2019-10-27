import React from 'react';
import { mount, shallow } from 'enzyme';
import { shallowMatchSnapshot } from '../../../common/test_utils';

jest.mock('./ColorSelect.messages', () => {
  return {
    color: {
      id: 'cboard.components.ColorSelect.color',
      defaultMessage: 'Color'
    },
    clearSelection: {
      id: 'cboard.components.ColorSelect.clearSelection',
      defaultMessage: 'Clear selection'
    },
    colorScheme: {
      id: 'cboard.components.ColorSelect.colorScheme',
      defaultMessage: 'Color Scheme'
    }
  };
});
import ColorSelect from './ColorSelect';
const intl = { formatMessage: () => 'dummy translation' };
const COLORS = ['#CE93D8', '#2196F3', '#4CAF50', '#E57373'];
describe('ColorSelect tests', () => {
  const props = {
    colors: COLORS,
    intl,
    onChange: () => {},
    selectedColor: COLORS[0]
  };

  test('default renderer', () => {
    shallowMatchSnapshot(<ColorSelect {...props} />);
  });
  test('mount renderer', () => {
    const wrapper = mount(<ColorSelect {...props} />);
  });
});
