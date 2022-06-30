import React from 'react';
import { Text, View } from 'react-native';
import styles from '../OutboundStockDetails/styles';
import { Shipment } from '../../data/container/Shipment';

interface Props {
  shipment: Shipment | null;
}

const OrderDetailsSection = (props: Props) => (
  <View>
    <View style={styles.row}>
      <View style={styles.col50}>
        <Text style={styles.label}>Shipment Number</Text>
        <Text style={styles.value}>{props?.shipment?.shipmentNumber}</Text>
      </View>
      <View style={styles.col50}>
        <Text style={styles.label}>Status</Text>
        <Text style={styles.value}>{props?.shipment?.requisitionStatus}</Text>
      </View>
    </View>
    <View style={styles.row}>
      <View style={styles.col50}>
        <Text style={styles.label}>Destination</Text>
        <Text style={styles.value}>{props?.shipment?.destination.name}</Text>
      </View>
      <View style={styles.col50}>
        <Text style={styles.label}>Expected Shipping Date</Text>
        <Text style={styles.value}>{props?.shipment?.expectedShippingDate}</Text>
      </View>
    </View>
    <View style={styles.row}>
      <View style={styles.col50}>
        <Text style={styles.label}>Loading Location</Text>
        <Text style={styles.value}>{props?.shipment?.loadingLocation}</Text>
      </View>
      <View style={styles.col50}>
        <Text style={styles.label}>Expected Delivery Date</Text>
        <Text style={styles.value}>{props?.shipment?.expectedDeliveryDate}</Text>
      </View>
    </View>
    <View style={styles.row}>
      <View style={styles.col50}>
        <Text style={styles.label}>Containers Loaded</Text>
        <Text style={styles.value}>{props?.shipment?.loadingStatusDetails?.statusMessage}</Text>
      </View>
    </View>
  </View>
)

export default OrderDetailsSection;
