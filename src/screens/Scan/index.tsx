/* eslint-disable complexity */
import React, { useEffect } from 'react';
import { View } from 'react-native';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import Product from '../../data/product/Product';
import onBarcodeScanned from '../../hooks/onBarcodeScanned';
import EmptyView from '../../components/EmptyView';
import BarcodeSearchHeader from '../../components/BarcodeSearchHeader/BarcodeSearchHeader';
import { searchBarcode } from '../../redux/actions/products';
import showPopup from '../../components/Popup';
import { useDispatch } from 'react-redux';

const Scan = () => {
  const barcodeData = onBarcodeScanned();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (barcodeData?.results && barcodeData?.query) {
      onSuccess(barcodeData?.results, barcodeData?.query);
    }
  }, [barcodeData]);

  const onSuccess = (data: any, query: any) => {
    console.log('global search result', data.type, data);
    if (data.type === 'Product') {
      navigateToProduct(data.data);
    } else if (data.type === 'InventoryItem') {
      navigateToProduct(data.data.product);
    } else if (data.type === 'Location') {
      navigateToLocationDetails(query);
    } else if (data.type === 'Container') {
      navigateToLPNDetails(data.data.id, data?.data?.shipmentNumber ?? '');
    } else if (data.type === 'AvailableItem') {
      navigateToAvailableItem(data.data);
    }
  };

  const navigateToProduct = (product: Product | undefined) => {
    if (product) {
      // @ts-ignore
      navigation.navigate('ProductDetails', { product });
    }
  };
  const navigateToLocationDetails = (id: string | undefined) => {
    if (id) {
      // @ts-ignore
      navigation.navigate('InternalLocationDetail', { id });
    }
  };
  const navigateToLPNDetails = (id: string | undefined, stockMovement: any) => {
    if (id) {
      // @ts-ignore
      navigation.navigate('LpnDetail', {
        id: id,
        shipmentNumber: stockMovement
      });
    }
  };
  const navigateToAvailableItem = (availableItem: AvailableItem | undefined) => {
    console.log('navigate to available item ', availableItem);
    if (availableItem) {
      // @ts-ignore
      navigation.navigate('ViewAvailableItem', {
        item: availableItem,
        imageUrl: availableItem.inventoryItem?.product?.defaultImageUrl
      });
    }
  };

  const onBarCodeScan = (query: string) => {
    if (!query) {
      return;
    }

    const actionCallback = (data: any) => {
      if (data?.error) {
        showPopup({
          title: 'No results found',
          message: data.errorMessage ?? `Failed to load search results with value = "${query}"`
        });
      } else {
        if (data.length === 0) {
          showPopup({
            title: 'Empty results',
            message: `No search results found for barcode "${query}"`
          });
        } else {
          if (data && Object.keys(data).length !== 0) {
            onSuccess(data, query);
          }
        }
      }
    };

    dispatch(searchBarcode(query, actionCallback));
  };

  return (
    <View style={styles.screenContainer}>
      <BarcodeSearchHeader
        autoSearch
        autoFocus
        searchBox={false}
        placeholder="Scan through search bar"
        onSearchTermSubmit={onBarCodeScan}
      />
      <View style={styles.countLabelAndIconContainer}>
        <EmptyView
          uri={require('../../assets/images/logo.png')}
          title="Scan"
          description="Scan a barcode for a product code, internal location, or LPN to retrieve details "
          isRefresh={false}
        />
      </View>
    </View>
  );
};

export default Scan;
