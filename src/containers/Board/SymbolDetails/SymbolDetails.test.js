import React from 'react';
import ReactDOM from 'react-dom';
import {SymbolDetails} from './SymbolDetails';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SymbolDetails />, div);
});
