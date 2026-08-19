import React from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import { Divider, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { ProductDetails } from '../../components/ProductDetails';
import { HYPHEN } from '../../constants';
import { DestinationAddress } from '../../types/picking';
import styles from './customerDetailsStyles';

type CustomerDetailsProps = {
  name?: string;
  locationType?: string;
  address?: DestinationAddress | null;
};

function compact(parts: Array<string | null | undefined>) {
  return parts.filter(Boolean).join(', ');
}

function AddressDetails({ address }: { address?: DestinationAddress | null }) {
  const addressLine1 = address?.address || HYPHEN;
  const locality = compact([address?.city, address?.stateOrProvince, address?.postalCode]);
  const hasAddress = Boolean(address?.address || address?.address2 || locality || address?.description);

  return (
    <>
      <Text style={styles.addressLine}>{addressLine1}</Text>
      {address?.address2 ? <Text style={styles.addressLine}>{address.address2}</Text> : null}
      {locality ? <Text style={styles.addressLine}>{locality}</Text> : null}
      {address?.description ? <Text style={styles.description}>{address.description}</Text> : null}
      {!hasAddress ? (
        <Text style={styles.missingAddress}>No delivery address is available in customer master data.</Text>
      ) : null}
    </>
  );
}

export function CustomerDetails({ name, locationType, address }: CustomerDetailsProps) {
  const [visible, setVisible] = React.useState(false);
  const locationTypeLabel = locationType || 'Destination';

  return (
    <>
      <ProductDetails.Item
        icon="map-marker"
        label={locationTypeLabel}
        value={name || HYPHEN}
        secondaryValue={address?.address}
        accessibilityLabel={`View delivery address for ${name || locationTypeLabel.toLowerCase()}`}
        onPress={() => setVisible(true)}
      />

      <Modal transparent visible={visible} animationType="fade" onRequestClose={() => setVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.dialog}>
            <View style={styles.header}>
              <View style={styles.headerText}>
                <Text style={styles.eyebrow}>{locationTypeLabel.toUpperCase()}</Text>
                <Text style={styles.title}>{name || HYPHEN}</Text>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                accessibilityRole="button"
                accessibilityLabel={`Close ${locationTypeLabel.toLowerCase()} details`}
                onPress={() => setVisible(false)}
              >
                <Icon name="close" size={20} style={styles.closeIcon} />
              </TouchableOpacity>
            </View>

            <Divider />

            <View style={styles.addressSection}>
              <Icon name="map-marker-outline" size={22} style={styles.addressIcon} />
              <View style={styles.addressText}>
                <Text style={styles.eyebrow}>SHIP TO ADDRESS</Text>
                <AddressDetails address={address} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
