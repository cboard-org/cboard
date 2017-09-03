import React from 'react';
import { shallow } from 'enzyme';
import EditToolbar from './EditToolbar';

it('renders without crashing', () => {
  shallow(<EditToolbar />);
});
