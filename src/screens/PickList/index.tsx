import React, {useEffect, useReducer} from 'react';
import _ from 'lodash';
import styles from './styles';
import { ListRenderItemInfo, ScrollView, Text, View, ToastAndroid } from 'react-native';
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
import Carousel from 'react-native-snap-carousel';
import { device } from '../../constants';
import { PicklistItem } from '../../data/picklist/PicklistItem';
import InputSpinner from '../../components/InputSpinner';

const reducer = (action: any, state = {}) => {
  switch (action.type) {
     case 'UPDATE_QUNTITY':
       state.quantityPicked = action.payload;
      return ({...state, quantityPicked: action.payload});
     case 'UPDATE':
        return action.payload;
     default:
        return state;
  }
};

const initialValue = {
  error: '',
  pickListItem: [],
  order: null,
  productSearchQuery: '',
  binLocationSearchQuery: '',
  quantityPicked: '0',
  product: null,
  productCode: '',
  binLocation: null,
  lotNumber: '',
  binLocationName: '',
};

const PickOrderItem = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const barcodeData = useEventListener();
  const [productData, producDispatch] = useReducer(reducer, initialValue);
  const navigation = useNavigation();
  const vm = pickListVMMapper(route.params);
  const [pickListItemData, dispatchPickListItemData] = useReducer((pickListItemDataState: any, action: any) => {
    let picklistItems = pickListItemDataState;
    picklistItems[action.index].quantityToPick = parseInt(action.query);
    return picklistItems;
  }, vm.order.picklist? vm.order.picklist.picklistItems : []);

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
        if (data && data.error) {
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
                productData.pickListItem?.productCode !== data.data[0].productCode
              ) {
                showPopup({
                  message: `You have scanned a wrong product barcode "${query}"`,
                  positiveButton: {text: 'Ok'},
                });
              } else {
                productData.quantityPicked = (
                  parseInt(productData.quantityPicked, 10) + 1
                ).toString();
                productData.product = data.data[0];
                productData.productCode = data.data[0].productCode;
              }
              producDispatch({type: 'UPDATE', payload: {...productData}})
            }
          }
          dispatch(hideScreenLoading());
        }
      };
      dispatch(searchProductGloballyAction(query, actionCallback));
    } else {
      const actionBinLocationCallback = (data: any) => {
        if (data && data.error) {
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
              if (productData.binLocation === '' || productData.binLocation === data.name) {
                productData.binLocation = data;
                productData.binLocationSearchQuery = '';
              }
              producDispatch({type: 'UPDATE', payload: {...productData}})
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

  const formSubmit = (id: string) => {
    const itemToSave = _.find(pickListItemData, item => item.id === id);

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
        quantityPicked: itemToSave.quantityToPick,
      };

      const actionCallback = (data: any) => {
        if (data && data.error) {
          showPopup({
            title: data.errorMessage ? 'Failed to pick item' : null,
            message: data.errorMessage || 'Failed to pick item',
          });
        } else {
          const {order, pickListItem}: any = route.params;
          ToastAndroid.show('Picked item successfully!', ToastAndroid.SHORT);
          // @ts-ignore
          navigation.navigate('OrderDetails', {
            order,
            pickList: pickListItem,
          });
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
      const message = e.message  || 'Failed submit item';
      showPopup({
        title: title,
        message: message,
        negativeButtonText: 'Cancel',
      });
      return Promise.resolve(null);
    }
  };

  const productSearchQueryChange = (query: string) => {
    producDispatch({type: 'UPDATE', payload: {...productData,
      productSearchQuery: query + '343434',
    }});
    onProductBarCodeSearchQuerySubmitted();
  };

  const onProductBarCodeSearchQuerySubmitted = () => {
    if (!productData.productCode) {
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
          message: 'Product not found with ProductCode:' + productData.productCode,
          positiveButton: {
            text: 'Ok',
          },
        });
        producDispatch({type: 'UPDATE', payload: {
          ...productData,
          productCode: '',
          productSearchQuery: '',
        }});
        return;
      } else if (data.data.length == 1) {
        producDispatch({type: 'UPDATE', payload: {
          ...productData,
          product: data.data[0],
          quantityPicked: (parseInt(productData.quantityPicked, 10) + 1).toString(),
          productSearchQuery: '',
        }});
      }
    };
    dispatch(searchProductByCodeAction(productData.productCode, actionCallback));
  };

  const onBinLocationBarCodeSearchQuerySubmitted = () => {
    if (!productData.binLocationName) {
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
            productData.binLocationName,
          positiveButton: {
            text: 'Ok',
          },
        });
        producDispatch({type: 'UPDATE', payload: {
          ...productData,
          binLocationName: '',
          binLocationSearchQuery: '',
        }});
        producDispatch({type: 'UPDATE', payload: {
          ...productData,
          binLocationName: '',
          binLocationSearchQuery: '',
        }});
        return;
      } else if (location) {
        producDispatch({type: 'UPDATE', payload: {
          ...productData,
          binLocation: location,
          binLocationSearchQuery: '',
        }})
      }
    };
    dispatch(
      searchLocationByLocationNumber(productData.binLocationName, actionCallback),
    );
  };

  const binLocationSearchQueryChange = (query: string) => {
    producDispatch({type: 'UPDATE', payload: {
      ...productData,
      binLocationSearchQuery: query,
    }});
    onBinLocationBarCodeSearchQuerySubmitted();
  };

  const quantityPickedChange = (query: string, index: number) => {
    dispatchPickListItemData({query, index});
    producDispatch({type: 'UPDATE_QUNTITY', payload: query});
  };

  const onChangeProduct = (text: string) => {
    productData.productCode = text;
    producDispatch({type: 'UPDATE', payload: { ...productData}});
  };

  const onChangeBin = (text: string) => {
    productData.binLocationName = text;
    producDispatch({type: 'UPDATE', payload: { ...productData}});
  };
  return (
    <View style={styles.screenContainer}>
      <View style={styles.swiperView}>
        <Carousel
          key={3}
          dimensions={{width: device.windowWidth}}
          sliderWidth={device.windowWidth}
          sliderHeight={device.windowHeight}
          itemWidth={device.windowWidth - 70}
          data={pickListItemData}
          firstItem={vm.selectedPinkItemIndex ? vm.selectedPinkItemIndex : 0}
          scrollEnabled={true}
          renderItem={({item, index}: ListRenderItemInfo<PicklistItem>) => {
            return (
              <View key={index}>
                <ScrollView style={styles.inputContainer}>
                  <View style={styles.listItemContainer}>
                    <View style={styles.row}>
                      <View style={styles.col50}>
                        <Text style={styles.label}>Product Code</Text>
                        <Text style={styles.value}>{item?.productCode}</Text>
                      </View>
                      <View style={styles.col50}>
                        <Text style={styles.label}>Product Name</Text>
                        <Text style={styles.value}>
                          {item?.['product.name']}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.row}>
                      <View style={styles.col50}>
                        <Text style={styles.label}>Picked</Text>
                        <Text style={styles.value}>
                          {item?.quantityPicked} / {item?.quantityRequested}
                        </Text>
                      </View>
                      <View style={styles.col50}>
                        <Text style={styles.label}>Remaining</Text>
                        <Text style={styles.value}>
                          {item?.quantityRemaining}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.from}>
                    <InputBox
                      value={item.productCode}
                      disabled={true}
                      editable={false}
                      onEndEdit={productSearchQueryChange}
                      onChange={onChangeProduct}
                      label={'Product Code'}
                    />
                    <InputBox
                      value={item.lotNumber}
                      label={'Lot Number'}
                      disabled={true}
                      onEndEdit={binLocationSearchQueryChange}
                      onChange={onChangeBin}
                      editable={false}
                    />
                    <InputBox
                      value={item['binLocation.name']}
                      label={'Bin Location'}
                      disabled={true}
                      onEndEdit={binLocationSearchQueryChange}
                      onChange={onChangeBin}
                      editable={false}
                    />
                     <View style={styles.inputSpinner}>
                    <InputSpinner
                      title={"Quantity to Pick"}
                      setValue={(value) => quantityPickedChange(value, index)}
                      value={item.quantityRemaining}
                    />
                    </View>
                    <Button title="Pick Item" onPress={() => formSubmit(item.id)} />
                  </View>
                </ScrollView>
                <View style={styles.bottom}></View>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};

export default PickOrderItem;
