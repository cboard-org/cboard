import React from 'react';
import { shallow } from 'enzyme';
import { Speech } from './Speech';

const speech = {
  voices: [],
  voiceURI: ''
};

const classes = {};

const open = false;
it('renders without crashing', () => {
  shallow(<Speech open={open} speech={speech} classes={classes} />);
});
