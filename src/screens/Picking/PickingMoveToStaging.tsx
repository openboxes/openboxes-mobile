import * as React from 'react';
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
import { getPickedTasksByContainerAction } from '../../redux/actions/picking';
import styles from './styles';

export default function PickingMoveToStagingScreen() {
  const containerScan = useScanField();
  const { isSearchOpen, searchButtonProps } = useSearchButton({ onSelect: containerScan.onChange });
  const dispatch = useDispatch();

  function handleScan(containerId: string) {
    // Fetch pick tasks
    dispatch(
      getPickedTasksByContainerAction(containerId, ({ response }) => {
        if (response.errorCode) {
          containerScan.fail(response.message || 'An error occurred while fetching pick tasks.');
          return;
        }

        if (!response.data || response.data.length === 0) {
          containerScan.fail(`No picked tasks found for outbound container ${containerId}.`);
          return;
        }

        containerScan.pass();
        // Navigate to the staging screen with the fetched tasks
        navigate('PickingStagingDrop', { tasks: response.data });
      })
    );

    containerScan.setValue(EMPTY_STRING);
  }

  return (
    <ScrollView style={styles.flex1} keyboardShouldPersistTaps="handled">
      <View style={styles.wrapperWithPadding}>
        <Title>Scan The Container</Title>
        <Paragraph>Please scan the barcode of the outbound container you want to move to staging.</Paragraph>

        <View style={styles.scannerRow}>
          <ScannerInput
            style={styles.scannerInput}
            label="Outbound Container ID"
            value={containerScan.value}
            isEnabled={!isSearchOpen}
            danger={!!containerScan.error}
            onChange={containerScan.onChange}
            onSubmit={handleScan}
          />
          <SearchButton searchType="container" {...searchButtonProps} />
        </View>
        <ScanErrorText message={containerScan.error} />
      </View>
    </ScrollView>
  );
}
