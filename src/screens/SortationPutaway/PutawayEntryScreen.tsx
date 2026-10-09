import React, { useCallback } from 'react';
import { ScrollView, View } from 'react-native';
import { Paragraph, Title } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import { ScanErrorText } from '../../components/ScanErrorText';
import { ScannerInput } from '../../components/ScannerInput';
import { SearchButton } from '../../components/SearchButton';
import { useSearchButton } from '../../components/SearchButton/useSearchButton';
import { EMPTY_STRING } from '../../constants';
import { useScanField } from '../../hooks/useScanField';
import { navigate } from '../../NavigationService';
import { getPutawayDetailsByContainerId } from '../../redux/actions/putaways';
import { SortationTask } from '../../types/sortation';
import styles from './styles';

export default function PutawayEntryScreen() {
  const containerScan = useScanField();
  const { pass, fail, setValue } = containerScan;
  const dispatch = useDispatch();
  const { isSearchOpen, searchButtonProps } = useSearchButton({ onSelect: containerScan.onChange });

  const performScan = useCallback(
    (containerId: string) => {
      dispatch(
        getPutawayDetailsByContainerId(containerId, (response) => {
          if (response && !response.error) {
            const allTasks: SortationTask[] = response?.response?.data || [];

            if (allTasks.length > 0) {
              pass();
              setValue(EMPTY_STRING);
              navigate('SortationPutawayMode', {
                containerId
              });
            } else {
              fail(`No open tasks found for container ${containerId}.`);
            }
          } else {
            fail(response?.errorMessage || 'Error while fetching putaway tasks.');
          }
        })
      );
    },
    [dispatch, pass, fail, setValue]
  );

  return (
    <ScrollView keyboardShouldPersistTaps="always" style={styles.screen}>
      <Title>Scan Putaway Container ID</Title>
      <Paragraph>Point your barcode scanner at the container ID or use search to find it.</Paragraph>

      <View style={styles.scannerRow}>
        <ScannerInput
          style={styles.scannerInput}
          label="Putaway Container ID"
          value={containerScan.value}
          isEnabled={!isSearchOpen}
          danger={!!containerScan.error}
          onChange={containerScan.onChange}
          onSubmit={performScan}
        />
        <SearchButton searchType="container" {...searchButtonProps} />
      </View>
      <ScanErrorText message={containerScan.error} />
    </ScrollView>
  );
}
