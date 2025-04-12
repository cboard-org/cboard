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
const SKIN_TONES = ['#F5E5DE', '#A65C17', '#F4ECAD', '#E3AB72', '#CF9D7C'];

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
