import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';
import SelectedCounter from './SelectedCounter.component';

describe('<SelectedCounter /> tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<SelectedCounter count={1} text="abcd" />);
  });
});
