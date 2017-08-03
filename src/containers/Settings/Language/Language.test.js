import React from 'react';
import ReactDOM from 'react-dom';
import Language from './Language';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Language />, div);
});
