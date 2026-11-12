import React from 'react';
import { Alert } from 'react-native';
import renderer, { act } from 'react-test-renderer';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { runSaga } from 'redux-saga';

import * as api from '../src/apis';
import ViewAvailableItem from '../src/screens/ViewAvailableItem';
import Destination from '../src/screens/CreateTransfer/CreateTransferDestinationScreen';
import watcher from '../src/redux/sagas/createTransfer';
import { SEARCH_DESTINATION_BINS } from '../src/redux/actions/createTransfer';
import { isReceivingLocation, toSelectedInventoryItem } from '../src/screens/CreateTransfer/utils';
import { replace } from '../src/NavigationService';
import apiClient from '../src/utils/ApiClient';

jest.mock('@react-navigation/native', () => ({ useNavigation: jest.fn(), useRoute: jest.fn() }));
jest.mock('react-redux', () => ({ useDispatch: jest.fn(), useSelector: jest.fn() }));
jest.mock('../src/apis', () => ({ searchDestinationBins: jest.fn() }));
jest.mock('../src/utils/ApiClient', () => ({ get: jest.fn() }));
jest.mock('../src/NavigationService', () => ({ replace: jest.fn() }));
jest.mock('../src/assets/images/icon_default_product.svg', () => 'ProductIcon');
jest.mock('../src/components/Button', () => 'Button');
jest.mock('../src/components/Icons', () => ({ LocationIcon: 'LocationIcon', QuantityIcon: 'QuantityIcon' }));
jest.mock('../src/components/ScannerInput', () => ({ ScannerInput: 'ScannerInput' }));
jest.mock('../src/components/ScanErrorText', () => ({ ScanErrorText: 'ScanErrorText' }));
jest.mock('../src/components/SearchButton', () => ({ SearchButton: 'SearchButton' }));
jest.mock('../src/components/SearchButton/useSearchButton', () => ({
  useSearchButton: () => ({ isSearchOpen: false, searchButtonProps: {} })
}));
jest.mock('../src/screens/CreateTransfer/CreateTransferDetailsPanel', () => 'DetailsPanel');
jest.mock('../src/screens/CreateTransfer/styles', () => ({}));
jest.mock('../src/screens/ViewAvailableItem/styles', () => ({}));
jest.mock('../src/utils/Theme', () => ({ colors: { primary: 'blue' } }));
jest.mock('react-native-paper', () => ({ Chip: 'Chip', Divider: 'Divider', Text: 'Text', Title: 'Title' }));
const mockFail = jest.fn();
jest.mock('../src/hooks/useScanField', () => ({
  useScanField: () => ({ pass: jest.fn(), fail: mockFail, setValue: jest.fn(), onChange: jest.fn() })
}));

const candidate = {
  productAvailabilityId: 'availability',
  product: { id: 'product', productCode: 'P1', name: 'Product' },
  inventoryItem: { id: 'lot' },
  originBinLocation: { id: 'source', name: 'Source' },
  lotNumber: 'L1',
  expirationDate: null,
  quantityOnHand: 10,
  quantityNotPicked: 3
};
const inventoryItem = {
  product: candidate.product,
  inventoryItem: candidate.inventoryItem,
  binLocation: candidate.originBinLocation,
  quantityAvailable: 999
};
const dispatch = jest.fn();
const navigate = jest.fn();
beforeEach(() => {
  jest.clearAllMocks();
  (useDispatch as jest.Mock).mockReturnValue(dispatch);
  (useNavigation as jest.Mock).mockReturnValue({ navigate });
  (useSelector as jest.Mock).mockImplementation((select) =>
    select({
      mainReducer: { currentLocation: { id: 'facility' } },
      settingsReducer: { productSummaryConfig: {} }
    })
  );
  (useRoute as jest.Mock).mockReturnValue({ params: { item: inventoryItem } });
  jest.spyOn(Alert, 'alert').mockImplementation(() => {});
});

it.each([
  [{ supportedActivities: ['RECEIVE_STOCK'] }, true],
  [{ supportedActivities: [], locationType: { supportedActivities: ['RECEIVE_STOCK'] } }, true],
  [{ locationType: { supportedActivities: ['RECEIVE_STOCK'] } }, true],
  [{ supportedActivities: ['NONE'], locationType: { supportedActivities: ['RECEIVE_STOCK'] } }, false],
  [{ supportedActivities: ['PICK_STOCK'] }, false]
])('uses effective receiving activities for %j', (location, expected) => {
  expect(isReceivingLocation(location)).toBe(expected);
});

it('filters receiving results even when the server ignores ignoreActivityCodes', async () => {
  const watcherEffects = Array.from(watcher());
  const worker = watcherEffects.find((effect: any) => effect.payload.args[0] === SEARCH_DESTINATION_BINS) as any;
  const callback = jest.fn();
  (api.searchDestinationBins as jest.Mock).mockResolvedValue({
    data: [
      { id: 'receiving', supportedActivities: ['RECEIVE_STOCK'] },
      { id: 'inherited', locationType: { supportedActivities: ['RECEIVE_STOCK'] } },
      { id: 'display', supportedActivities: ['PICK_STOCK'] }
    ]
  });
  await runSaga(
    { getState: () => ({ mainReducer: { currentLocation: { id: 'facility' } } }) },
    worker.payload.args[1],
    { payload: { searchTerm: 'bin' }, callback }
  ).toPromise();
  expect(api.searchDestinationBins).toHaveBeenCalledWith('bin', 'facility');
  expect(callback.mock.calls[0][0].data.map((location: any) => location.id)).toEqual(['display']);
});

