import React from 'react';
import { shallow } from 'enzyme';
import Toolbar from './Toolbar';

it('renders without crashing', () => {
  shallow(<Toolbar />);
});
