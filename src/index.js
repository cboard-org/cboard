import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import 'typeface-roboto';

import registerServiceWorker from './registerServiceWorker';
import configureStore, { getStore } from './store';
import SpeechProvider from './components/SpeechProvider';
import LanguageProvider from './components/LanguageProvider';
import App from './components/App';
import './index.css';

const { persistor } = configureStore();
const store = getStore();

ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <SpeechProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </SpeechProvider>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
