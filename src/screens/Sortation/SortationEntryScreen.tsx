import { useIsFocused } from '@react-navigation/native';
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, TextInput, View } from 'react-native';
import { TextInput as PaperTextInput, Paragraph, Title } from 'react-native-paper';

import { appConfig } from '../../constants';
import { navigate } from '../../NavigationService';
import styles from './styles';
import { useDispatch } from 'react-redux';
import { getSortationDetailsByBarcode } from '../../redux/actions/products';

export default function SortationEntryScreen() {
  const [barcode, setBarcode] = useState<string>('');
  const isFocused = useIsFocused();
  const inputRef = useRef<TextInput | null>(null);
  const dispatch = useDispatch();

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

    dispatch(
      getSortationDetailsByBarcode(code, (response) => {
        setBarcode('');
        if (response && !response.error) {
          navigate('SortationQuantity', { product: response.product, task: response.task });
        } else {
          Alert.alert(
            'Error',
            response?.errorMessage || 'Could not find a product with the scanned barcode.'
          );
        }
      })
    );
  }, [dispatch]);

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
