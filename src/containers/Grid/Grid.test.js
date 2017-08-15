import React from 'react';
import ReactDOM from 'react-dom';
import { Grid } from './Grid';

fit('renders without crashing', () => {
  global.matchMedia = jest
  const div = document.createElement('div');
  ReactDOM.render(<Grid size={{width: 800, height: 600}}/>, div);
});
