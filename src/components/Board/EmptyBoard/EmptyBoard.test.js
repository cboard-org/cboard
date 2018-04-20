import React from 'react';
import { shallow, mount } from 'enzyme';

import EmptyBoard from './EmptyBoard.component';

it('renders without crashing', () => {
  shallow(<EmptyBoard />);
});
