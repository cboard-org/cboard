import React from 'react';
import ReactDOM from 'react-dom';
import Toolbar from './Toolbar';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Toolbar />, div);
});
