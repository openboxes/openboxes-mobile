import { call, put, takeLatest } from 'redux-saga/effects';
import {
  GET_PRODUCT_BY_ID_REQUEST,
  GET_PRODUCT_BY_ID_REQUEST_SUCCESS,
  GET_PRODUCTS_REQUEST,
  GET_PRODUCTS_REQUEST_SUCCESS,
  PRINT_LABEL_REQUEST,
  PRINT_LABEL_REQUEST_SUCCESS,
  SEARCH_BARCODE,
  SEARCH_BARCODE_SUCCESS,
  SEARCH_PRODUCT_BY_CODE_REQUEST,
  SEARCH_PRODUCT_BY_CODE_REQUEST_SUCCESS,
  SEARCH_PRODUCT_GLOBALY_REQUEST,
  SEARCH_PRODUCT_GLOBALY_REQUEST_SUCCESS,
  SEARCH_PRODUCTS_BY_CATEGORY_REQUEST,
  SEARCH_PRODUCTS_BY_CATEGORY_REQUEST_SUCCESS,
  SEARCH_PRODUCTS_BY_NAME_REQUEST,
  SEARCH_PRODUCTS_BY_NAME_REQUEST_SUCCESS,
  STOCK_ADJUSTMENT_REQUEST,
  STOCK_ADJUSTMENT_REQUEST_SUCCESS
} from '../actions/products';

import * as api from '../../apis';
import { hideScreenLoading, showScreenLoading } from '../actions/main';

function* getProducts(action: any) {
  try {
    yield put(showScreenLoading('Loading..'));
    const response = yield call(api.getProducts);
    yield put({
      type: GET_PRODUCTS_REQUEST_SUCCESS,
      payload: response.data
    });
    yield action.callback(response.data);
    yield put(hideScreenLoading());
  } catch (error) {
    if (error.code != 401) {
      yield action.callback({
        error: true,
        errorMessage: error.message
      });
    }
  }
}

function* searchProductsByName(action: any) {
  try {
    yield showScreenLoading('Please wait...');
    const data = yield call(api.searchProductsByName, action.payload.name);
    yield put({
      type: SEARCH_PRODUCTS_BY_NAME_REQUEST_SUCCESS,
      payload: data
    });
    yield action.payload.callback(data);
    yield put(hideScreenLoading());
  } catch (error) {
    if (error.code !== 401) {
      yield action.callback({
        error: true,
        errorMessage: error.message
      });
    }
  }
}

function* searchProductByCode(action: any) {
  try {
    yield showScreenLoading('Please wait...');
    const data = yield call(
      api.searchProductByCode,
      action.payload.productCode
    );
    yield put({
      type: SEARCH_PRODUCT_BY_CODE_REQUEST_SUCCESS,
      payload: data
    });
    yield action.callback(data);
    yield put(hideScreenLoading());
  } catch (error) {
    if (error.code != 401) {
      yield action.callback({
        error: true,
        errorMessage: error.message
      });
    }
  }
}

function* searchProductGlobally(action: any) {
  try {
    yield showScreenLoading('Please wait..');
    const data = yield call(api.searchProductGlobally, action.payload.value);
    yield put({
      type: SEARCH_PRODUCT_GLOBALY_REQUEST_SUCCESS,
      payload: data
    });
    yield action.callback(data);
    yield put(hideScreenLoading());
  } catch (error) {
    if (error.code != 401) {
      yield action.callback({
        error: true,
        errorMessage: error.message
      });
    }
  }
}

function* searchProductsByCategory(action: any) {
  try {
    yield showScreenLoading('Searching..');
    const data = yield call(
      api.searchProductsByCategory,
      action.payload.category
    );
    yield put({
      type: SEARCH_PRODUCTS_BY_CATEGORY_REQUEST_SUCCESS,
      payload: data
    });
    yield action.callback(data);
    yield put(hideScreenLoading());
  } catch (error) {
    if (error.code != 401) {
      yield action.callback({
        error: true,
        errorMessage: error.message
      });
    }
  }
}

function* searchBarcode(action: any) {
  try {
    yield showScreenLoading('Searching');
    const response = yield call(api.searchBarcode, action.payload.id);
    yield put({
      type: SEARCH_BARCODE_SUCCESS,
      payload: response.data
    });
    yield action.callback(response);
    yield put(hideScreenLoading());
  } catch (error) {
    if (error.code != 401) {
      yield action.callback({
        error: true,
        errorMessage: error.message
      });
    }
  }
}

function* getProductById(action: any) {
  try {
    yield put(showScreenLoading('Please wait..'));
    const response = yield call(api.getProductById, action.payload.id);
    yield put({
      type: GET_PRODUCT_BY_ID_REQUEST_SUCCESS,
      payload: response.data
    });
    yield action.callback(response.data);
    yield put(hideScreenLoading());
  } catch (error) {
    yield put(hideScreenLoading());
    if (error.code != 401) {
      yield action.callback({
        error: true,
        errorMessage: error.message
      });
    }
  }
}

function* printLabel(action: any) {
  try {
    yield put(showScreenLoading('Loading...'));
    const response = yield call(api.printLabel, action.payload.data);
    yield put({
      type: PRINT_LABEL_REQUEST_SUCCESS,
      payload: response
    });
    if (action.callback) {
      yield action.callback(response);
    }
    yield put(hideScreenLoading());
  } catch (e) {
    yield put(hideScreenLoading());
    if (action.callback) {
      yield action.callback({
        error: true,
        errorMessage: e.message
      });
    }
  }
}

function* stockAdjustments(action: any) {
  try {
    yield put(showScreenLoading('Please wait...'));
    const response = yield call(api.stockAdjustments, action.payload.data);
    yield put({
      type: STOCK_ADJUSTMENT_REQUEST_SUCCESS,
      payload: response
    });
    yield action.callback(response);
    yield put(hideScreenLoading());
  } catch (e) {
    yield put(hideScreenLoading());
    yield action.callback({
      error: true,
      errorMessage: e.message
    });
  }
}

export default function* watcher() {
  yield takeLatest(GET_PRODUCTS_REQUEST, getProducts);
  yield takeLatest(SEARCH_PRODUCTS_BY_NAME_REQUEST, searchProductsByName);
  yield takeLatest(SEARCH_PRODUCT_BY_CODE_REQUEST, searchProductByCode);
  yield takeLatest(SEARCH_PRODUCT_GLOBALY_REQUEST, searchProductGlobally);
  yield takeLatest(
    SEARCH_PRODUCTS_BY_CATEGORY_REQUEST,
    searchProductsByCategory
  );
  yield takeLatest(GET_PRODUCT_BY_ID_REQUEST, getProductById);
  yield takeLatest(PRINT_LABEL_REQUEST, printLabel);
  yield takeLatest(STOCK_ADJUSTMENT_REQUEST, stockAdjustments);
  yield takeLatest(SEARCH_BARCODE, searchBarcode);
}
