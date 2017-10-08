import React from 'react';
import { shallow } from 'enzyme';
import { SymbolSearch } from './SymbolSearch';

const handleChange = jest.fn();
const intl = { formatMessage: () => {} };

it('renders without crashing', () => {
  shallow(<SymbolSearch onChange={handleChange} intl={intl} />);
});
