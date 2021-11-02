import {all, fork} from 'redux-saga/effects';
import auth from './auth';
import products from './products';
import locations from './locations';
import orders from './orders';
import putaway from './putaway';
import transfer from './transfer';
import transfers from './transfers';
import inbound from './inbound';
import packing from './packing'

export default function* root() {
    const sagas = [auth, products, locations, orders, putaway, transfer, transfers, inbound, packing];
    yield all(sagas.map(fork));
}
