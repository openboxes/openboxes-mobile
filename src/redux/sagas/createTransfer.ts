import { all, call, takeLatest } from 'redux-saga/effects';

import * as api from '../../apis';
import { parseResponse } from '../../utils/utils';
import {
  COMPLETE_CREATE_TRANSFER,
  GET_STOCK_TRANSFER_CANDIDATES,
  LOOKUP_LOCATION_BY_CODE,
  LOOKUP_TRANSFER_BARCODE,
  SEARCH_DESTINATION_BINS,
  SEARCH_PRODUCT_OR_LOCATION,
  SUBMIT_CREATE_TRANSFER
} from '../actions/createTransfer';
import { STOCK_TRANSFER_STATUS } from '../../screens/CreateTransfer/utils';
import Product from '../../data/product/Product';
import Location from '../../data/location/Location';

function* getCandidates(action: any) {
  try {
    const response = yield call(api.getStockTransferCandidates, action.payload.facilityId);
    // /candidates returns flat dot-notation keys; expand to nested before use.
    yield action.callback({ data: parseResponse(response?.data) });
  } catch (e: any) {
    yield action.callback({ error: true, errorMessage: e?.message });
  }
}

function* lookupBarcode(action: any) {
  // BE wraps "not found" as various non-404 statuses; swallow per-leg.
  let product: Product | null = null;
  try {
    const productResp = yield call(api.lookupBarcodeProduct, action.payload.code);
    product = productResp?.data;
  } catch (_e) {
    // No-op; we'll try location next.
  }
  if (product) {
    yield action.callback({ kind: 'product', product });
    return;
  }

  let location: Location | null = null;
  try {
    const locResp = yield call(api.lookupLocationByCode, action.payload.code);
    location = locResp?.data;
  } catch (_e) {
    // No-op; we'll return "not found" next.
  }
  if (location) {
    yield action.callback({ kind: 'location', location });
    return;
  }

  yield action.callback({ kind: 'none' });
}

function* lookupLocation(action: any) {
  try {
    const resp = yield call(api.lookupLocationByCode, action.payload.code);
    yield action.callback(resp);
  } catch (e: any) {
    yield action.callback({ error: true, errorMessage: e?.message });
  }
}

function* safeCall(fn: any, ...args: any[]): any {
  try {
    return yield call(fn, ...args);
  } catch (_e) {
    return null;
  }
}

function* searchProductOrLocation(action: any) {
  const term = action.payload.searchTerm;
  // Parallel, per-leg fault-tolerant: a flaky leg shouldn't blank out the other.
  const [productResp, locResp] = yield all([
    call(safeCall, api.searchProductGlobally, term),
    call(safeCall, api.searchInternalLocations, term, null)
  ]);
  if (!productResp && !locResp) {
    yield action.callback({ error: true, errorMessage: 'Search failed.' });
    return;
  }
  yield action.callback({
    products: productResp?.data ?? [],
    locations: locResp?.data ?? []
  });
}

function* searchDestBins(action: any) {
  try {
    const response = yield call(api.searchDestinationBins, action.payload.searchTerm);
    yield action.callback(response);
  } catch (e: any) {
    yield action.callback({ error: true, errorMessage: e?.message });
  }
}

function* submitCreateTransfer(action: any) {
  try {
    const response = yield call(api.postStockTransfer, action.payload);
    yield action.callback(response);
  } catch (e: any) {
    yield action.callback({ error: true, errorMessage: e?.message });
  }
}

function* completeCreateTransfer(action: any) {
  const { transferId } = action.payload;
  try {
    const getResp = yield call(api.getStockTransferById, transferId);
    // BE iterates items expecting nested keys; expand the flat-key GET body.
    const transferBody = parseResponse(getResp?.data);
    if (!transferBody) {
      yield action.callback({ error: true, errorMessage: 'Transfer not found.' });
      return;
    }
    const completedBody = { ...transferBody, status: STOCK_TRANSFER_STATUS.COMPLETED };
    const putResp = yield call(api.putStockTransfer, transferId, completedBody);
    yield action.callback(putResp);
  } catch (e: any) {
    yield action.callback({ error: true, errorMessage: e?.message });
  }
}

export default function* watcher() {
  yield takeLatest(GET_STOCK_TRANSFER_CANDIDATES, getCandidates);
  yield takeLatest(LOOKUP_TRANSFER_BARCODE, lookupBarcode);
  yield takeLatest(LOOKUP_LOCATION_BY_CODE, lookupLocation);
  yield takeLatest(SEARCH_PRODUCT_OR_LOCATION, searchProductOrLocation);
  yield takeLatest(SEARCH_DESTINATION_BINS, searchDestBins);
  yield takeLatest(SUBMIT_CREATE_TRANSFER, submitCreateTransfer);
  yield takeLatest(COMPLETE_CREATE_TRANSFER, completeCreateTransfer);
}
