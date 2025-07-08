/* eslint-disable react-native/no-inline-styles */
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { Image, View } from 'react-native';
import { Caption, Card, Chip, Divider, Subheading } from 'react-native-paper';

import DefaultProductIcon from '../../assets/images/icon_default_product.svg';
import Button from '../../components/Button';
import Theme from '../../utils/Theme';
import styles from './styles';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers';

const ViewAvailableItem = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [availableItems, setavailableItems] = useState(route?.params?.item);
  const { productSummaryConfig } = useSelector((state: RootState) => state.settingsReducer);

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

  const source = route?.params?.imageUrl && { uri: route?.params?.imageUrl };

  const navigateToTransfer = () => {
    navigation.navigate('Transfer', { item: availableItems });
  };

  const showLotNumber = useMemo(() => productSummaryConfig?.lotNumber !== false, [productSummaryConfig]);
  const showLocationType = useMemo(() => productSummaryConfig?.locationType !== false, [productSummaryConfig]);
  const showExpirationDate = useMemo(() => productSummaryConfig?.expirationDate !== false, [productSummaryConfig]);

  return (
    <View style={styles.container}>
      <Card>
        <Card.Content>
          <View style={styles.headerRow}>
            {source ? (
              <Image
                style={{ width: 36, height: 36, resizeMode: 'contain', marginRight: Theme.spacing.medium }}
                source={source}
              />
            ) : (
              <DefaultProductIcon />
            )}
            {showExpirationDate && (
              <Chip icon="calendar" style={styles.chipDefault} textStyle={styles.chipText}>
                {`Expiration Date: ${availableItems?.expirationDate ?? 'Never'}`}
              </Chip>
            )}
          </View>
          <Divider style={{ marginVertical: Theme.spacing.medium }} />

          <Subheading style={{ fontWeight: 'bold', fontSize: 16 }}>
            {`${availableItems?.product.productCode} - ${availableItems?.product.name}`}
          </Subheading>
          {showLotNumber && (
            <Caption style={{ fontSize: 12, color: Theme.colors.text }}>
              {`Lot Number: ${availableItems?.lotNumber ?? 'Default'}`}
            </Caption>
          )}

          <View style={styles.additionalInfoRow}>
            <Chip icon="pin" style={styles.chipDefault} textStyle={styles.chipText}>
              {`Location Name: ${availableItems?.binLocation?.name ?? 'Default'}`}
            </Chip>
          </View>

          {showLocationType && (
            <View style={styles.additionalInfoRow}>
              <Chip icon="package" style={styles.chipDefault} textStyle={styles.chipText}>
                {`Location Type: ${availableItems?.binLocation?.locationType?.name ?? 'Default'}`}
              </Chip>
            </View>
          )}

          <View style={styles.buttons}>
            <Button
              title="Adjust Stock"
              size="100%"
              style={{ marginBottom: Theme.spacing.small }}
              onPress={navigateToAdjustStock}
            />
            <Button title="Transfer" size="100%" onPress={navigateToTransfer} />
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};
export default ViewAvailableItem;
