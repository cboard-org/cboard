import React from 'react';
import { shallow } from 'enzyme';
import { Symbol } from './Symbol';

const intl = { formatMessage: () => {} };
const classes = {};

it('renders without crashing', () => {
  shallow(<Symbol int={intl} classes={classes} />);
});
