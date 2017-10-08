import React from 'react';
import { shallow } from 'enzyme';
import { SymbolDetails } from './SymbolDetails';

const intl = { formatMessage: () => {} };

it('renders without crashing', () => {
  shallow(<SymbolDetails intl={intl} />);
});
