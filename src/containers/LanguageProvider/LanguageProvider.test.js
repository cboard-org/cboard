import React from 'react';
import ReactDOM from 'react-dom';
import LanguageProvider from './LanguageProvider';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<LanguageProvider />, div);
});
