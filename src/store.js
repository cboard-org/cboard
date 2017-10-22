import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, autoRehydrate } from 'redux-persist';

import googleAnalytics from './analytics';
import createReducer from './reducers';
let persistedStore;

export default function configureStore(initialState = {}) {
  const middlewares = [thunk, googleAnalytics];
  const enhancers = [applyMiddleware(...middlewares), autoRehydrate()];

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      : compose;

  return new Promise((resolve, reject) => {
    const store = createStore(
      createReducer(),
      initialState,
      composeEnhancers(...enhancers)
    );
    persistStore(store, {}, () => {
      resolve(store);
    });
  });
}

export function getStore(initialState = {}) {
  if (persistedStore) {
    return Promise.resolve(persistedStore);
  }
  return configureStore(initialState).then(store => {
    persistedStore = store;
    return store;
  });
}
