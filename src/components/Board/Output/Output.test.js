import React from 'react';
import { shallow } from 'enzyme';
import { Output } from './Output';

const intl = { formatMessage: () => {} };
const classes = {};

it('renders without crashing', () => {
  shallow(<Output int={intl} classes={classes} />);
});
