import { combineReducers } from 'redux';
import locationsReducer from './locationsReducer';
import mainReducer from './mainReducer';
import productsReducer from './productsReducer';
import putawayReducer from './putawayReducer';
import settingsReducer from './settingsReducer';

const rootReducer = combineReducers({
  mainReducer,
  productsReducer,
  putawayReducer,
  locationsReducer,
  settingsReducer
});

// eslint-disable-next-line no-undef
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
