import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import 'sanitize.css/sanitize.css';
import reducers from './reducers';
import { translationMessages, navigatorLanguage } from './i18n';
import App from './containers/App';
import LanguageProvider from './containers/LanguageProvider';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const store = createStore(reducers);

ReactDOM.render(
  <LanguageProvider language={navigatorLanguage} messages={translationMessages}>
    <Provider store={store}>
      <App />
    </Provider>
  </LanguageProvider>,
  document.getElementById('root'),
);
