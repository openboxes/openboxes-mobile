import React from 'react';
import { Text, View } from 'react-native';
import { Chip, Divider, Subheading } from 'react-native-paper';

import { HYPHEN } from '../../constants';
import { Shipment } from '../../data/container/Shipment';
import { parseDateToISODate, parseFromISODateToLocaleString } from '../../utils/utils';
import styles from '../OutboundStockDetails/styles';

const OrderDetailsSection = ({ shipment }: { shipment: Shipment | null }) => {
  if (!shipment) {
    return null;
  }

  const parsedExpectedShippingDate = parseDateToISODate(shipment?.expectedShippingDate || '');
  const formattedExpectedShippingDate = parseFromISODateToLocaleString(parsedExpectedShippingDate);

  return (
    <View style={styles.contentContainer}>
      <View style={styles.headerRow}>
        <View style={styles.identifierContainer}>
          <Text style={styles.value}>{shipment.shipmentNumber ?? HYPHEN}</Text>
        </View>
        <Chip style={styles.chipWarning} textStyle={styles.chipWarningText}>
          {shipment.status ?? HYPHEN}
        </Chip>
      </View>

      <Divider style={styles.contentDivider} />

      <Subheading style={styles.destinationSubheading}>Destination: {shipment.destination?.name ?? HYPHEN}</Subheading>

      <View style={styles.additionalInfoRow}>
        <Chip icon="calendar" style={styles.chipDefault} textStyle={styles.chipDefaultText}>
          Expected Shipping: {formattedExpectedShippingDate}
        </Chip>
      </View>

      <View style={styles.rowItem}>
        <View style={styles.columnItem}>
          <Text style={styles.label}>Loading Location</Text>
          <Text style={styles.value}>{shipment.loadingLocation ?? HYPHEN}</Text>
        </View>

        <View style={styles.columnItem}>
          <Text style={styles.label}>Expected Delivery Date</Text>
          <Text style={styles.value}>{shipment.expectedDeliveryDate ?? HYPHEN}</Text>
        </View>
      </View>
    </View>
  );
};

export default OrderDetailsSection;
