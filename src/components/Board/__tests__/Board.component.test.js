import React from 'react';
import { shallow } from 'enzyme';

import Board from '../Board.component';
jest.mock('../Board.messages', () => ({
  editTitle: {
    id: 'cboard.components.Board.editTitle',
    defaultMessage: 'Edit Board Title'
  },
  boardTitle: {
    id: 'cboard.components.Board.boardTitle',
    defaultMessage: 'Board Title'
  }
}));

it('renders without crashing', () => {
  const props = {
    board: {
      id: 'root',
      name: 'home',
      author: 'Cboard',
      email: 'support@cboard.io',
      isPublic: true,
      hidden: false,
      tiles: [
        {
          labelKey: 'cboard.symbol.yes',
          image: '/symbols/mulberry/correct.svg',
          id: 'HJVQMR9pX5F-',
          backgroundColor: 'rgb(255, 241, 118)',
          label: 'yes'
        },
        {
          labelKey: 'symbol.descriptiveState.no',
          image: '/symbols/mulberry/no.svg',
          id: 'SkBQMRqpX5t-',
          backgroundColor: 'rgb(255, 241, 118)',
          label: 'no'
        }
      ]
    }
  };
  shallow(<Board {...props} />);
});
