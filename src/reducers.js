import {
  persistCombineReducers,
  persistReducer,
  createMigrate
} from 'redux-persist';

import localForage from 'localforage';
import localStorage from 'redux-persist/lib/storage';
import { appInsights } from './appInsights';

import appReducer from './components/App/App.reducer';
import languageProviderReducer from './providers/LanguageProvider/LanguageProvider.reducer';
import scannerProviderReducer from './providers/ScannerProvider/ScannerProvider.reducer';
import speechProviderReducer from './providers/SpeechProvider/SpeechProvider.reducer';
import boardReducer from './components/Board/Board.reducer';
import communicatorReducer from './components/Communicator/Communicator.reducer';
import notificationsReducer from './components/Notifications/Notifications.reducer';
import subscriptionProviderReducer from './providers/SubscriptionProvider/SubscriptionProvider.reducer';
import { DEFAULT_BOARDS } from '../src/helpers';

localForage.config({
  name: 'cboard',
  storeName: 'cboard_store'
});

/**
 * Creates a storage wrapper that migrates data from old storage to new storage.
 *
 * @param {Object} oldStorage - The legacy storage engine (localStorage)
 * @param {Object} newStorage - The new storage engine (localForage/IndexedDB)
 * @returns {Object} A storage engine compatible with redux-persist
 */
export const createMigratingStorage = (oldStorage, newStorage) => ({
  /**
   * Retrieves a value from storage, migrating from old to new if necessary.
   * Called by redux-persist on app initialization.
   */
  async getItem(key) {
    try {
      const newValue = await newStorage.getItem(key);
      if (newValue !== null && newValue !== undefined) {
        return newValue;
      }
    } catch (err) {
      console.warn('Cboard: IndexedDB read failed', err);
      appInsights.trackException({
        exception: err,
        properties: { key, step: 'indexeddb_read' }
      });
    }

    try {
      const oldValue = await oldStorage.getItem(key);
      if (oldValue !== null && oldValue !== undefined) {
        console.log(
          `Cboard: Migrating ${key} from localStorage to IndexedDB...`
        );
        appInsights.trackEvent({
          name: 'StorageMigration_Started',
          properties: { key }
        });
        try {
          await newStorage.setItem(key, oldValue);
          console.log(`Cboard: Successfully migrated ${key}`);
          appInsights.trackEvent({
            name: 'StorageMigration_Success',
            properties: { key }
          });
          await oldStorage.removeItem(key);
          console.log(`Cboard: Cleaned up ${key} from localStorage`);
        } catch (writeErr) {
          console.warn('Cboard: Migration write failed', writeErr);
          appInsights.trackException({
            exception: writeErr,
            properties: { key, step: 'migration_write' }
          });
        }
        return oldValue;
      }
    } catch (err) {
      console.warn('Cboard: localStorage read failed', err);
      appInsights.trackException({
        exception: err,
        properties: { key, step: 'localstorage_read' }
      });
    }

    return null;
  },

  /**
   * Saves a value to storage.
   * Called by redux-persist whenever Redux state changes.
   */
  async setItem(key, value) {
    return await newStorage.setItem(key, value);
  },

  /**
   * Removes a value from storage.
   * Called by redux-persist when purging state.
   */
  async removeItem(key) {
    return await newStorage.removeItem(key);
  }
});

const migratingStorage = createMigratingStorage(localStorage, localForage);

const boardMigrations = {
  0: state => {
    return {
      ...state,
      board: {
        ...state.board,
        boards: [...state.board.boards, ...DEFAULT_BOARDS.picSeePal]
      }
    };
  }
};

const config = {
  key: 'root',
  storage: migratingStorage,
  blacklist: ['language'],
  version: 0,
  migrate: createMigrate(boardMigrations, { debug: false })
};

const languagePersistConfig = {
  key: 'language',
  storage: migratingStorage,
  blacklist: ['langsFetched']
};

export default function createReducer() {
  return persistCombineReducers(config, {
    app: appReducer,
    language: persistReducer(languagePersistConfig, languageProviderReducer),
    speech: speechProviderReducer,
    board: boardReducer,
    communicator: communicatorReducer,
    scanner: scannerProviderReducer,
    notification: notificationsReducer,
    subscription: subscriptionProviderReducer
  });
}
