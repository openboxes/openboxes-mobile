import { call, put } from 'redux-saga/effects';

import * as api from '../src/apis';
import { removeProductIdentifier, updateProductIdentifier } from '../src/apis/products';
import { hideScreenLoading, showScreenLoading } from '../src/redux/actions/main';
import { removeProductIdentifierAction, updateProductIdentifierAction } from '../src/redux/actions/products';
import { updateProductIdentifierSaga } from '../src/redux/sagas/products';
import apiClient from '../src/utils/ApiClient';

jest.mock('../src/utils/ApiClient', () => ({ __esModule: true, default: { put: jest.fn() } }));

describe('product identifier api', () => {
  beforeEach(() => (apiClient.put as jest.Mock).mockClear());

  it('sends the scanned value to set a barcode', () => {
    updateProductIdentifier('p1', 'upc', '096619756803');
    expect(apiClient.put).toHaveBeenCalledWith('/mobile/products/p1/identifiers', {
      identifier: { type: 'upc', value: '096619756803' }
    });
  });

  it('asks explicitly to remove a barcode, with no value', () => {
    removeProductIdentifier('p1', 'upc');
    expect(apiClient.put).toHaveBeenCalledWith('/mobile/products/p1/identifiers', {
      identifier: { type: 'upc', clear: true }
    });
  });
});

describe('updateProductIdentifierSaga', () => {
  it('saves through updateProductIdentifier', () => {
    const callback = jest.fn();
    const saga = updateProductIdentifierSaga(updateProductIdentifierAction('p1', 'upc', 'ABC-1', callback));
    expect(saga.next().value).toEqual(put(showScreenLoading('Saving...')));
    expect(saga.next().value).toEqual(call(api.updateProductIdentifier, 'p1', 'upc', 'ABC-1'));
    const data = { data: { id: 'p1', identifier: { type: 'upc', value: 'ABC-1' } } };
    saga.next(data);
    saga.next();
    expect(callback).toHaveBeenCalledWith(data.data);
  });

  it('removes through removeProductIdentifier', () => {
    const callback = jest.fn();
    const saga = updateProductIdentifierSaga(removeProductIdentifierAction('p1', 'upc', callback));
    expect(saga.next().value).toEqual(put(showScreenLoading('Removing...')));
    expect(saga.next().value).toEqual(call(api.removeProductIdentifier, 'p1', 'upc'));
  });

  it('hands the server message to the screen on an error', () => {
    const callback = jest.fn();
    const saga = updateProductIdentifierSaga(updateProductIdentifierAction('p1', 'upc', 'ABC-1', callback));
    saga.next();
    saga.next();
    expect(saga.throw({ message: 'Identifier value is required' }).value).toEqual(put(hideScreenLoading()));
    expect(callback).toHaveBeenCalledWith({ error: true, errorMessage: 'Identifier value is required' });
  });
});
