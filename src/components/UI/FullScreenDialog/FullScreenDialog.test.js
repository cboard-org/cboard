import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';
import FullScreenDialog from './FullScreenDialog';


describe('FullScreenDialog tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<FullScreenDialog />);
  });
});

