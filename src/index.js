import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { getStore } from './store';
import registerServiceWorker from './registerServiceWorker';
import SpeechProvider from './components/SpeechProvider';
import LanguageProvider from './components/LanguageProvider';
import App from './components/App';
import './index.css';

async function init() {
  const store = await getStore();

  ReactDOM.render(
    <Provider store={store}>
      <SpeechProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </SpeechProvider>
    </Provider>,
    document.getElementById('root')
  );
}

init();
registerServiceWorker();
