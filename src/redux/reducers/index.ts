import {combineReducers} from 'redux';
import mainReducer from './mainReducer';
import productsReducer from './productsReducer';
import putawayReducer from './putawayReducer';
import locationsReducer from './locationsReducer';

const rootRducer = combineReducers({
  mainReducer,
  productsReducer,
  putawayReducer,
  locationsReducer
});

export type RootState = ReturnType<typeof rootRducer>;

export default rootRducer;
