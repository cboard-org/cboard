import React from 'react';
import { shallow } from 'enzyme';
import { Backup } from './Backup';

const open = false;

it('renders without crashing', () => {
  shallow(<Backup open={open} />);
});
