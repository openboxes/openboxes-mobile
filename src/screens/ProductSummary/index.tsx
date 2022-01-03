/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
import { Card } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import showPopup from '../../components/Popup';
import { getLocationProductSummary } from '../../redux/actions/locations';
import { RootState } from '../../redux/reducers';
import BarCodeSearchHeader from '../Products/BarCodeSearchHeader';
import _ from 'lodash';

const ProductSummary = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const location = useSelector(
    (state: RootState) => state.mainReducer.currentLocation
  );
  const [state, setState] = useState<any>({
    productSummary: [],
    productData: [],
  });

  useEffect(() => {
    getProductSummary(location.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getProductSummary = (id: string) => {
    // eslint-disable-next-line complexity
    const callback = (data: any) => {
      if (data?.error) {
        showPopup({
          title: data.errorMessage ? 'Product Summary details' : null,
          message:
            data.errorMessage ?? `Failed to load Product Summary details ${id}`,
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
          state.productSummary = _.filter(
            data,
            (item: { quantityOnHand: number }) => item.quantityOnHand > 0
          );
          state.productData = state.productSummary
        }
        setState({ ...state });
      }
    };
    dispatch(getLocationProductSummary(id, callback));
  };

  const searchProduct = (query: string) => {
    if (query && Object.keys(query).length !== 0) {
      state.productSummary = _.filter(
        state.productSummary,
        (item: { productCode: string, productName: string }) => item.productCode.includes(query) || item.productName.includes(query));
    } else state.productSummary = state.productData;
    setState({...state});
  };

  const RenderData = ({ title, subText }: any): JSX.Element => {
    return (
      <View style={styles.columnItem}>
        <Text style={styles.label}>{title}</Text>
        <Text style={styles.value}>{subText}</Text>
      </View>
    );
  };

  const navigateToDetails = (item: any) => {
    const product = {
      id: item.productCode
    };
    navigation.navigate('ProductDetails', { product: product });
  };

  const renderListItem = (item: any, index: any) => {
    return (
      <TouchableOpacity
        key={index}
        style={styles.itemView}
        onPress={() => navigateToDetails(item)}
      >
        <Card>
          <Card.Content>
            <View style={styles.rowItem}>
              <RenderData title={'Product Code'} subText={item.productCode} />
              <RenderData
                title={'Quantity OnHand'}
                subText={item.quantityOnHand}
              />
            </View>
            <View style={styles.rowItem}>
              <RenderData title={'Product Name'} subText={item.productName} />
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <BarCodeSearchHeader
        placeholder={'Search Orders by Name'}
        searchBox={false}
        autoSearch={true}
        onBarCodeSearchQuerySubmitted={(query) => searchProduct(query)}
      />
      <FlatList
        renderItem={({ item, index }) => renderListItem(item, index)}
        data={state.productSummary}
        keyExtractor={(item, index) => item + index}
      />
    </View>
  );
};
export default ProductSummary;
