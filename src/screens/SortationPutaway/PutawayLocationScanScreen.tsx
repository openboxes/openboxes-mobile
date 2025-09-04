import { RouteProp, useIsFocused, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, TextInput, View } from 'react-native';
import { Divider, TextInput as PaperTextInput, Subheading } from 'react-native-paper';

import Button from '../../components/Button';
import EmptyView from '../../components/EmptyView';
import { navigate } from '../../NavigationService';
import PutawayDetails from './PutawayDetails';
import styles from './styles';

// NOTE: Currently, Product Scan and Location Scan are implemented as separate screens.
// If their scanning flow and UI remain largely the same, we can consider merging them
// into a single reusable screen in the future.

type PutawayLocationScanRouteProp = RouteProp<
  // TODO [Putaway]: Create a proper type for putawayDetails
  { SortationPutawayLocationScan: { putawayDetails: any } },
  'SortationPutawayLocationScan'
>;

export default function PutawayLocationScanScreen() {
  const { params } = useRoute<PutawayLocationScanRouteProp>();
  const { putawayDetails } = params;

  const inputRef = useRef<TextInput | null>(null);
  const isFocused = useIsFocused();

  const [putawayLocationBarcode, setPutawayLocationBarcode] = useState<string | undefined>();

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    const t = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(t);
  }, [isFocused]);

  if (!putawayDetails) {
    return (
      <View style={styles.emptyContainer}>
        <EmptyView
          title="Putaway Details Not Found"
          description="The putaway details you are looking for do not exist or are not available."
        />
      </View>
    );
  }

  function handleChange(barcode: string) {
    setPutawayLocationBarcode(barcode);
  }

  function handleSubmit() {
    if (!putawayLocationBarcode) {
      Alert.alert('Invalid Location Barcode', 'Please enter a valid putaway location barcode.');
      return;
    }

    const locationNumber = putawayDetails.destination?.locationNumber

    if (putawayLocationBarcode !==locationNumber) {
      Alert.alert(
        'Invalid Location Barcode',
        `The scanned barcode does not match the expected putaway location: ${locationNumber}.`
      );
      return;
    }

    navigate('SortationPutawayProductScan', { putawayDetails });
  }

  return (
    <View style={styles.contentContainer}>
      <PutawayDetails putawayDetails={putawayDetails} />

      <Divider />

      <View style={styles.formContainer}>
        <Subheading style={styles.subheading}>Scan Putaway Location Barcode</Subheading>

        <PaperTextInput
          ref={inputRef}
          autoCompleteType="off"
          style={styles.topSpace}
          mode="outlined"
          label="Putaway Location Entry Field"
          keyboardType="number-pad"
          value={putawayLocationBarcode}
          returnKeyType="done"
          onChangeText={handleChange}
          onSubmitEditing={handleSubmit}
        />

        <Button style={styles.topSpace} title="Confirm" mode="contained" size="100%" onPress={handleSubmit}>
          Submit
        </Button>
      </View>
    </View>
  );
}
