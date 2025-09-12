import { useIsFocused } from '@react-navigation/native';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, TextInput, View } from 'react-native';
import { TextInput as PaperTextInput, Paragraph, Title } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import { appConfig, EMPTY_STRING, INPUT_FOCUS_DELAY_TIME_IN_MS } from '../../constants';
import { navigate } from '../../NavigationService';
import { getPutawayDetailsByContainerId } from '../../redux/actions/putaways';
import styles from './styles';
import { SortationTask } from '../../types/sortation';

export default function PutawayEntryScreen() {
  const [putawayContainerId, setPutawayContainerId] = useState<string>('');
  const inputRef = useRef<TextInput | null>(null);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isFocused) {
      return;
    }

    setPutawayContainerId(EMPTY_STRING);

    const t = setTimeout(() => inputRef.current?.focus(), INPUT_FOCUS_DELAY_TIME_IN_MS);
    return () => clearTimeout(t);
  }, [isFocused]);

  const performScan = useCallback(
    (rawContainerId: string) => {
      const containerId = rawContainerId.trim();

      if (!containerId) {
        Alert.alert('Empty Container ID', 'You must scan a container ID or enter a code manually to proceed.');
        return;
      }

      dispatch(
        getPutawayDetailsByContainerId(containerId, (response) => {
          if (response && !response.error) {
            const allTasks: SortationTask[] = response?.response?.data || [];
            const filteredTasks = allTasks.filter((task) => task.status === 'IN_TRANSIT');
            if (filteredTasks.length > 0) {
              navigate('SortationPutawayLocationScan', {
                taskList: filteredTasks,
                currentTaskIndex: 0
              });
            } else {
              Alert.alert('No Valid Tasks Found', `No IN_TRANSIT tasks found for container ${containerId}`);
            }
          } else {
            Alert.alert('Not found', `Container ${containerId} not found`);
          }
          setPutawayContainerId(EMPTY_STRING);
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
