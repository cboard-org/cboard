import React from 'react';
import { shallow } from 'enzyme';
import { SymbolDetails } from './SymbolDetails';

it('renders without crashing', () => {
  shallow(<SymbolDetails />);
});
