import React from 'react';
import ReactDOM from 'react-dom';
import FontFaceObserver from 'fontfaceobserver';
import 'sanitize.css/sanitize.css';

import App from './containers/App';
import LanguageProvider from './containers/LanguageProvider';

// Import i18n messages
import { translationMessages, navigatorLanguage } from './i18n';

// Observe loading of Open Sans (to remove open sans, remove the <link> tag in
// the index.html file and this observer)
const openSansObserver = new FontFaceObserver('Open Sans', {});

// When Open Sans is loaded, add a font-family using Open Sans to the body
openSansObserver.load().then(() => {
  document.body.classList.add('fontLoaded');
}, () => {
  document.body.classList.remove('fontLoaded');
});

ReactDOM.render(
  <LanguageProvider language={navigatorLanguage} messages={translationMessages}>
    <App />
  </LanguageProvider>,
  document.getElementById('root')
);
