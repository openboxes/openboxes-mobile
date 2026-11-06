import React, { useEffect } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { Button, Divider, Paragraph, Subheading } from 'react-native-paper';

import EmptyView from '../../components/EmptyView';
import { ScanErrorText } from '../../components/ScanErrorText';
import { ScannerInput } from '../../components/ScannerInput';
import { SearchButton } from '../../components/SearchButton';
import { useSearchButton } from '../../components/SearchButton/useSearchButton';
import { EMPTY_STRING } from '../../constants';
import { useScanField } from '../../hooks/useScanField';
import { navigate } from '../../NavigationService';
import { useReplenishmentContext } from './ReplenishmentContext';
import { ReplenishmentTaskDetails } from './ReplenishmentTaskDetails';
import { useReplenishmentScanLog } from './scanLog';
import styles from './styles';

export function ReplenishmentLocationScreen() {
  const { currentList, currentTask, currentTaskIndex, tasksCount, openTasksCount, skipCurrentTask } =
    useReplenishmentContext();
  const locationScan = useScanField();
  const resetLocationScan = locationScan.setValue;
  const { isSearchOpen, searchButtonProps } = useSearchButton({ onSelect: locationScan.onChange });
  const logScan = useReplenishmentScanLog();

  // A skipped task brings another one into view, which needs a fresh scan
  useEffect(() => {
    resetLocationScan(EMPTY_STRING);
  }, [currentTask?.id, resetLocationScan]);

  if (!currentTask) {
    return (
      <View style={styles.flex1}>
        <EmptyView
          title="No Replenishment Task"
          description="There is no replenishment task to work on. Choose a replenishment list to start."
        />
        <Button mode="text" style={styles.marginBottom} onPress={() => navigate('ReplenishmentList')}>
          Back To List
        </Button>
      </View>
    );
  }

  const expectedLocation = currentTask.location?.locationNumber;

  function handleScan(locationBarcode: string) {
    if (!expectedLocation) {
      logScan('LOCATION', 'FAIL', locationBarcode);
      locationScan.fail('There is no pick location assigned to this task.');
      return;
    }

    if (locationBarcode !== expectedLocation) {
      logScan('LOCATION', 'FAIL', locationBarcode, expectedLocation);
      locationScan.fail(
        `Incorrect location for Picking. Please Scan Again (scanned ${locationBarcode}, expected ${expectedLocation}).`
      );
      return;
    }

    logScan('LOCATION', 'PASS', locationBarcode, expectedLocation);
    locationScan.setValue(EMPTY_STRING);
    locationScan.pass();
    navigate('ReplenishmentProduct');
  }

  function handleSkip() {
    Alert.alert(
      'Skip Replenishment Task',
      'Are you sure you want to skip this task? It will be moved to the end of the list.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Skip', style: 'destructive', onPress: skipCurrentTask }
      ]
    );
  }

  return (
    <ScrollView style={styles.flex1} keyboardShouldPersistTaps="handled">
      <ReplenishmentTaskDetails
        task={currentTask}
        list={currentList}
        taskIndex={currentTaskIndex}
        tasksCount={tasksCount}
      />

      <Divider />

      <View style={styles.wrapperWithPadding}>
        <Subheading style={styles.subheading}>Scan Pick Location Barcode</Subheading>
        <Paragraph style={styles.paragraph}>
          Point your barcode scanner at the pick location barcode or use search to find it.
        </Paragraph>

        <View style={styles.scannerRow}>
          <ScannerInput
            style={styles.scannerInput}
            label="Pick Location"
            value={locationScan.value}
            isEnabled={!isSearchOpen}
            danger={!!locationScan.error}
            onChange={locationScan.onChange}
            onSubmit={handleScan}
          />
          <SearchButton searchType="location" {...searchButtonProps} />
        </View>
        <ScanErrorText message={locationScan.error} />

        {openTasksCount > 1 && (
          <Button mode="text" style={styles.marginTop} onPress={handleSkip}>
            Skip
          </Button>
        )}
      </View>
    </ScrollView>
  );
}
