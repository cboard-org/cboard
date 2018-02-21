import React from 'react';
import { shallowMatchSnapshot } from '../../common/test_utils';
import Select from './Select';

describe('Select tests', () => {
  test('default renderer', () => {
    const options = [
      { value: 'v1', label: 'l1' },
      { value: 'v2', label: 'l2' },
      { value: 'v3', label: 'l3' }
    ];
    shallowMatchSnapshot(<Select options={options} />);
  });
});
