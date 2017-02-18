import React from 'react';
import ReactDOM from 'react-dom';
import 'material-components-web/dist/material-components-web.css';
import 'sanitize.css/sanitize.css';
import injectTapEventPlugin from 'react-tap-event-plugin';



import App from './containers/App';
import LanguageProvider from './containers/LanguageProvider';

// Import i18n messages
import { translationMessages, navigatorLanguage } from './i18n';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

ReactDOM.render(
  <LanguageProvider language={navigatorLanguage} messages={translationMessages}>
    <App />
  </LanguageProvider>,
  document.getElementById('root')
);
