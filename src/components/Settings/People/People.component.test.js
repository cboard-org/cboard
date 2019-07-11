import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';
import People from './People.component';

jest.mock('./People.messages', () => {
  return {
    people: {
      id: 'cboard.components.Settings.People.people',
      defaultMessage: 'People'
    }
  };
});

describe('People tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<People onClose={() => {}} />);
  });
});
