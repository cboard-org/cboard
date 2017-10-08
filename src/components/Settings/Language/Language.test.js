import React from 'react';
import { shallow } from 'enzyme';
import { Language } from './Language';

const locale = 'en';

it('renders without crashing', () => {
  shallow(<Language locale={locale} />);
});
