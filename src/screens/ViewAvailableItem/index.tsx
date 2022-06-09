/* eslint-disable react-native/no-inline-styles */
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { Image, View } from 'react-native';
import styles from './styles';
import { Card } from 'react-native-paper';
import RenderData from '../../components/RenderData';
import Button from '../../components/Button';
import DefaultProductImage from '../../assets/images/default-product.png';

const ViewAvailableItem = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [availableItems, setavailableItems] = useState(route?.params?.item);
  const onSelect = (data: undefined) => {
    setavailableItems({
      ...availableItems,
      ...{
        quantityOnHand: data?.quantityAvailable,
        quantityAvailableToPromise: data?.quantityAdjusted
      }
    });
  };

  const navigateToAdjustStock = () => {
    navigation.navigate('AdjustStock', {
      item: availableItems,
      onSelect: onSelect
    });
  };

  const source = route?.params?.imageUrl ? { uri: route?.params?.imageUrl } : DefaultProductImage;

  const navigateToTransfer = () => {
    navigation.navigate('Transfer', { item: availableItems });
  };
  return (
    <View style={styles.container}>
      <Card style={styles.from}>
        <Card.Content>
          <View style={{ width: '100%', alignItems: 'center', flex: 0 }}>
            <Image style={{ width: 150, height: 150, resizeMode: 'contain' }} source={source} />
          </View>
          <View style={styles.rowItem}>
            <RenderData title={'Product Code'} subText={availableItems?.product.productCode} />
            <RenderData title={'Product Name'} subText={availableItems?.product.name} />
          </View>
          <View style={styles.rowItem}>
            <RenderData title={'Lot Number'} subText={availableItems?.inventoryItem?.lotNumber ?? 'Default'} />
            <RenderData title={'Expiration Date'} subText={availableItems?.inventoryItem?.expirationDate ?? 'Never'} />
          </View>
          <View style={styles.rowItem}>
            <RenderData title={'Location Name'} subText={availableItems?.binLocation?.name ?? 'Default'} />
            <RenderData title={'Location Type'} subText={availableItems?.binLocation?.locationType?.name ?? 'Never'} />
          </View>
        </Card.Content>
      </Card>
      <View style={styles.button}>
        <Button title={'Adjust Stock'} onPress={navigateToAdjustStock} />
        <Button title={'Transfer'} onPress={navigateToTransfer} />
      </View>
    </View>
  );
};
export default ViewAvailableItem;
