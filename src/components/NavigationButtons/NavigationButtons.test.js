import React from 'react';
import { shallowMatchSnapshot } from '../../common/test_utils';
import NavigationButtons from './NavigationButtons.component';

let navHistory = ['some', 'id', 'toCheck', 'everything'];

const COMPONENT_PROPS = {
  navHistory,
  previousBoard: () => {
    navHistory.pop();
  },
  toRootBoard: () => {
    navHistory = [navHistory[0]];
  }
};

describe('NavigationButtons tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<NavigationButtons {...COMPONENT_PROPS} />);
  });
});
