import React from 'react';
import ReactDOM from 'react-dom';
import SymbolSearch from './SymbolSearch';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SymbolSearch />, div);
});
