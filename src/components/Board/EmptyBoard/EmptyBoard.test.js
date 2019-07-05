import React from 'react';
import { mount, shallow } from 'enzyme';
import { shallowMatchSnapshot } from '../../../common/test_utils';

import EmptyBoard from './EmptyBoard.component';
jest.mock('./EmptyBoard.messages', () => {
  return {
    boardIsEmpty: {
      id: 'cboard.components.Board.boardIsEmpty',
      defaultMessage: 'This board is empty'
    }
  };
});
describe('EmptyBoard tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<EmptyBoard />);
  });
  test('mount renderer', () => {
    const wrapper = mount(<EmptyBoard />);
  });
});
