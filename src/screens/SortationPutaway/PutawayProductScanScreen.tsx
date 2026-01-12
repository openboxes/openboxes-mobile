import { RouteProp, useIsFocused, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, TextInput, View } from 'react-native';
import { Divider, TextInput as PaperTextInput, Subheading } from 'react-native-paper';

import Button from '../../components/Button';
import EmptyView from '../../components/EmptyView';
import { EMPTY_STRING, INPUT_FOCUS_DELAY_TIME_IN_MS } from '../../constants';
import { navigate } from '../../NavigationService';
import { SortationPutawayScreenType } from '../../types/sortation';
import { isProductBarcodeValid } from '../../utils/utils';
import PutawayDetails from './PutawayDetails';
import { SkipButton } from './SkipButton';
import styles from './styles';

// NOTE: Currently, Product Scan and Location Scan are implemented as separate screens.
// If their scanning flow and UI remain largely the same, we can consider merging them
// into a single reusable screen in the future.

type PutawayProductScanRouteProp = RouteProp<
  {
    SortationPutawayProductScan: SortationPutawayScreenType;
  },
  'SortationPutawayProductScan'
>;

export default function PutawayProductScanScreen() {
  const { params } = useRoute<PutawayProductScanRouteProp>();
  const { taskList, currentTaskIndex, isDirectPutaway } = params;
  const putawayDetails = taskList[currentTaskIndex];
  const inputRef = useRef<TextInput | null>(null);
  const isFocused = useIsFocused();
  const [putawayProductBarcode, setPutawayProductBarcode] = useState<string | undefined>();

  useEffect(() => {
    if (!isFocused) {
      return;
    }

    setPutawayProductBarcode(EMPTY_STRING);

    const t = setTimeout(() => inputRef.current?.focus(), INPUT_FOCUS_DELAY_TIME_IN_MS);
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
    setPutawayProductBarcode(barcode);
  }

  function handleSubmit() {
    if (!putawayProductBarcode) {
      Alert.alert('Invalid Product Barcode', 'Please enter a valid putaway product barcode.');
      return;
    }

    const product = putawayDetails.inventoryItem?.product;

    const isValid = isProductBarcodeValid(putawayProductBarcode, product);

    if (!isValid) {
      Alert.alert(
        'Invalid Product Barcode',
        `The scanned barcode does not match the expected putaway product (${product?.productCode}).`
      );
      setPutawayProductBarcode(EMPTY_STRING);
      return;
    }

    navigate('SortationPutawayQuantity', {
      taskList,
      currentTaskIndex,
      isDirectPutaway
    });
  }

  return (
    <ScrollView keyboardShouldPersistTaps="handled" style={styles.contentContainer}>
      <PutawayDetails putawayDetails={putawayDetails} />

      <Divider />

      <View style={styles.formContainer}>
        <Subheading style={styles.subheading}>Scan Putaway Product Barcode</Subheading>

        <PaperTextInput
          ref={inputRef}
          autoCompleteType="off"
          style={styles.topSpace}
          mode="outlined"
          label="Putaway Product Entry Field"
          keyboardType="number-pad"
          value={putawayProductBarcode}
          returnKeyType="done"
          onChangeText={handleChange}
          onSubmitEditing={handleSubmit}
        />

        <Button style={styles.topSpace} title="Confirm" mode="contained" size="100%" onPress={handleSubmit}>
          Submit
        </Button>
        <SkipButton taskList={taskList} currentTaskIndex={currentTaskIndex} />
      </View>
    </ScrollView>
  );
}
