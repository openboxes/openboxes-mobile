import {all, fork} from 'redux-saga/effects';
import auth from './auth';
import products from './products';
import locations from './locations';
import orders from './orders';
import putaway from './putaway';

export default function* root() {
  const sagas = [auth, products, locations, orders, putaway];
  yield all(sagas.map(fork));
}