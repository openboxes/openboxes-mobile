import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { Paragraph, Title } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import { ScannerInput } from '../../components/ScannerInput';
import { SearchButton } from '../../components/SearchButton';
import { useSearchButton } from '../../components/SearchButton/useSearchButton';
import { EMPTY_STRING } from '../../constants';
import { navigate } from '../../NavigationService';
import { getPutawayDetailsByContainerId } from '../../redux/actions/putaways';
import { SortationTask } from '../../types/sortation';
import styles from './styles';

export default function PutawayEntryScreen() {
  const [putawayContainerId, setPutawayContainerId] = useState<string>(EMPTY_STRING);
  const dispatch = useDispatch();
  const { isSearchOpen, searchButtonProps } = useSearchButton({ onSelect: setPutawayContainerId });

  const performScan = useCallback(
    (containerId: string) => {
      dispatch(
        getPutawayDetailsByContainerId(containerId, (response) => {
          if (response && !response.error) {
            const allTasks: SortationTask[] = response?.response?.data || [];

            if (allTasks.length > 0) {
              navigate('SortationPutawayMode', {
                containerId
              });
            } else {
              Alert.alert('No Valid Tasks Found', `No open tasks found for container ${containerId}`);
            }
          } else {
            Alert.alert('Error', `Error while fetching putaway tasks: ${response?.errorMessage}`);
          }

          setPutawayContainerId(EMPTY_STRING);
        })
      );
    },
    [dispatch]
  );

  return (
    <ScrollView keyboardShouldPersistTaps="always" style={styles.screen}>
      <Title>Scan Putaway Container ID</Title>
      <Paragraph>Point your barcode scanner at the container ID or use search to find it.</Paragraph>

      <View style={styles.scannerRow}>
        <ScannerInput
          style={styles.scannerInput}
          label="Putaway Container ID"
          value={putawayContainerId}
          isEnabled={!isSearchOpen}
          onChange={setPutawayContainerId}
          onSubmit={performScan}
        />
        <SearchButton searchType="container" {...searchButtonProps} />
      </View>
    </ScrollView>
  );
}
