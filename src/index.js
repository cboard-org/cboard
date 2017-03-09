import React from 'react';
import ReactDOM from 'react-dom';
import 'material-components-web/dist/material-components-web.css';
import 'sanitize.css/sanitize.css';

import App from './containers/App';
import LanguageProvider from './containers/LanguageProvider';

// Import i18n messages
import { translationMessages, navigatorLanguage } from './i18n';

import initReactFastclick from 'react-fastclick';
initReactFastclick();

ReactDOM.render(
  <LanguageProvider language={navigatorLanguage} messages={translationMessages}>
    <App />
  </LanguageProvider>,
  document.getElementById('root')
);
