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

      dispatch(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        getPutawayDetailsByContainerId(containerId, (response) => {
          if (response && !response.error) {
            const task = response?.response?.data[0];
            navigate('SortationPutawayLocationScan', { putawayDetails: task });
          } else {
            Alert.alert(
              'Not found',
              `Container ${containerId} not found`
            );
          }
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
