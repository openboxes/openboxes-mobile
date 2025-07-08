import { useNavigation } from '@react-navigation/native';
import React, { useMemo } from 'react';
import { SectionList, Text, TouchableOpacity, View } from 'react-native';
import { Caption, Card, Chip, Subheading } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { useSelector } from 'react-redux';
import { HYPHEN } from '../../constants';
import { RootState } from '../../redux/reducers';
import styles from './styles';

const ContainerDetails = ({ item }: any) => {
  const navigation = useNavigation<any>();
  const { productSummaryConfig } = useSelector((state: RootState) => state.settingsReducer);

  const navigateToOutboundOrderDetails = (item: any, section: any) => {
    navigation.navigate('ShipmentDetails', { item: item, section: section });
  };

  const showLotNumber = useMemo(() => productSummaryConfig?.lotNumber !== false, [productSummaryConfig]);

  const renderListItem = (item: any, index: any, section: any) => {
    return (
      <TouchableOpacity
        key={index}
        style={styles.itemView}
        onPress={() => navigateToOutboundOrderDetails(item, section)}
      >
        <Card style={styles.cardContainer}>
          <Card.Content>
            <Subheading style={styles.subheading}>
              {`${item.inventoryItem.product?.productCode} - ${item.inventoryItem.product?.name}`}
            </Subheading>
            {showLotNumber && (
              <Caption style={styles.caption}>{`Lot Number: ${item?.inventoryItem?.lotNumber ?? 'Default'}`}</Caption>
            )}

            <View style={styles.additionalInfoRow}>
              <Chip icon="package" style={styles.chipDefault} textStyle={styles.chipDefaultText}>
                {`Quantity To Pack: ${item.quantity ?? HYPHEN}`}
              </Chip>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <SectionList
      renderItem={({ item, index, section }) => renderListItem(item, index, section)}
      renderSectionHeader={({ section: { data, title, status } }) => (
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>{title}</Text>
          {data[0].container?.id && (
            <>
              <Text>{status ?? ''}</Text>
              <TouchableOpacity
                style={styles.infoButton}
                onPress={() => {
                  navigation.navigate('LpnDetail', {
                    id: data[0]?.container?.id,
                    shipmentNumber: data[0]?.shipment?.shipmentNumber,
                    status: status,
                    shipmentId: data[0]?.shipment?.id
                  });
                }}
              >
                <FontAwesome5 name="chevron-right" size={24} />
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
      sections={item}
      keyExtractor={(item, index) => item + index}
    />
  );
};
export default ContainerDetails;
