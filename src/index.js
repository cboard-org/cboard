import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, HashRouter, Route } from 'react-router-dom';
import { PersistGate } from 'redux-persist/es/integration/react';
import App from './components/App';
import { isCordova, onCordovaReady } from './cordova-util';
import './index.css';
import './polyfills';
import LanguageProvider from './providers/LanguageProvider';
import SpeechProvider from './providers/SpeechProvider';
import ThemeProvider from './providers/ThemeProvider';
import configureStore, { getStore } from './store';
import { log } from './cordova-disk-analytics';

const { persistor } = configureStore();
const store = getStore();

// When running in Cordova, must use the HashRouter
const PlatformRouter = isCordova() ? HashRouter : BrowserRouter;

const renderApp = () => {
  if (isCordova()) {
    log({ action: 'appLaunch' });
    document.addEventListener(
      'pause',
      () => log({ action: 'appPause' }),
      false
    );
    document.addEventListener(
      'resume',
      () => log({ action: 'appResume' }),
      false
    );
  }

  ReactDOM.render(
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <SpeechProvider>
          <LanguageProvider>
            <ThemeProvider>
              <PlatformRouter>
                <Route path="/" component={App} />
              </PlatformRouter>
            </ThemeProvider>
          </LanguageProvider>
        </SpeechProvider>
      </PersistGate>
    </Provider>,
    document.getElementById('root')
  );
};

isCordova() ? onCordovaReady(renderApp) : renderApp();
