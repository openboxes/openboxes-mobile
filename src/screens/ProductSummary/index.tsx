import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { Card, Chip, Divider, Subheading } from 'react-native-paper';
import { LayoutStyle } from '../../assets/styles';
import BarcodeSearchHeader from '../../components/BarcodeSearchHeader/BarcodeSearchHeader';
import EmptyView from '../../components/EmptyView';
import ListLoadingSkeleton from '../../components/ListLoadingSkeleton';
import { getLocationProductSummary } from '../../redux/actions/locations';
import { RootState } from '../../redux/reducers';
import { emptyStateMessage } from '../../utils/emptyStateMessage';
import ProductSummaryCardSkeleton from './ProductSummaryCardSkeleton';
import styles from './styles';

const ProductSummary = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const location = useSelector((state: RootState) => state.mainReducer.currentLocation);
  const [productSummary, setProductSummary] = useState<any[]>([]);
  const [productData, setProductData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getProductSummary(location.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getProductSummary = (id: string) => {
    setIsLoading(true);
    const callback = (data: any) => {
      setIsLoading(false);
      if (data?.error) {
        Alert.alert('Product Summary', data.errorMessage ?? 'Failed to load Product Summary details.', [
          { text: 'Retry', onPress: () => dispatch(getLocationProductSummary(id, callback)) },
          { text: 'Cancel', style: 'cancel' }
        ]);
      } else if (data) {
        const filtered = _.filter(data, (item: { quantityOnHand: number }) => item.quantityOnHand > 0);
        setProductSummary(filtered);
        setProductData(filtered);
      }
    };
    dispatch(getLocationProductSummary(id, callback));
  };

  const searchProduct = (query: string) => {
    setSearchTerm(query);
    if (query) {
      setProductSummary(
        _.filter(
          productData,
          (item: { productCode: string; productName: string }) =>
            item.productCode.toLowerCase().includes(query.toLowerCase()) ||
            item.productName.toLowerCase().includes(query.toLowerCase())
        )
      );
    } else {
      setProductSummary(productData);
    }
  };

  const navigateToDetails = (item: any) => {
    navigation.navigate('ProductDetails', { product: { id: item.productCode } });
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
        resetSearch={() => searchProduct('')}
        searchBox={false}
        loading={isLoading}
        accessibilityLabel="Search inventory"
        onSearchTermSubmit={(query) => searchProduct(query)}
      />
      {isLoading ? (
        <ListLoadingSkeleton visible count={5} CardComponent={ProductSummaryCardSkeleton} />
      ) : (
        <FlatList
          renderItem={({ item, index }) => renderListItem(item, index)}
          data={productSummary}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          ListEmptyComponent={
            <EmptyView
              title="Inventory"
              description={emptyStateMessage('products', searchTerm, 'There are no items in inventory')}
              isRefresh={false}
            />
          }
          keyExtractor={(item, index) => item?.productCode?.toString() ?? index.toString()}
        />
      )}
    </View>
  );
};
export default ProductSummary;
