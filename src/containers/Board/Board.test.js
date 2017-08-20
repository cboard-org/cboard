import React from 'react';
import { shallow } from 'enzyme';
import { Board } from './Board';

const board = {
  id: 'root',
  symbols: []
};
const navigationHistory = ['root'];

it('renders without crashing', () => {
  shallow(<Board board={board} navigationHistory={navigationHistory} />);
});
