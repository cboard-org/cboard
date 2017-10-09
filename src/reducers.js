import { combineReducers } from 'redux';

import languageProviderReducer from './components/LanguageProvider/LanguageProvider.reducer';
import speechReducer from './speech/reducer';
import boardReducer from './components/Board/Board.reducer';
import gridReducer from './components/Grid/Grid.reducer';
import notificationsReducer from './components/Notifications/Notifications.reducer';

export default function createReducer() {
  return combineReducers({
    language: languageProviderReducer,
    speech: speechReducer,
    board: boardReducer,
    grid: gridReducer,
    notification: notificationsReducer
  });
}
