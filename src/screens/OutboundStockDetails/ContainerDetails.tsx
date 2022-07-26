/* eslint-disable no-shadow */
import React from 'react';
import styles from './styles';
import { SectionList, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { colors } from '../../assets/styles';
import DetailsTable from '../../components/DetailsTable';
import { Props as LabeledDataType } from '../../components/LabeledData/types';

const ContainerDetails = ({ item }: any) => {
  const navigation = useNavigation<any>();

  const navigateToOutboundOrderDetails = (item: any) => {
    navigation.navigate('ShipmentDetails', { item: item });
  };

  const renderListItem = (item: any, index: any) => {
    const renderData: LabeledDataType[] = [
      { label: 'Product Code', value: item.inventoryItem.product?.productCode },
      { label: 'Product Name', value: item.inventoryItem.product?.name },
      { label: 'Lot Number', value: item.inventoryItem.lotNumber, defaultValue: 'Default' },
      { label: 'Quantity to Pack', value: item.quantity }
    ];
    return (
      <TouchableOpacity key={index} style={styles.itemView} onPress={() => navigateToOutboundOrderDetails(item)}>
        <Card>
          <Card.Content>
            <DetailsTable data={renderData} />
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <SectionList
      renderItem={({ item, index }) => renderListItem(item, index)}
      renderSectionHeader={({ section: { data, title } }) => (
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>{title}</Text>
          {data[0].container?.id && (
            <>
              <Text>{data[0]?.container?.status ?? ''}</Text>
              <TouchableOpacity
                style={styles.infoButton}
                onPress={() => {
                  navigation.navigate('LpnDetail', {
                    id: data[0]?.container?.id,
                    shipmentNumber: data[0]?.shipment?.shipmentNumber
                  });
                }}
              >
                <FontAwesome5 name="chevron-right" size={24} color={colors.accent} />
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
