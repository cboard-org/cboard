import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';
import InputImage from './InputImage.component';

jest.mock('./InputImage.messages', () => {
  return {
    uploadImage: {
      id: 'cboard.components.InputImage.uploadImage',
      defaultMessage: 'Upload image'
    }
  }
});

describe('InputImage tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<InputImage />);
  });
});

