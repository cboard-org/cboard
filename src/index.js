import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import 'sanitize.css/sanitize.css';
import App from './containers/App';
import LangProvider from './containers/LanguageProvider';
import { translationMessages, navigatorLanguage } from './i18n';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

ReactDOM.render(
  <LangProvider language={navigatorLanguage} messages={translationMessages}>
    <App />
  </LangProvider>,
  document.getElementById('root'),
);