it('scopes destination search to the selected warehouse', () => {
  const { searchDestinationBins } = jest.requireActual('../src/apis/createTransfer');
  searchDestinationBins('RACK 1', 'facility/id');
  expect(apiClient.get).toHaveBeenCalledWith(expect.stringContaining('parentLocation.id=facility%2Fid'));
  expect(apiClient.get).toHaveBeenCalledWith(expect.stringContaining('searchTerm=RACK%201'));
});

function renderInventory() {
  const tree = renderer.create(<ViewAvailableItem />);
  const transfer = () => tree.root.findAllByType('Button' as any).find((button) => button.props.title === 'Transfer')!;
  act(() => transfer().props.onPress());
  return { transfer, callback: dispatch.mock.calls[0][0].callback };
}

it('resolves the flat inventoryItem.id returned by the live product details API', () => {
  (useRoute as jest.Mock).mockReturnValue({
    params: {
      item: {
        product: candidate.product,
        'inventoryItem.id': candidate.inventoryItem.id,
        binLocation: candidate.originBinLocation,
        quantityAvailable: 15
      }
    }
  });
  const { callback } = renderInventory();
  act(() => callback({ data: [candidate] }));
  expect(navigate).toHaveBeenCalledWith('CreateTransferQuantity', {
    item: expect.objectContaining({ inventoryItemId: 'lot', quantityNotPicked: 3 })
  });
});

it('opens the shared quantity screen with fresh availability for the exact product, lot and bin', () => {
  const { transfer, callback } = renderInventory();
  expect(transfer().props.disabled).toBe(true);
  act(() => transfer().props.onPress());
  expect(dispatch).toHaveBeenCalledTimes(1);
  act(() =>
    callback({
      data: [
        { ...candidate, inventoryItem: { id: 'other-lot' } },
        { ...candidate, originBinLocation: { id: 'other-bin' } },
        { ...candidate, product: { id: 'other-product' } },
        candidate
      ]
    })
  );
  expect(navigate).toHaveBeenCalledWith('CreateTransferQuantity', {
    item: expect.objectContaining({
      inventoryItemId: 'lot',
      productAvailabilityId: 'availability',
      quantityNotPicked: 3
    })
  });
  expect(transfer().props.disabled).toBe(false);
});

it.each([{ data: [] }, { data: [{ ...candidate, quantityNotPicked: 0 }] }, { error: true, errorMessage: 'Offline' }])(
  'does not transfer unavailable inventory or proceed after a failed fetch: %j',
  (response) => {
    const { transfer, callback } = renderInventory();
    act(() => callback(response));
    expect(navigate).not.toHaveBeenCalled();
    expect(Alert.alert).toHaveBeenCalled();
    expect(transfer().props.disabled).toBe(false);
  }
);

it('rejects receiving scans and the source bin, then allows a valid destination', () => {
  (useRoute as jest.Mock).mockReturnValue({ params: { item: toSelectedInventoryItem(candidate), quantity: 2 } });
  const tree = renderer.create(<Destination />);
  const scan = () => tree.root.findByType('ScannerInput' as any).props.onSubmit('BIN');
  act(scan);
  act(() => dispatch.mock.calls[0][0].callback({ data: { id: 'receiving', supportedActivities: ['RECEIVE_STOCK'] } }));
  expect(mockFail).toHaveBeenCalledWith(expect.stringContaining('Receiving'));
  expect(dispatch).toHaveBeenCalledTimes(1);
  act(scan);
  act(() => dispatch.mock.calls[1][0].callback({ data: candidate.originBinLocation }));
  expect(mockFail).toHaveBeenCalledWith(expect.stringContaining('same as source'));
  act(scan);
  act(() =>
    dispatch.mock.calls[2][0].callback({
      data: { id: 'other-bin', parentLocation: { id: 'other-facility' } }
    })
  );
  expect(mockFail).toHaveBeenCalledWith(expect.stringContaining('current warehouse'));
  act(scan);
  act(() =>
    dispatch.mock.calls[3][0].callback({
      data: { id: 'display', name: 'Display', parentLocation: { id: 'facility' }, supportedActivities: ['PICK_STOCK'] }
    })
  );
  const submit = dispatch.mock.calls[4][0];
  expect(submit.payload.stockTransferItems[0]).toEqual(
    expect.objectContaining({
      destinationBinLocation: { id: 'display' },
      inventoryItem: { id: 'lot' },
      quantity: 2,
      status: 'PENDING'
    })
  );
  act(() => submit.callback({ data: { id: 'transfer' } }));
  expect(replace).toHaveBeenCalledWith('CreateTransferComplete', expect.objectContaining({ transferId: 'transfer' }));
});
