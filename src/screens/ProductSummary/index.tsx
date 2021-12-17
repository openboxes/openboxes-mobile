import React, {useEffect, useState} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styles from './styles';
import {Card} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import showPopup from '../../components/Popup';
import {getLocationProductSummary} from '../../redux/actions/locations';
import {searchProductGloballyAction} from '../../redux/actions/products';
import {RootState} from '../../redux/reducers';
import BarCodeSearchHeader from '../Products/BarCodeSearchHeader';
import _ from 'lodash';

const ProductSummary = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const location = useSelector(
    (state: RootState) => state.mainReducer.currentLocation,
  );
  const [state, setState] = useState<any>({
    productSummary: [],
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
          message:
            data.errorMessage ?? `Failed to load Product Summary details ${id}`,
          positiveButton: {
            text: 'Retry',
            callback: () => {
              dispatch(getLocationProductSummary(id, callback));
            },
          },
          negativeButtonText: 'Cancel',
        });
      } else {
        if (data && Object.keys(data).length !== 0) {
          state.productSummary = _.filter(
            data,
            item => item.quantityOnHand > 0,
          );
        }
        setState({...state});
      }
    };
    dispatch(getLocationProductSummary(id, callback));
  };

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

  const searchProduct = (query: string) => {
    const actionCallback = (data: any) => {
      if (data?.error) {
        showErrorPopup(
          data,
          query,
          actionCallback,
          searchProductGloballyAction,
        );
      } else {
        console.log(data);
        if (data.length === 0) {
          showPopup({
            message: `No search results found for product name "${query}"`,
            positiveButton: {text: 'Ok'},
          });
        } else {
          if (data && Object.keys(data).length !== 0) {
            state.productSummary = _.filter(
              data,
              item => item.quantityOnHand > 0,
            );
          }
          setState({...state});
        }
      }
    };
    dispatch(searchProductGloballyAction(query, actionCallback));
  };

  const RenderData = ({title, subText}: any): JSX.Element => {
    return (
      <View style={styles.columnItem}>
        <Text style={styles.label}>{title}</Text>
        <Text style={styles.value}>{subText}</Text>
      </View>
    );
  };

  const navigateToDetails = (item: any) => {
    const product = {
      id: item.productCode,
    };
    navigation.navigate('ProductDetails', {product: product});
  };

  const renderListItem = (item: any, index: any) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => navigateToDetails(item)}
        style={styles.itemView}>
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
        onBarCodeSearchQuerySubmitted={query => searchProduct(query)}
        placeholder={'Search Orders by Name'}
        autoSearch={true}
        searchBox={false}
      />
      <FlatList
        renderItem={({item, index}) => renderListItem(item, index)}
        data={state.productSummary}
        keyExtractor={(item, index) => item + index}
      />
    </View>
  );
};
export default ProductSummary;
