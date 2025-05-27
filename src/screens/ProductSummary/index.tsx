import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { Card, Chip, Divider, Subheading } from 'react-native-paper';
import { LayoutStyle } from '../../assets/styles';
import BarcodeSearchHeader from '../../components/BarcodeSearchHeader/BarcodeSearchHeader';
import EmptyView from '../../components/EmptyView';
import showPopup from '../../components/Popup';
import { getLocationProductSummary } from '../../redux/actions/locations';
import { RootState } from '../../redux/reducers';
import styles from './styles';

const ProductSummary = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const location = useSelector((state: RootState) => state.mainReducer.currentLocation);
  const [state, setState] = useState<any>({
    productSummary: [],
    productData: []
  });

  useEffect(() => {
    getProductSummary(location.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getProductSummary = (id: string) => {
    const callback = (data: any) => {
      if (data?.error) {
        showPopup({
          title: data.errorMessage ? 'Product Summary details' : null,
          message: data.errorMessage ?? `Failed to load Product Summary details ${id}`,
          positiveButton: {
            text: 'Retry',
            callback: () => {
              dispatch(getLocationProductSummary(id, callback));
            }
          },
          negativeButtonText: 'Cancel'
        });
      } else {
        if (data && Object.keys(data).length !== 0) {
          state.productSummary = _.filter(data, (item: { quantityOnHand: number }) => item.quantityOnHand > 0);
          state.productData = state.productSummary;
        }
        setState({ ...state });
      }
    };
    dispatch(getLocationProductSummary(id, callback));
  };

  const searchProduct = (query: string) => {
    if (query) {
      state.productSummary = _.filter(
        state.productData,
        (item: { productCode: string; productName: string }) =>
          item.productCode.toLowerCase().includes(query.toLowerCase()) ||
          item.productName.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      state.productSummary = state.productData;
    }
    setState({ ...state });
  };

  const navigateToDetails = (item: any) => {
    const product = {
      id: item.productCode
    };
    navigation.navigate('ProductDetails', { product: product });
  };

  const renderListItem = (item: any, index: any) => {
    return (
      <Card key={index} style={LayoutStyle.listItemContainer} onPress={() => navigateToDetails(item)}>
        <Card.Content>
          <View style={styles.headerRow}>
            <Chip icon="barcode" style={styles.chipDefault} textStyle={styles.chipText}>
              {item.productCode}
            </Chip>
          </View>
          <Divider style={styles.contentDivider} />

          <Subheading style={styles.subheading}> {item.productName} </Subheading>
          <View style={styles.additionalInfoRow}>
            <Chip icon="package-variant" style={styles.chipDefault} textStyle={styles.chipText}>
              {`Quantity On Hand: ${item.quantityOnHand}`}
            </Chip>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <BarcodeSearchHeader
        autoSearch
        autoFocus
        placeholder={'Search by product code or name'}
        resetSearch={() => null}
        searchBox={false}
        onSearchTermSubmit={(query) => searchProduct(query)}
      />
      <FlatList
        renderItem={({ item, index }) => renderListItem(item, index)}
        data={state.productSummary}
        ListEmptyComponent={
          <EmptyView title="Inventory" description="There are no items in inventory" isRefresh={false} />
        }
        keyExtractor={(item, index) => item + index}
      />
    </View>
  );
};
export default ProductSummary;
