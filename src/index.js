import React from 'react';
import ReactDOM from 'react-dom';
import 'fontsource-roboto';
import { Provider } from 'react-redux';
import { BrowserRouter, HashRouter, Route } from 'react-router-dom';
import { TouchBackend } from 'react-dnd-touch-backend';
import { DndProvider } from 'react-dnd';
import { PersistGate } from 'redux-persist/es/integration/react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

import App from './components/App';
import { isCordova, onCordovaReady, initCordovaPlugins } from './cordova-util';
import './index.css';
import './polyfills';
import './env';
import LanguageProvider from './providers/LanguageProvider';
import SpeechProvider from './providers/SpeechProvider';
import ThemeProvider from './providers/ThemeProvider';
import configureStore, { getStore } from './store';
import SubscriptionProvider from './providers/SubscriptionProvider';
import { PAYPAL_CLIENT_ID } from './constants';
import { initializeAppInsights } from './appInsights';
import { useEffect } from 'react';

const setupCSP = () => {
  // Detectar entorno
  const isDevelopment = process.env.NODE_ENV === 'development';

  const localHostSources = isDevelopment
    ? 'http://localhost:* http://127.0.0.1:* ws://localhost:* ws://127.0.0.1:*'
    : '';

  const cspContent = `
    default-src 'self' https://app.cboard.io https://api.cboard.io ${localHostSources};
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.paypal.com https://www.sandbox.paypal.com ${localHostSources};
    style-src 'self' 'unsafe-inline' ${localHostSources};
    img-src * data: blob: filesystem:;
    connect-src 'self' https://api.cboard.io wss://*.microsoft.com/cognitiveservices/ https://*.paypal.com ${localHostSources};
    media-src 'self' blob: ${localHostSources};
    object-src 'none';
    frame-src 'self' https://www.paypal.com https://www.sandbox.paypal.com ${localHostSources};
    font-src 'self' data: ${localHostSources};
  `
    .replace(/\s+/g, ' ')
    .trim();

  // Añadir la meta tag dinámicamente
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = cspContent;
  document.head.appendChild(meta);
};

initializeAppInsights();
const { persistor } = configureStore();
const store = getStore();
const dndOptions = {
  enableTouchEvents: true,
  enableMouseEvents: true,
  enableKeyboardEvents: true
};

// When running in Cordova, must use the HashRouter
const PlatformRouter = isCordova() ? HashRouter : BrowserRouter;

// PayPal configuration
const paypalOptions = {
  'client-id': PAYPAL_CLIENT_ID,
  currency: 'USD',
  vault: true,
  intent: 'subscription'
};

const renderApp = () => {
  if (isCordova()) {
    initCordovaPlugins();
  }
  setupCSP();

  ReactDOM.render(
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <PayPalScriptProvider options={paypalOptions}>
          <SpeechProvider>
            <LanguageProvider>
              <ThemeProvider>
                <SubscriptionProvider>
                  <PlatformRouter>
                    <DndProvider backend={TouchBackend} options={dndOptions}>
                      <Route path="/" component={App} />
                    </DndProvider>
                  </PlatformRouter>
                </SubscriptionProvider>
              </ThemeProvider>
            </LanguageProvider>
          </SpeechProvider>
        </PayPalScriptProvider>
      </PersistGate>
    </Provider>,
    document.getElementById('root')
  );
};

isCordova() ? onCordovaReady(renderApp) : renderApp();
