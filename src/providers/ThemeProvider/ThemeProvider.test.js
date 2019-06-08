import React from 'react';
import { shallow } from 'enzyme';

import ThemeProvider from './ThemeProvider';

it('renders without crashing', () => {
  shallow(<ThemeProvider />);
});
