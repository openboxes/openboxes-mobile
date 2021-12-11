/* eslint-disable complexity */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles';
import _ from 'lodash';
import { View } from 'react-native';
import showPopup from '../../components/Popup';
import InputBox from '../../components/InputBox';
import { hideScreenLoading } from '../../redux/actions/main';
import useEventListener from '../../hooks/useEventListener';
import { searchProductGloballyAction } from '../../redux/actions/products';
import { searchLocationByLocationNumber } from '../../redux/actions/locations';
import Button from '../../components/Button';
import { updateStockTransfer } from '../../redux/actions/transfers';
import { RootState } from '../../redux/reducers';

const InternalTransfer = () => {
  const barcodeData = useEventListener();
  const dispatch = useDispatch();
  const location = useSelector(
    (state: RootState) => state.mainReducer.currentLocation
  );
  const [state, setState] = useState<any>({
    productCode: '',
    product: '',
    fromData: '',
    toData: '',
    binFromLocation: '',
    binToLocation: '',
    quantity: '0',
    error: null,
    searchProductCode: null
  });

  useEffect(() => {
    if (barcodeData && Object.keys(barcodeData).length !== 0) {
      onBarCodeScanned(barcodeData.data);
    }
  }, [barcodeData]);

  const showErrorPopup = (
    data: any,
    query: any,
    actionCallback: any,
    searchBarcode: any
  ) => {
    showPopup({
      title: data.errorMessage
        ? `Failed to load search results with value = "${query}"`
        : null,
      message:
        data.errorMessage ??
        `Failed to load search results with value = "${query}"`,
      positiveButton: {
        text: 'Retry',
        callback: () => {
          dispatch(searchBarcode(query, actionCallback));
        }
      },
      negativeButtonText: 'Cancel'
    });
  };
  const onBarCodeScanned = (query: string) => {
    if (!query) {
      showPopup({
        message: 'Search query is empty',
        positiveButton: { text: 'Ok' }
      });
      return;
    }
    if (query.includes('LOG-XXX')) {
      const actionCallback = (data: any) => {
        if (data?.error) {
          showErrorPopup(
            data,
            query,
            actionCallback,
            searchProductGloballyAction
          );
        } else {
          if (data.length === 0) {
            showPopup({
              message: `No search results found for product name "${query}"`,
              positiveButton: { text: 'Ok' }
            });
          } else {
            if (data && Object.keys(data).length !== 0) {
              if (
                state.productCode === '' ||
                state.productCode === data.data[0].productCode
              ) {
                state.product = data.data[0];
                state.productCode = data.data[0].productCode;
                state.quantity = (parseInt(state.quantity, 10) + 1).toString();
              } else {
                showPopup({
                  message: `You have scanned a wrong product barcode "${query}"`,
                  positiveButton: { text: 'Ok' }
                });
              }
              setState({ ...state });
            }
          }
          dispatch(hideScreenLoading());
        }
      };
      dispatch(searchProductGloballyAction(query, actionCallback));
    } else {
      const actionLocationCallback = (data: any) => {
        if (data?.error) {
          showErrorPopup(
            data,
            query,
            actionLocationCallback,
            searchLocationByLocationNumber
          );
        } else {
          if (data.length === 0) {
            showPopup({
              message: `No search results found for Location name "${query}"`,
              positiveButton: { text: 'Ok' }
            });
          } else {
            if (data && Object.keys(data).length !== 0) {
              if (state.binFromLocation === '') {
                state.fromData = data;
                state.binFromLocation = data.name;
              } else if (state.binToLocation === '') {
                state.toData = data;
                state.binToLocation = data.name;
              }
              setState({ ...state });
            }
          }
          dispatch(hideScreenLoading());
        }
      };
      dispatch(searchLocationByLocationNumber(query, actionLocationCallback));
    }
  };

  const onChangeProduct = (text: string) => {
    setState({ ...state, productCode: text });
  };

  const onChangeFrom = (text: string) => {
    setState({ ...state, binFromLocation: text });
  };
  const onChangeBin = (text: string) => {
    setState({ ...state, binToLocation: text });
  };
  const onChangeQuantity = (text: string) => {
    setState({ ...state, quantity: text });
  };

  const onTransfer = () => {
    const request: any = {
      status: 'COMPLETED',
      stockTransferNumber: '',
      description: 'Test stock transfer from bin with quantity =',
      'origin.id': location.id,
      'destination.id': location.id,
      stockTransferItems: [
        {
          'product.id': state.product.id,
          'inventoryItem.id': '',
          'location.id': location.id,
          'originBinLocation.id': state.fromData.id,
          'destinationBinLocation.id': state.toData.id,
          quantity: state.quantity
        }
      ]
    };
    const actionCallback = (data: any) => {
      console.log('### DATA ::', data);
      if (data?.error) {
        showPopup({
          title: data.error.message ? 'Failed to update' : null,
          message: data.error.message ?? 'Failed to update',
          positiveButton: {
            text: 'Retry',
            callback: () => {
              dispatch(updateStockTransfer(request, actionCallback));
            }
          },
          negativeButtonText: 'Cancel'
        });
      } else {
        if (data.length === 0) {
          showPopup({
            message: 'No search results',
            positiveButton: { text: 'Ok' }
          });
          // eslint-disable-next-line prettier/prettier
            }
        dispatch(hideScreenLoading());
      }
    };
    dispatch(updateStockTransfer(request, actionCallback));
  };

  return (
    <View style={styles.container}>
      <View style={styles.from}>
        <InputBox
          disabled
          value={state.productCode}
          label={'Product Code'}
          onChange={onChangeProduct}
        />
        <InputBox
          disabled
          value={state.binFromLocation}
          label={'From'}
          onChange={onChangeFrom}
        />
        <InputBox
          disabled
          value={state.binToLocation}
          label={'To'}
          onChange={onChangeBin}
        />
        <InputBox
          disabled
          label={'Quantity to transfer'}
          value={state.quantity}
          keyboard={'number-pad'}
          onChange={onChangeQuantity}
        />
      </View>
      <View style={styles.bottom}>
        <Button
          title="TRANSFER"
          onPress={onTransfer}
          style={{
            marginTop: 8
          }}
        />
      </View>
    </View>
  );
};

export default InternalTransfer;
