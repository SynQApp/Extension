import { combineReducers } from 'redux';

import autoplayReadyReducer from './slices/autoplayReady';
import currentTrackReducer from './slices/currentTrack';
import musicServiceTabsReducer from './slices/musicServiceTabs';
import playerStateReducer from './slices/playerState';
import popupOpenReducer from './slices/popupOpen';
import queueReducer from './slices/queue';
import searchReducer from './slices/search';
import sessionReducer from './slices/session';
import settingsReducer from './slices/settings';

const rootReducer = combineReducers({
  autoplayReady: autoplayReadyReducer,
  currentTrack: currentTrackReducer,
  musicServiceTabs: musicServiceTabsReducer,
  playerState: playerStateReducer,
  popupOpen: popupOpenReducer,
  queue: queueReducer,
  search: searchReducer,
  session: sessionReducer,
  settings: settingsReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
