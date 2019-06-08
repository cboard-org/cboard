import React from 'react';
import { shallow } from 'enzyme';

import NavBar from './NavBar';

it('renders without crashing', () => {
  shallow(<NavBar />);
});
