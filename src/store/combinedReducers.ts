import { combineReducers } from 'redux';

import expandedReducer from './slices/expanded';

const rootReducer = combineReducers({
  expanded: expandedReducer
});

export default rootReducer;
