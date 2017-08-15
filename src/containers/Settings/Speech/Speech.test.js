import React from 'react';
import ReactDOM from 'react-dom';
import { Speech } from './Speech';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Speech />, div);
});
