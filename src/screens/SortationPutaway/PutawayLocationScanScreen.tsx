import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Divider, Subheading } from 'react-native-paper';
import { useSelector } from 'react-redux';

import Button from '../../components/Button';
import EmptyView from '../../components/EmptyView';
import { ScanErrorText } from '../../components/ScanErrorText';
import { ScannerInput } from '../../components/ScannerInput';
import { SearchButton } from '../../components/SearchButton';
import { useSearchButton } from '../../components/SearchButton/useSearchButton';
import { EMPTY_STRING } from '../../constants';
import { useScanField } from '../../hooks/useScanField';
import { navigate } from '../../NavigationService';
import { RootState } from '../../redux/reducers';
import { SortationLocation, SortationTask } from '../../types/sortation';
import AlternativeLocationSelector from './AlternativeLocationSelector';
import PutawayDetails from './PutawayDetails';
import { SkipButton } from './SkipButton';
import styles from './styles';

type PutawayLocationScanRouteProp = RouteProp<
  {
    SortationPutawayLocationScan: {
      currentTaskIndex: number;
      isDirectPutaway?: boolean;
      isUserDirected?: boolean;
      containerId?: string;
      task?: SortationTask;
      requiresValidationScan?: boolean;
    };
  },
  'SortationPutawayLocationScan'
>;

export default function PutawayLocationScanScreen() {
  const { params } = useRoute<PutawayLocationScanRouteProp>();
  const { currentTaskIndex, isDirectPutaway, isUserDirected, containerId, task, requiresValidationScan } = params;
  const shouldValidateProduct = requiresValidationScan ?? true;
  const putawayTasks = useSelector((state: RootState) => state.putawayReducer.putawayTasks) as SortationTask[];
  const putawayDetails = task ?? putawayTasks?.[currentTaskIndex];

  const locationScan = useScanField();
  const resetLocationScan = locationScan.setValue;
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const { isSearchOpen, searchButtonProps } = useSearchButton({ onSelect: locationScan.onChange });
  const [selectedAlternativeDestination, setSelectedAlternativeDestination] = useState<SortationLocation | null>(
    putawayDetails?.destination
  );

  useEffect(() => {
    setSelectedAlternativeDestination(putawayDetails?.destination);
  }, [putawayDetails]);

  useEffect(() => {
    resetLocationScan(EMPTY_STRING);
  }, [currentTaskIndex, putawayDetails?.id, resetLocationScan]);

  if (!putawayDetails) {
    return (
      <View style={styles.emptyContainer}>
        <EmptyView
          title="Putaway Details Not Found"
          description="The putaway details you are looking for do not exist or are not available."
        />
      </View>
    );
  }

  const updatedPutawayDetails = {
    ...putawayDetails,
    destination: selectedAlternativeDestination ?? putawayDetails.destination
  };

  function handleProcessing(code: string) {
    const expectedLocation = selectedAlternativeDestination?.locationNumber;

    if (code !== expectedLocation) {
      locationScan.fail(`Incorrect location scanned (${code}). Expected: ${expectedLocation}.`);
      return;
    }

    locationScan.pass();
    navigate(shouldValidateProduct ? 'SortationPutawayProductScan' : 'SortationPutawayQuantity', {
      currentTaskIndex,
      isDirectPutaway,
      isUserDirected,
      containerId,
      task: updatedPutawayDetails
    });
  }

  return (
    <>
      <ScrollView
        keyboardShouldPersistTaps="always"
        style={styles.contentWrapper}
        contentContainerStyle={styles.contentContainer}
      >
        <PutawayDetails
          putawayDetails={updatedPutawayDetails}
          taskIndex={currentTaskIndex}
          totalTasks={putawayTasks?.length || 0}
          showTaskCounter={!isUserDirected}
          onOverrideDestination={() => setIsDialogVisible(true)}
        />

        <Divider />

        <View style={styles.formContainer}>
          <Subheading style={styles.subheading}>Scan destination or use search to find it</Subheading>

          <View style={styles.scannerRow}>
            <ScannerInput
              style={styles.scannerInput}
              label="Destination Entry Field"
              value={locationScan.value}
              isEnabled={!isDialogVisible && !isSearchOpen}
              danger={!!locationScan.error}
              onChange={locationScan.onChange}
              onSubmit={handleProcessing}
            />
            <SearchButton searchType="location" {...searchButtonProps} />
          </View>
          <ScanErrorText message={locationScan.error} />

          {isDirectPutaway ? null : isUserDirected ? (
            <Button
              style={styles.topSpace}
              title="Back To List"
              mode="text"
              size="100%"
              onPress={() => navigate('SortationPutawayTaskList', { containerId })}
            />
          ) : (
            <SkipButton
              taskList={putawayTasks}
              currentTaskIndex={currentTaskIndex}
              isDirectPutaway={isDirectPutaway}
              containerId={containerId}
            />
          )}
        </View>
      </ScrollView>

      <AlternativeLocationSelector
        visible={isDialogVisible}
        putawayDetails={putawayDetails}
        initialLocation={selectedAlternativeDestination}
        onDismiss={() => setIsDialogVisible(false)}
        onConfirm={(location) => {
          setSelectedAlternativeDestination(location);
          setIsDialogVisible(false);
        }}
      />
    </>
  );
}
