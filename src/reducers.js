import { persistCombineReducers } from 'redux-persist';

import appReducer from './components/App/App.reducer';
import languageProviderReducer from './providers/LanguageProvider/LanguageProvider.reducer';
import speechProviderReducer from './providers/SpeechProvider/SpeechProvider.reducer';
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
    app: appReducer,
    language: languageProviderReducer,
    speech: speechProviderReducer,
    board: boardReducer,
    grid: gridReducer,
    notification: notificationsReducer
  });
}
