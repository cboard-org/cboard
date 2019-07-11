import React from 'react';
import { shallow } from 'enzyme';

import Scroll from './Scroll';

it('renders without crashing', () => {
  shallow(<Scroll />);
});
