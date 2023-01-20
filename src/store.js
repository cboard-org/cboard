import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistStore } from 'redux-persist';
import { UPDATE_CONNECTIVITY } from './components/App/App.constants';
import googleAnalytics from './analytics';
import createReducer from './reducers';

let store;

export default function configureStore(initialState = {}) {
  const middlewares = [thunk, googleAnalytics];
  const enhancers = [applyMiddleware(...middlewares)];

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      : compose;

  store = createStore(
    createReducer(),
    initialState,
    composeEnhancers(...enhancers)
  );

  // TODO refactor not here
  window.addEventListener('offline', () => {
    store.dispatch({
      type: UPDATE_CONNECTIVITY,
      payload: false
    });
  });

  window.addEventListener('online', () => {
    store.dispatch({
      type: UPDATE_CONNECTIVITY,
      payload: true
    });
  });

  const persistor = persistStore(store);

  return { persistor, store };
}

export const getStore = () => store;
