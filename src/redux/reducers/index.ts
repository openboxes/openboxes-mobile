import {combineReducers} from 'redux';
import mainReducer from './mainReducer';
import productsReducer from './productsReducer';
import putawayReducer from './putawayReducer';

const rootRducer = combineReducers({
  mainReducer,
  productsReducer,
  putawayReducer,
});

export type RootState = ReturnType<typeof rootRducer>;

export default rootRducer;
