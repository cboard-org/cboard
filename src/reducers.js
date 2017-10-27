import { combineReducers } from 'redux';

import languageProviderReducer from './components/LanguageProvider/LanguageProvider.reducer';
import speechProviderReducer from './components/SpeechProvider/SpeechProvider.reducer';
import boardReducer from './components/Board/Board.reducer';
import gridReducer from './components/Grid/Grid.reducer';
import notificationsReducer from './components/Notifications/Notifications.reducer';

export default function createReducer() {
  return combineReducers({
    language: languageProviderReducer,
    speech: speechProviderReducer,
    board: boardReducer,
    grid: gridReducer,
    notification: notificationsReducer
  });
}
