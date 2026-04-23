import React from 'react';
import { mount } from 'enzyme';
import { shallowMatchSnapshot } from '../../../common/test_utils';
import SkinToneSelect from './SkinToneSelect';

jest.mock('./SkinTone.messages', () => {
  return {
    skinTone: {
      id: 'cboard.components.SkinToneSelect.skinTone',
      defaultMessage: 'Skin Tone'
    },
    clearSelection: {
      id: 'cboard.components.SkinToneSelect.clearSelection',
      defaultMessage: 'Clear selection'
    }
  };
});

const intl = { formatMessage: () => 'dummy translation' };
const SKIN_TONES = ['#f5e5de', '#a65c17', '#f4ecad', '#e3ab72', '#cf9d7c'];

describe('SkinToneSelect tests', () => {
  const props = {
    source: 'arasaac',
    intl,
    onChange: () => {},
    selectedColor: SKIN_TONES[0]
  };

  test('default renderer', () => {
    shallowMatchSnapshot(<SkinToneSelect {...props} />);
  });
  test('mount renderer', () => {
    mount(<SkinToneSelect {...props} />);
  });
});
