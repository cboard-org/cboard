import { persistCombineReducers } from 'redux-persist';

import appReducer from './components/App/App.reducer';
import languageProviderReducer from './providers/LanguageProvider/LanguageProvider.reducer';
import scannerProviderReducer from './providers/ScannerProvider/ScannerProvider.reducer';
import speechProviderReducer from './providers/SpeechProvider/SpeechProvider.reducer';
import boardReducer from './components/Board/Board.reducer';
import communicatorReducer from './components/Communicator/Communicator.reducer';
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
    communicator: communicatorReducer,
    scanner: scannerProviderReducer,
    notification: notificationsReducer
  });
}
