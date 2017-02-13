import React from 'react';
import ReactDOM from 'react-dom';
import 'sanitize.css/sanitize.css';

import App from './containers/App';
import LanguageProvider from './containers/LanguageProvider';

// Import i18n messages
import { translationMessages, navigatorLanguage } from './i18n';

ReactDOM.render(
  <LanguageProvider locale={navigatorLanguage} messages={translationMessages}>
    <App />
  </LanguageProvider>,
  document.getElementById('root')
);
