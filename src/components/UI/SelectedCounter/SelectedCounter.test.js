import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';
import SelectedCounter from './SelectedCounter.component';

jest.mock('./SelectedCounter.messages', () => {
  return {
    items: {
      id: 'cboard.components.SelectedCounter.items',
      defaultMessage: 'items'
    }
  };
});

describe('<SelectedCounter /> tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<SelectedCounter count={1} text="abcd" />);
  });
});
