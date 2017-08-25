import { combineReducers } from 'redux';

import languageProviderReducer from './containers/LanguageProvider/reducer';
import speechReducer from './speech/reducer';
import boardReducer from './containers/Board/reducer';
import gridReducer from './containers/Grid/reducer';
import notificationsReducer from './containers/Notifications/reducer';

export default function createReducer() {
  return combineReducers({
    language: languageProviderReducer,
    speech: speechReducer,
    board: boardReducer,
    grid: gridReducer,
    notification: notificationsReducer
  });
}
