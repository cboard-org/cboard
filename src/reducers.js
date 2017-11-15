import { persistCombineReducers } from 'redux-persist';

import languageProviderReducer from './components/LanguageProvider/LanguageProvider.reducer';
import speechReducer from './speech/reducer';
import boardReducer from './components/Board/Board.reducer';
import gridReducer from './components/Grid/Grid.reducer';
import notificationsReducer from './components/Notifications/Notifications.reducer';
import storage from 'redux-persist/lib/storage';

const config = {
  key: 'root',
  storage
};

export default function createReducer() {
  return persistCombineReducers(config, {
    language: languageProviderReducer,
    speech: speechReducer,
    board: boardReducer,
    grid: gridReducer,
    notification: notificationsReducer
  });
}
