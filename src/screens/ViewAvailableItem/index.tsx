import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { Image, View } from 'react-native';
import styles from './styles';
import { Card } from 'react-native-paper';
import Button from '../../components/Button';
import DefaultProductImage from '../../assets/images/default-product.png';
import DetailsTable from '../../components/DetailsTable';
import { Props as LabeledDataType } from '../../components/LabeledData/types';
import { ContentContainer, ContentFooter, ContentBody } from '../../components/ContentLayout';

const ViewAvailableItem: React.FC = () => {
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

  const renderData: LabeledDataType[] = [
    { label: 'Product Code', value: availableItems?.product.productCode },
    { label: 'Product Name', value: availableItems?.product.name },
    { label: 'Lot Number', value: availableItems?.inventoryItem?.lotNumber, defaultValue: 'Default' },
    { label: 'Expiration Date', value: availableItems?.inventoryItem?.expirationDate, defaultValue: 'Never' },
    { label: 'Location Name', value: availableItems?.binLocation?.name, defaultValue: 'Default' },
    { label: 'Location Type', value: availableItems?.binLocation?.locationType?.name, defaultValue: 'Never' }
  ];

  return (
    <ContentContainer>
      <ContentBody>
        <Card style={styles.from}>
          <Card.Content>
            <View style={{ width: '100%', alignItems: 'center', flex: 0 }}>
              <Image style={{ width: 150, height: 150, resizeMode: 'contain' }} source={source} />
            </View>
            <DetailsTable data={renderData} />
          </Card.Content>
        </Card>
      </ContentBody>
      <ContentFooter gap={10}>
        <Button
          title={'Adjust Stock'}
          size={'default'}
          style={{ paddingHorizontal: 20 }}
          onPress={navigateToAdjustStock}
        />
        <Button title={'Transfer'} size={'default'} style={{ paddingHorizontal: 20 }} onPress={navigateToTransfer} />
      </ContentFooter>
    </ContentContainer>
  );
};
export default ViewAvailableItem;
