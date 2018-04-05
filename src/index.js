import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import { PersistGate } from 'redux-persist/es/integration/react';

import configureStore, { getStore } from './store';
import SpeechProvider from './providers/SpeechProvider';
import LanguageProvider from './providers/LanguageProvider';
import App from './components/App';
import './index.css';

const { persistor } = configureStore();
const store = getStore();

ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <SpeechProvider>
        <LanguageProvider>
          <BrowserRouter>
            <Route path="/" component={App} />
          </BrowserRouter>
        </LanguageProvider>
      </SpeechProvider>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);
