import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';

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
});
