import React from 'react';
import { SectionList, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
import { Card } from 'react-native-paper';
import InboundDetailProps from './types';
import { common } from '../../assets/styles';
import DetailsTable from '../../components/DetailsTable';
import { Props as LabeledDataType } from '../../components/LabeledData/types';

const InboundOrderContainer: React.FC<InboundDetailProps> = ({ data, shipmentId, shipmentData }) => {
  const navigation = useNavigation<any>();

  const navigateToInboundOrderDetails = (item: any) => {
    navigation.navigate('InboundReceiveDetail', {
      shipmentItem: item,
      shipmentData: shipmentData,
      shipmentId: shipmentId
    });
  };

  const getStatus = (value: number) => {
    if (value > 0) {
      return 'Receiving';
    } else if (value <= 0) {
      return 'Received';
    } else {
      return 'Pending';
    }
  };

  const renderShipmentItemData: LabeledDataType[] = [
    { label: 'Shipment Number', value: shipmentData?.shipmentNumber },
    { label: 'Status', value: shipmentData?.status },
    { label: 'Origin', value: shipmentData?.origin.name },
    { label: 'Destination', value: shipmentData?.destination.name },
    { label: 'Description', value: shipmentData?.name },
    { label: 'Items Received', value: `${shipmentData.receivedCount} / ${shipmentData?.shipmentItems.length}` },
    { label: 'Expected Shipping Date', value: shipmentData?.expectedShippingDate },
    { label: 'Expected Delivery Date', value: shipmentData?.expectedDeliveryDate }
  ];

  const renderShipmentItem: React.FC = () => {
    return (
      <Card style={common.listItemContainer}>
        <Card.Content>
          <DetailsTable data={renderShipmentItemData} />
        </Card.Content>
      </Card>
    );
  };

  const renderListItem = (item: any) => {
    const renderListItemData: LabeledDataType[] = [
      { label: 'Product Code', value: item['product.productCode'] },
      { label: 'Product Name', value: item['product.name'] },
      { label: 'Quantity Shipped', value: item.quantityShipped },
      { label: 'Quantity Received', value: item.quantityReceived },
      { label: 'Quantity Remaining', value: item.quantityRemaining > 0 ? item.quantityRemaining : 0 },
      { label: 'Status', value: getStatus(item.quantityRemaining) }
    ];

    return (
      <Card
        key={item['product.productCode']}
        style={common.listItemContainer}
        onPress={() => navigateToInboundOrderDetails(item)}
      >
        <Card.Content>
          <DetailsTable data={renderListItemData} />
        </Card.Content>
      </Card>
    );
  };

  return (
    <SectionList
      ListHeaderComponent={renderShipmentItem}
      renderItem={({ item }) => renderListItem(item)}
      renderSectionHeader={({ section: { title } }) => <Text style={styles.headerTitle}>{title}</Text>}
      sections={data}
      keyExtractor={(item, index) => item + index}
    />
  );
};
export default InboundOrderContainer;
