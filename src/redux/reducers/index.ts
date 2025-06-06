import { combineReducers } from 'redux';
import mainReducer from './mainReducer';
import productsReducer from './productsReducer';
import putawayReducer from './putawayReducer';
import locationsReducer from './locationsReducer';

const rootReducer = combineReducers({
  mainReducer,
  productsReducer,
  putawayReducer,
  locationsReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
