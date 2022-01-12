import React, {useEffect, useState} from 'react';
import _ from 'lodash';
import styles from './styles';
import { ListRenderItemInfo, ScrollView, Text, View, ToastAndroid, Alert } from 'react-native';
import { pickListVMMapper } from './PickListVMMapper';
import { hideScreenLoading } from '../../redux/actions/main';
import { useDispatch } from 'react-redux';
import showPopup from '../../components/Popup';
import { submitPickListItem } from '../../redux/actions/orders';
import {
  searchProductByCodeAction,
  searchProductGloballyAction,
} from '../../redux/actions/products';
import { searchLocationByLocationNumber } from '../../redux/actions/locations';
import { useNavigation, useRoute } from '@react-navigation/native';
import Button from '../../components/Button';
import useEventListener from '../../hooks/useEventListener';
import InputBox from '../../components/InputBox';
import { device } from '../../constants';
import { PicklistItem } from '../../data/picklist/PicklistItem';
import InputSpinner from '../../components/InputSpinner';

const PickOrderItem = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const barcodeData = useEventListener();
  const [pickListItemData, setPickListItemData] = useState<any>(null);
  const [state, setState] = useState<any>({
    error: '',
    pickListItem: null,
    order: null,
    productSearchQuery: '',
    binLocationSearchQuery: '',
    quantityPicked: '0',
    product: null,
    productCode: '',
    binLocation: null,
    lotNumber: '',
    binLocationName: '',
  });
  const navigation = useNavigation();
  const vm = pickListVMMapper(route.params);

  useEffect(() => {
    if (barcodeData && Object.keys(barcodeData).length !== 0) {
      onBarCodeScanned(barcodeData.data);
    }
  }, [barcodeData]);

  const showErrorPopup = (
    data: any,
    query: any,
    actionCallback: any,
    searchBarcode: any,
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
        },
      },
      negativeButtonText: 'Cancel',
    });
  };

  const onBarCodeScanned = (query: string) => {
    if (!query) {
      showPopup({
        message: 'Search query is empty',
        positiveButton: {text: 'Ok'},
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
            searchProductGloballyAction,
          );
        } else {
          if (data.length == 0) {
            showPopup({
              message: `No search results found for product name "${query}"`,
              positiveButton: {text: 'Ok'},
            });
          } else {
            if (data && Object.keys(data).length !== 0) {
              if (
                state.pickListItem?.productCode !== data.data[0].productCode
              ) {
                showPopup({
                  message: `You have scanned a wrong product barcode "${query}"`,
                  positiveButton: {text: 'Ok'},
                });
              } else {
                state.quantityPicked = (
                  parseInt(state.quantityPicked, 10) + 1
                ).toString();
                state.product = data.data[0];
                state.productCode = data.data[0].productCode;
              }
              setState({...state});
            }
          }
          dispatch(hideScreenLoading());
        }
      };
      dispatch(searchProductGloballyAction(query, actionCallback));
    } else {
      const actionBinLocationCallback = (data: any) => {
        if (data?.error) {
          showErrorPopup(
            data,
            query,
            actionBinLocationCallback,
            searchLocationByLocationNumber,
          );
        } else {
          if (data.length == 0) {
            showPopup({
              message: `No search results found for Location name "${query}"`,
              positiveButton: {text: 'Ok'},
            });
          } else {
            if (data && Object.keys(data).length !== 0) {
              if (state.binLocation === '' || state.binLocation === data.name) {
                state.binLocation = data;
                state.binLocationSearchQuery = '';
              }
              setState({...state});
            } else {
              showPopup({
                message: `You have scanned a wrong bin location barcode "${query}"`,
                positiveButton: {text: 'Ok'},
              });
            }
          }
          dispatch(hideScreenLoading());
        }
      };
      dispatch(
        searchLocationByLocationNumber(query, actionBinLocationCallback),
      );
    }
  };

  useEffect(() => {
    const pickListObj =  vm?.pickListItem;
    setPickListItemData({...pickListObj, ...{quantityToPick: vm?.pickListItem?.quantityRemaining}});
  }, []);

  const formSubmit = (itemToSave: any) => {
    try {
      let errorTitle = '';
      let errorMessage = '';
      if (!Number(itemToSave.quantityToPick)) {
        errorTitle = 'Quantity To Pick!';
        errorMessage = 'Please pick some quantity.';
    } else if (Number(itemToSave.quantityToPick) > Number(itemToSave.quantityRemaining)) {
        errorTitle = 'Quantity To Pick!';
        errorMessage = 'Quantity to pick cannot exceed quantity remaining!';
      }
      if (errorTitle != '') {
        showPopup({
          title: errorTitle,
          message: errorMessage,
          negativeButtonText: 'Cancel',
        });
        return Promise.resolve(null);
      }

      const requestBody = {
        'product.id': itemToSave['product.id'],
        productCode: itemToSave.productCode,
        quantityPicked: itemToSave.quantityPicked,
      };
      const actionCallback = (data: any) => {
        if (data?.error) {
          showPopup({
            title: data.message ? 'Failed to load results' : null,
            message: data.message || 'Failed to load results',
            negativeButtonText: 'Cancel',
          });
        } else {
          const {order, pickListItem}: any = route.params;
          ToastAndroid.show('Picked item successfully!', ToastAndroid.SHORT);
          navigation.goBack();
          route?.params?.callBackUpdate({...itemToSave,...{quantityRemaining: (itemToSave?.quantityRemaining - itemToSave?.quantityPicked)}});
        }
      };
      dispatch(
        submitPickListItem(
          itemToSave.id as string,
          requestBody,
          actionCallback,
        )
      );
    } catch (e) {
      const title = e.message ? 'Failed submit item' : null;
      const message = e.message ?? 'Failed submit item';
      showPopup({
        title: title,
        message: message,
        negativeButtonText: 'Cancel',
      });
      return Promise.resolve(null);
    }
  };

  const productSearchQueryChange = (query: string) => {
    setState({
      ...state,
      productSearchQuery: query,
    });
    onProductBarCodeSearchQuerySubmitted();
  };

  const onProductBarCodeSearchQuerySubmitted = () => {
    if (!state.productCode) {
      showPopup({
        message: 'Search query is empty',
        positiveButton: {
          text: 'Ok',
        },
      });
      return;
    }

    const actionCallback = (data: any) => {
      if (!data || data.data.length == 0) {
        showPopup({
          message: 'Product not found with ProductCode:' + state.productCode,
          positiveButton: {
            text: 'Ok',
          },
        });
        setState({
          ...state,
          productCode: '',
          productSearchQuery: '',
        });
        return;
      } else if (data.data.length == 1) {
        setState({
          ...state,
          product: data.data[0],
          quantityPicked: (parseInt(state.quantityPicked, 10) + 1).toString(),
          productSearchQuery: '',
        });
      }
    };
    dispatch(searchProductByCodeAction(state.productCode, actionCallback));
  };

  const onBinLocationBarCodeSearchQuerySubmitted = () => {
    if (!state.binLocationName) {
      showPopup({
        message: 'Search query is empty',
        positiveButton: {
          text: 'Ok',
        },
      });
      return;
    }

    const actionCallback = (location: any) => {
      if (!location || location.error) {
        showPopup({
          message:
            'Bin Location not found with LocationNumber:' +
            state.binLocationName,
          positiveButton: {
            text: 'Ok',
          },
        });
        setState({
          ...state,
          binLocationName: '',
          binLocationSearchQuery: '',
        });
        return;
      } else if (location) {
        setState({
          ...state,
          binLocation: location,
          binLocationSearchQuery: '',
        });
      }
    };
    dispatch(
      searchLocationByLocationNumber(state.binLocationName, actionCallback),
    );
  };

  const binLocationSearchQueryChange = (query: string) => {
    setState({
      ...state,
      binLocationSearchQuery: query,
    });
    onBinLocationBarCodeSearchQuerySubmitted();
  };

  const quantityPickedChange = (query: string) => {
    if(query > pickListItemData.quantityRemaining)
    {
      showPopup({
        title: 'Quantity To Pick!',
        message: 'Quantity to pick cannot exceed quantity remaining!',
        negativeButtonText: 'Cancel',
      });
    } else {
      setPickListItemData({...pickListItemData, ...{quantityPicked: query}});
        setState({
      ...state,
      quantityPicked: query,
    });
    }
  };

  const onChangeProduct = (text: string) => {
    state.productCode = text;
    setState({...state});
  };

  const onChangeBin = (text: string) => {
    state.binLocationName = text;
    setState({...state});
  };
  
  return (
    pickListItemData ?
    <View style={styles.screenContainer}>
                <ScrollView style={styles.inputContainer}>
                  <View style={styles.listItemContainer}>
                    <View style={styles.row}>
                      <View style={styles.col50}>
                        <Text style={styles.label}>Product Code</Text>
                        <Text style={styles.value}>{pickListItemData?.productCode}</Text>
                      </View>
                      <View style={styles.col50}>
                        <Text style={styles.label}>Product Name</Text>
                        <Text style={styles.value}>
                          {pickListItemData?.['product.name']}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.row}>
                      <View style={styles.col50}>
                        <Text style={styles.label}>Picked</Text>
                        <Text style={styles.value}>
                          {pickListItemData?.quantityPicked} / {pickListItemData?.quantityRequested}
                        </Text>
                      </View>
                      <View style={styles.col50}>
                        <Text style={styles.label}>Remaining</Text>
                        <Text style={styles.value}>
                          {pickListItemData?.quantityRemaining}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.from}>
                    <InputBox
                      value={pickListItemData?.productCode}
                      disabled={true}
                      editable={false}
                      onEndEdit={productSearchQueryChange}
                      onChange={onChangeProduct}
                      label={'Product Code'}
                    />
                    <InputBox
                      value={pickListItemData?.lotNumber}
                      label={'Lot Number'}
                      disabled={true}
                      onEndEdit={binLocationSearchQueryChange}
                      onChange={onChangeBin}
                      editable={false}
                    />
                    <InputBox
                      value={pickListItemData?.['binLocation.name']}
                      label={'Bin Location'}
                      disabled={true}
                      onEndEdit={binLocationSearchQueryChange}
                      onChange={onChangeBin}
                      editable={false}
                    />
                     <View style={styles.inputSpinner}>
                    <InputSpinner
                      title={"Quantity to Pick"}
                      setValue={(value) => quantityPickedChange(value)}
                      value={pickListItemData?.quantityRemaining}
                    />
                    </View>
                    <Button title="Pick Item" onPress={() => formSubmit(pickListItemData)} />
                  </View>
                </ScrollView>
                <View style={styles.bottom} />
              </View>
              : null
  );
};

export default PickOrderItem;
