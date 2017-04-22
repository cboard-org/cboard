import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import 'sanitize.css/sanitize.css';
import { translationMessages, navigatorLanguage } from './i18n';
import App from './containers/App';
import LanguageProvider from './containers/LanguageProvider';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

ReactDOM.render(
  <LanguageProvider language={navigatorLanguage} messages={translationMessages}>
    <App />
  </LanguageProvider>,
  document.getElementById('root'),
);
