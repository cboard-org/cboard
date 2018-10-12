import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import { PersistGate } from 'redux-persist/es/integration/react';

import * as serviceWorker from './serviceWorker';
import configureStore, { getStore } from './store';
import SpeechProvider from './providers/SpeechProvider';
import LanguageProvider from './providers/LanguageProvider';
import ThemeProvider from './providers/ThemeProvider';
import App from './components/App';
import './index.css';

const { persistor } = configureStore();
const store = getStore();

ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <SpeechProvider>
        <LanguageProvider>
          <ThemeProvider>
            <BrowserRouter>
              <Route path="/" component={App} />
            </BrowserRouter>
          </ThemeProvider>
        </LanguageProvider>
      </SpeechProvider>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
