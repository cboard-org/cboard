import React from 'react';
import ReactDOM from 'react-dom';
import LocaleMenu from './LocaleMenu';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<LocaleMenu />, div);
});
