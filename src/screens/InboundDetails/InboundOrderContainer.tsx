/* eslint-disable react-native/no-inline-styles */
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { SectionList, Text, View } from 'react-native';
import { Card, Chip, Divider, Subheading } from 'react-native-paper';

import { LayoutStyle } from '../../assets/styles';
import { appConfig, DEFAULT_DATE_FORMAT_OPTIONS } from '../../constants';
import { parseDateToISODate } from '../../utils/utils';
import styles from './styles';
import InboundDetailProps from './types';

const InboundOrderContainer = ({ data, shipmentId, shipmentData }: InboundDetailProps) => {
  const navigation = useNavigation<any>();

  const RenderData = ({ title, subText }: any): JSX.Element => {
    return (
      <View style={styles.columnItem}>
        <Text style={styles.label}>{title}</Text>
        <Text style={styles.value}>{subText}</Text>
      </View>
    );
  };

  const navigateToInboundOrderDetails = (item: any) => {
    navigation.navigate('InboundReceiveDetail', {
      shipmentItem: item,
      shipmentData: shipmentData,
      shipmentId: shipmentId
    });
  };

  const renderShipmentItem = (): JSX.Element => {
    const dueDate = parseDateToISODate(shipmentData.expectedDeliveryDate);
    const formattedDueDate = dueDate
      ? dueDate.toLocaleDateString(appConfig.LOCALE, DEFAULT_DATE_FORMAT_OPTIONS)
      : 'Invalid date';

    return (
      <View>
        <View style={{ padding: 16, backgroundColor: '#fff' }}>
          <View style={styles.headerRow}>
            <View style={styles.dividedValues}>
              <Text style={styles.value}>{shipmentData.shipmentNumber}</Text>
              <Divider style={styles.dividerVertical} />
              <Text style={styles.value}>{formattedDueDate}</Text>
            </View>
            <Chip style={styles.chipWarning} textStyle={styles.chipWarningText}>
              {shipmentData.status}
            </Chip>
          </View>
          <Divider style={styles.dividerHorizontal} />

          <Subheading style={{ fontWeight: 'bold' }}> {shipmentData.name} </Subheading>
          <View style={styles.additionalInfoRow}>
            <Chip icon="package" style={styles.chipDefault} textStyle={styles.chipDefaultText}>
              {`${shipmentData.shipmentItems.length} Items`}
            </Chip>
            <Chip icon="calendar" style={styles.chipDefault} textStyle={styles.chipDefaultText}>
              {`Due: ${formattedDueDate}`}
            </Chip>
          </View>
          <Divider style={styles.dividerHorizontal} />

          <View style={styles.rowItem}>
            <View style={styles.rowItem}>
              <RenderData title={'Origin'} subText={shipmentData.origin.name} />
              <RenderData title={'Destination'} subText={shipmentData.destination.name} />
            </View>
          </View>
        </View>
        <Divider />
      </View>
    );
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

  const renderListItem = (item: any, index: any) => {
    const itemStatus = getStatus(item.quantityRemaining);

    return (
      <Card key={index} style={LayoutStyle.listItemContainer} onPress={() => navigateToInboundOrderDetails(item)}>
        <Card.Content>
          <View style={styles.headerRow}>
            <Chip icon="barcode" style={styles.chipDefault} textStyle={styles.chipWarningText}>
              {item['product.productCode']}
            </Chip>
            <Chip style={[styles.chipDefault, styles.lastChild]} textStyle={styles.chipWarningText}>
              {itemStatus?.toUpperCase()}
            </Chip>
          </View>
          <Divider style={styles.dividerHorizontal} />

          <Subheading> {item['product.name']} </Subheading>
          <Divider style={styles.dividerHorizontal} />

          <View style={styles.rowItem}>
            <Chip icon="truck" style={{ ...styles.chipDefault, flex: 1 }} textStyle={styles.chipWarningText}>
              {`Shipped: ${item.quantityShipped}`}
            </Chip>
            <Chip
              icon="database"
              style={{ ...styles.chipDefault, ...styles.lastChild, flex: 1 }}
              textStyle={styles.chipWarningText}
            >
              {`Remaining: ${item.quantityRemaining > 0 ? item.quantityRemaining : 0}`}
            </Chip>
          </View>

          <View style={styles.rowItem}>
            <Chip
              icon="thumb-up"
              style={{ ...styles.chipDefault, ...styles.lastChild, flex: 1 }}
              textStyle={styles.chipWarningText}
            >
              {`Received: ${item.quantityReceived}`}
            </Chip>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <SectionList
      ListHeaderComponent={renderShipmentItem}
      renderItem={({ item, index }) => renderListItem(item, index)}
      sections={data}
      keyExtractor={(item, index) => item + index}
    />
  );
};
export default InboundOrderContainer;
