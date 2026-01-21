import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { Divider, Subheading } from 'react-native-paper';

import { ScannerInput } from '../../components/ScannerInput';
import { EMPTY_STRING } from '../../constants';
import { navigate } from '../../NavigationService';
import CycleCountDetails from './CycleCountDetails';
import { MOCKED_CYCLE_COUNT } from './mocked-data';
import styles from './styles';

export default function CycleCountProduct() {
  const [productBarcode, setProductBarcode] = useState<string>(EMPTY_STRING);

  const performScan = useCallback((scannedId: string) => {
    if (!scannedId) {
      // Handle scan error (e.g., show an alert)
      Alert.alert('Scan Error', 'No barcode scanned. Please try again.');
      return;
    }

    if (scannedId !== MOCKED_CYCLE_COUNT.inventoryItem.product?.productCode) {
      Alert.alert('Scan Error', 'Scanned barcode does not match the expected product barcode.');
      // Handle mismatch error (e.g., show an alert)
      return;
    }

    navigate('CycleCountQuantityAvailable');
  }, []);

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      style={styles.contentWrapper}
      contentContainerStyle={styles.contentContainer}
    >
      <CycleCountDetails cycleCountDetails={MOCKED_CYCLE_COUNT} />

      <Divider />

      <View style={styles.formContainer}>
        <Subheading style={styles.subheading}>Scan Cycle Count Product Barcode</Subheading>

        <ScannerInput
          style={styles.topSpace}
          label="Cycle Count Product Barcode"
          value={productBarcode}
          onChange={setProductBarcode}
          onSubmit={performScan}
        />
      </View>
    </ScrollView>
  );
}
