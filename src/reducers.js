import { combineReducers } from 'redux';

import languageProviderReducer from './components/LanguageProvider/reducer';
import speechReducer from './speech/reducer';
import boardReducer from './components/Board/reducer';
import gridReducer from './components/Grid/reducer';
import notificationsReducer from './components/Notifications/reducer';

export default function createReducer() {
  return combineReducers({
    language: languageProviderReducer,
    speech: speechReducer,
    board: boardReducer,
    grid: gridReducer,
    notification: notificationsReducer
  });
}
