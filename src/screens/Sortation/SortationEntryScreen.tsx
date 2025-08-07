import { useIsFocused } from '@react-navigation/native';
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, TextInput, View } from 'react-native';
import { TextInput as PaperTextInput, Paragraph, Title } from 'react-native-paper';

import { appConfig } from '../../constants';
import { navigate } from '../../NavigationService';
import styles from './styles';

function getProduct() {
  return {
    active: true,
    category: 'Pain',
    color: null,
    putawayZone: '2025-05-05T09:28:46Z',
    description: 'Morphine is a powerful pain reliever used to treat moderate to severe pain.',
    displayNames: { default: null },
    handlingIcons: [{ color: '#db1919', icon: 'fa-exclamation-circle', label: 'Controlled substance' }],
    id: '40288094969fb47401969fc6c2cb0096',
    finalStorageLocation: '2025-05-05T09:28:46Z',
    lotAndExpiryControl: true,
    name: 'Morphine 10mg immediate release tablet',
    quantityRequired: 25,
    productCode: 'QX039',
    unitOfMeasure: 'Each',
    updatedBy: 'Miss Administrator'
  };
}

export default function SortationEntryScreen() {
  const [barcode, setBarcode] = useState<string>('');
  const isFocused = useIsFocused();
  const inputRef = useRef<TextInput | null>(null);

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    const t = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(t);
  }, [isFocused]);

  const performScan = useCallback((raw: string) => {
    const code = raw.trim();
    if (!code) {
      Alert.alert('Empty Barcode', 'You must scan a barcode or enter a code manually to proceed.');
      return;
    }

    /**
     * TO DO: Handle the validation and processing of the scanned barcode.
     * - Fetch and validate the product exists in the system.
     * - Check if the product is on Inbound Movement.
     * - If valid, navigate to SortationQuantity screen with the barcode.
     */
    const product = getProduct();

    setBarcode('');

    navigate('SortationQuantity', { product });
  }, []);

  const debouncedScan = useMemo(() => debounce(performScan, appConfig.DEFAULT_DEBOUNCE_TIME), [performScan]);

  useEffect(() => {
    return () => {
      debouncedScan.cancel();
    };
  }, [debouncedScan]);

  const handleChange = (text: string) => {
    setBarcode(text);
    debouncedScan(text);
  };

  const handleSubmit = () => {
    performScan(barcode);
  };

  return (
    <View style={styles.screen}>
      <Title>Scan Product Barcode For Sortation</Title>
      <Paragraph>
        Point your barcode scanner at the product or type the code manually, then wait a moment for it to auto‐submit.
      </Paragraph>

      <PaperTextInput
        style={styles.topSpace}
        autoCompleteType="off"
        ref={inputRef}
        mode="outlined"
        label="Barcode"
        value={barcode}
        returnKeyType="done"
        onChangeText={handleChange}
        onSubmitEditing={handleSubmit}
      />
    </View>
  );
}
