import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { Divider, Subheading } from 'react-native-paper';

import { ScannerInput } from '../../components/ScannerInput';
import { EMPTY_STRING } from '../../constants';
import { navigate } from '../../NavigationService';
import CycleCountDetails from './CycleCountDetails';
import { MOCKED_CYCLE_COUNT } from './mocked-data';
import styles from './styles';

export default function CycleCountLocation() {
  const [locationBarcode, setLocationBarcode] = useState<string>(EMPTY_STRING);

  // TODO: Replace with a proper action to fetch cycle count location details and perform validation
  const performScan = useCallback((scannedId: string) => {
    if (!scannedId) {
      Alert.alert('Scan Error', 'No barcode scanned. Please try again.');
      return;
    }

    if (scannedId !== MOCKED_CYCLE_COUNT.location?.locationNumber) {
      Alert.alert('Scan Error', 'Scanned barcode does not match the expected location barcode.');
      return;
    }

    navigate('CycleCountProduct');
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
        <Subheading style={styles.subheading}>Scan Cycle Count Location Barcode</Subheading>

        <ScannerInput
          style={styles.topSpace}
          label="Cycle Count Location Barcode"
          value={locationBarcode}
          onChange={setLocationBarcode}
          onSubmit={performScan}
        />
      </View>
    </ScrollView>
  );
}
