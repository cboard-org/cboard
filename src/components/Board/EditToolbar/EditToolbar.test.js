import React from 'react';
import { shallow } from 'enzyme';

import EditToolbar from './EditToolbar.component';

it('renders without crashing', () => {
  shallow(<EditToolbar selectedItemsCount={42} />);
});
