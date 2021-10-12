import {takeLatest, put, call} from 'redux-saga/effects';
import {
  GET_PRODUCTS_REQUEST,
  GET_PRODUCTS_REQUEST_SUCCESS,
  SEARCH_PRODUCTS_BY_NAME_REQUEST,
  SEARCH_PRODUCTS_BY_NAME_REQUEST_SUCCESS,
  SEARCH_PRODUCT_BY_CODE_REQUEST,
  SEARCH_PRODUCT_BY_CODE_REQUEST_SUCCESS,
  SEARCH_PRODUCT_GLOBALY_REQUEST,
  SEARCH_PRODUCT_GLOBALY_REQUEST_SUCCESS,
  SEARCH_PRODUCTS_BY_CATEGORY_REQUEST,
  SEARCH_PRODUCTS_BY_CATEGORY_REQUEST_SUCCESS,
} from '../actions/products';

import * as api from '../../apis';
import {hideScreenLoading, showScreenLoading} from '../actions/main';

function* getProducts(action: any) {
  try {
    yield showScreenLoading('Fetching products');
    const response = yield call(api.getProducts);
    yield put({
      type: GET_PRODUCTS_REQUEST_SUCCESS,
      payload: response.data,
    });
    yield action.callback(response.data);
    yield hideScreenLoading();
  } catch (e) {
    console.log('function* getProducts', e.message);
    yield action.callback({
      error: true,
      message: e.message,
    });
  }
}

function* searchProductsByName(action: any) {
  try {
    yield showScreenLoading(
      `Searching for products with name "${action.payload.name}"`,
    );
    const data = yield call(api.searchProductsByName, action.payload.name);
    yield put({
      type: SEARCH_PRODUCTS_BY_NAME_REQUEST_SUCCESS,
      payload: data,
    });
    yield action.payload.callback(data);
    yield hideScreenLoading();
  } catch (e) {
    console.log('function* searchProducts', e.message);
    yield action.callback({
      error: true,
      message: e.message,
    });
  }
}

function* searchProductByCode(action: any) {
  try {
    yield showScreenLoading(
      `Searching for products with product code "${action.payload.productCod}"`,
    );
    const data = yield call(
      api.searchProductByCode,
      action.payload.productCode,
    );
    yield put({
      type: SEARCH_PRODUCT_BY_CODE_REQUEST_SUCCESS,
      payload: data,
    });
    yield action.callback(data);
    yield hideScreenLoading();
  } catch (e) {
    console.log('function* searchProducts', e.message);
    yield action.callback({
      error: true,
      message: e.message,
    });
  }
}

function* searchProductGlobally(action: any) {
  try {
    yield showScreenLoading(
      `Searching for products with value "${action.payload.value}"`,
    );
    const data = yield call(api.searchProductGlobally, action.payload.value);
    yield put({
      type: SEARCH_PRODUCT_GLOBALY_REQUEST_SUCCESS,
      payload: data,
    });
    yield action.callback(data);
    yield hideScreenLoading();
  } catch (e) {
    console.log('function* searchProductGlobally', e);
    yield action.callback({
      error: true,
      message: e.message,
    });
  }
}

function* searchProductsByCategory(action: any) {
  try {
    yield showScreenLoading(
      `Searching for products in category "${action.payload.category.name}"`,
    );
    const data = yield call(
      api.searchProductsByCategory,
      action.payload.category,
    );
    yield put({
      type: SEARCH_PRODUCTS_BY_CATEGORY_REQUEST_SUCCESS,
      payload: data,
    });
    yield action.callback(data);
    yield hideScreenLoading();
  } catch (e) {
    console.log('function* searchProductsByCategory', e);
    yield action.callback({
      error: true,
      message: e.message,
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
    searchProductsByCategory,
  );
}
