import {all, fork} from 'redux-saga/effects';
import auth from './auth';
import products from './products';
import locations from './locations';
import orders from './orders';

export default function* root() {
  const sagas = [auth, products, locations, orders];
  yield all(sagas.map(fork));
}
