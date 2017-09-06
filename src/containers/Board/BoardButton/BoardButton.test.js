import React from 'react';
import { shallow } from 'enzyme';
import { BoardButton } from './BoardButton';

const intl = { formatMessage: () => {} };
const classes = {};

it('renders without crashing', () => {
  shallow(<BoardButton int={intl} classes={classes} />);
});
