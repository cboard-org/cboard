import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';
import { FullScreenDialogContent } from './FullScreenDialogContent';

describe('FullScreenDialogContent tests', () => {
  test('default renderer', () => {
    const param = {
      className: 'test'
    };
    expect(JSON.stringify(FullScreenDialogContent(param))).toMatch(
      'FullScreenDialogContent test'
    );
  });
});
