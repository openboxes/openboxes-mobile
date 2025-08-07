import { useIsFocused } from '@react-navigation/native';
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, TextInput, View } from 'react-native';
import { TextInput as PaperTextInput, Paragraph, Title } from 'react-native-paper';

import { navigate } from '../../NavigationService';
import styles from './styles';

function getProduct() {
  return {
    id: 1,
    name: 'Dummy Product',
    barcode: '12345'
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
      Alert.alert('Empty Barcode', 'Please enter a barcode.');
      return;
    }

    /**
     * TO DO: Handle the validation and processing of the scanned barcode.
     * - Fetch and validate the product exists in the system.
     * - Check if the product is on Inbound Movement.
     * - If valid, navigate to SortationDetail screen with the barcode.
     */
    const product = getProduct();

    navigate('SortationDetail', { product });
  }, []);

  const debouncedScan = useMemo(() => debounce(performScan, 300), [performScan]);

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
        style={styles.input}
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
