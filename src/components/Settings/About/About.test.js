import React from 'react';
import { shallowMatchSnapshot } from '../../common/test_utils';
import About from './About';

describe('About tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<About />);
  });
});
