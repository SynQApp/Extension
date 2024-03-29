import { combineReducers } from 'redux';

import musicServiceTabsReducer from './slices/musicServiceTabs';
import popupOpenReducer from './slices/popupOpen';
import queueReducer from './slices/queue';
import searchReducer from './slices/search';
import settingsReducer from './slices/settings';

const rootReducer = combineReducers({
  musicServiceTabs: musicServiceTabsReducer,
  popupOpen: popupOpenReducer,
  queue: queueReducer,
  search: searchReducer,
  settings: settingsReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
