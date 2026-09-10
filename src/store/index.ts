import { configureStore } from '@reduxjs/toolkit';
import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector
} from 'react-redux';
import { localStorage } from 'redux-persist-webextension-storage';

import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  RESYNC,
  persistReducer,
  persistStore
} from '@plasmohq/redux-persist';
import type {
  PersistConfig,
  Storage as PersistStorage
} from '@plasmohq/redux-persist/lib/types';
import { Storage } from '@plasmohq/storage';

import type { Settings } from '~types';

import rootReducer, { type RootState } from './combinedReducers';

const persistConfig: PersistConfig<unknown> = {
  key: 'synq-root',
  version: 1,
  storage: localStorage as PersistStorage
};

// @ts-ignore
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore<RootState>({
  reducer: persistedReducer,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          RESYNC
        ]
      }
    })
});

export const persistor = persistStore(store);

/**
 * Resolves once redux-persist has finished rehydrating state from extension
 * storage.
 *
 * Rehydration is asynchronous, so `store.getState()` called too early returns
 * each reducer's hardcoded `initialState` rather than the user's persisted
 * values. For settings that is actively wrong: `preferredMusicService` defaults
 * to `'SPOTIFY'`, so an early read makes a YouTube Music user look like a
 * Spotify user and triggers "listen on Spotify instead?" prompts.
 *
 * The window is widest on a cold start, which is why the symptom was reported
 * as happening after a reboot. In MV3 the background service worker is torn
 * down and restarted frequently, so it re-runs rehydration often and hits this
 * more than the UI does.
 */
export const waitForRehydration = (): Promise<void> => {
  if (persistor.getState().bootstrapped) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    const unsubscribe = persistor.subscribe(() => {
      if (persistor.getState().bootstrapped) {
        unsubscribe();
        resolve();
      }
    });
  });
};

/**
 * Reads settings, waiting for rehydration first so the caller never observes
 * the default settings of a store that simply has not loaded yet.
 */
export const getSettings = async (): Promise<Settings> => {
  await waitForRehydration();
  return store.getState().settings;
};

// This is what makes Redux sync properly with multiple pages
// Open your extension's options page and popup to see it in action
new Storage({ area: 'local' }).watch({
  [`persist:${persistConfig.key}`]: () => {
    persistor.resync();
  }
});

export type AppDispatch = typeof store.dispatch;

// Export the hooks with the types from the mock store
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
