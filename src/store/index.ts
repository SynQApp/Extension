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

import rootReducer, { type RootState } from './combinedReducers';

const persistConfig: PersistConfig<unknown> = {
  key: 'synq-root',
  version: 1,
  storage: localStorage as PersistStorage
};

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
