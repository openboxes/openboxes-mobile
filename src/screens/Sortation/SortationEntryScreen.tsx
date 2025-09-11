import { useIsFocused } from '@react-navigation/native';
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, TextInput, View } from 'react-native';
import { TextInput as PaperTextInput, Paragraph, Title } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import { appConfig, EMPTY_STRING, INPUT_FOCUS_DELAY_TIME_IN_MS } from '../../constants';
import { navigate } from '../../NavigationService';
import { getSortationDetailsByBarcode } from '../../redux/actions/products';
import { SortationTask } from '../../types/sortation';
import styles from './styles';

export default function SortationEntryScreen() {
  const [barcode, setBarcode] = useState<string>('');
  const isFocused = useIsFocused();
  const inputRef = useRef<TextInput | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isFocused) {
      return;
    }

    setBarcode(EMPTY_STRING);

    const t = setTimeout(() => inputRef.current?.focus(), INPUT_FOCUS_DELAY_TIME_IN_MS);
    return () => clearTimeout(t);
  }, [isFocused]);

  const performScan = useCallback(
    (raw: string) => {
      const code = raw.trim();
      if (!code) {
        Alert.alert(
          'Empty Barcode', 
          'You must scan a barcode or enter a code manually to proceed.'
        );
        return;
      }

      dispatch(
        getSortationDetailsByBarcode(code, (response) => {
          if (response && !response.error) {
            const { product, tasks } = response || {};

            const allowedStatuses = ['PENDING', 'IN_PROGRESS'];
            const filteredTasks = (tasks || []).filter((task: SortationTask) => allowedStatuses.includes(task.status));
            if (filteredTasks.length === 0) {
              Alert.alert(
                'No Valid Tasks',
                `No sortation tasks with valid status (${allowedStatuses.join(', ')}) were found for this product.`
              );
            } else if (filteredTasks.length === 1) {
              navigate('SortationQuantity', { product, task: filteredTasks[0] });
            } else {
              navigate('SortationTaskList', { product, tasks: filteredTasks });
            }
          } else {
            Alert.alert(
              'Sortation Failed',
              response?.errorMessage || 'Could not find a product with the scanned barcode.'
            );
          }
          setBarcode(EMPTY_STRING);
        })
      );
    },
    [dispatch]
  );

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
        label="Product Barcode"
        value={barcode}
        returnKeyType="done"
        onChangeText={handleChange}
        onSubmitEditing={handleSubmit}
      />
    </View>
  );
}
