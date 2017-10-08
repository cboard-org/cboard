import React from 'react';
import { shallow } from 'enzyme';
import { Board } from './Board';

const board = {
  id: 'root',
  symbols: []
};
const navHistory = ['root'];
const intl = { formatMessage: () => {}, intlShape: {} };

it('renders without crashing', () => {
  shallow(<Board board={board} navHistory={navHistory} intl={intl} />);
});
