import { combineReducers } from 'redux';

import currentTrackReducer from './slices/currentTrack';
import playerStateReducer from './slices/playerState';
import queueReducer from './slices/queue';
import searchReducer from './slices/search';
import sessionReducer from './slices/session';

const rootReducer = combineReducers({
  currentTrack: currentTrackReducer,
  playerState: playerStateReducer,
  queue: queueReducer,
  search: searchReducer,
  session: sessionReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
