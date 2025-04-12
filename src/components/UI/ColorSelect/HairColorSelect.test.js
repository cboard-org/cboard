import React from 'react';
import { mount } from 'enzyme';
import { shallowMatchSnapshot } from '../../../common/test_utils';
import HairColorSelect from './HairColorSelect';

jest.mock('./HairColor.messages', () => {
  return {
    hairColor: {
      id: 'cboard.components.HairColorSelect.hairColor',
      defaultMessage: 'Skin Tone'
    },
    clearSelection: {
      id: 'cboard.components.HairColorSelect.clearSelection',
      defaultMessage: 'Clear selection'
    }
  };
});

const intl = { formatMessage: () => 'dummy translation' };
const HAIR_COLORS = [
  '#FDD700',
  '#A65E26',
  '#6A2703',
  '#EFEFEF',
  '#AAABAB',
  '#ED4120',
  '#020100'
];

describe('HairColorSelect tests', () => {
  const props = {
    source: 'arasaac',
    intl,
    onChange: () => {},
    selectedColor: HAIR_COLORS[0]
  };

  test('default renderer', () => {
    shallowMatchSnapshot(<HairColorSelect {...props} />);
  });
  test('mount renderer', () => {
    mount(<HairColorSelect {...props} />);
  });
});
