import {all, fork} from 'redux-saga/effects';
import auth from './auth';
import products from './products';
import locations from './locations';
import orders from './orders';
import putaway from './putaway';
import transfers from './transfers';

export default function* root() {
  const sagas = [auth, products, locations, orders, putaway,transfers];
  yield all(sagas.map(fork));
}
