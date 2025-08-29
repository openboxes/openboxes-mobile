import { useIsFocused } from '@react-navigation/native';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, TextInput, View } from 'react-native';
import { TextInput as PaperTextInput, Paragraph, Title } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import { appConfig } from '../../constants';
import { navigate } from '../../NavigationService';
import { getPutawayDetailsByContainerId } from '../../redux/actions/putaways';
import styles from './styles';

export default function PutawayEntryScreen() {
  const [putawayContainerId, setPutawayContainerId] = useState<string>('');
  const inputRef = useRef<TextInput | null>(null);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    const t = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(t);
  }, [isFocused]);

  const performScan = useCallback(
    (rawContainerId: string) => {
      const containerId = rawContainerId.trim();

      if (!containerId) {
        Alert.alert('Empty Container Id', 'You must scan a container ID or enter a code manually to proceed.');
        return;
      }

      // TODO [Putaway]: Implement navigation based on response and handle exceptions (Screen 5, 6 - Putaway Mock Up)
      dispatch(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        getPutawayDetailsByContainerId(containerId, (response) => {
          // if (!response || response.error) {
          //   Alert.alert(
          //     'Fetching Putaway Failed',
          //     response?.errorMessage || 'Could not find a putaway with the scanned container ID.'
          //   );
          //   return;
          // }

          const mockedPutawayDetails = {
            putawayContainerId: containerId,
            product: {
              id: 'mocked-product-id',
              name: 'Mocked Product',
              description: 'This is a mocked product description.',
              code: 'MP-001'
            },
            location: {
              id: 'mocked-location-id',
              name: 'Mocked Location',
              code: 'ML-001'
            },
            quantity: 10
          };

          navigate('SortationPutawayLocationScan', { putawayDetails: mockedPutawayDetails });
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

  const handleChange = (id: string) => {
    setPutawayContainerId(id);
    debouncedScan(id);
  };

  const handleSubmit = () => {
    performScan(putawayContainerId);
  };

  return (
    <View style={styles.screen}>
      <Title>Scan Putaway Container ID</Title>
      <Paragraph>Point your barcode scanner at the container ID or type the code manually.</Paragraph>

      <PaperTextInput
        style={styles.topSpace}
        autoCompleteType="off"
        ref={inputRef}
        mode="outlined"
        label="Putaway Container ID"
        value={putawayContainerId}
        returnKeyType="done"
        onChangeText={handleChange}
        onSubmitEditing={handleSubmit}
      />
    </View>
  );
}
