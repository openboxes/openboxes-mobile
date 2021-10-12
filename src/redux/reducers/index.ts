import {combineReducers} from 'redux';
import mainReducer from './mainReducer';
import productsReducer from './productsReducer';

const rootRducer = combineReducers({
  mainReducer,
  productsReducer,
});

export type RootState = ReturnType<typeof rootRducer>;

export default rootRducer;
