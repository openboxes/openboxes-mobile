import * as React from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { Divider, Paragraph, Subheading } from 'react-native-paper';

import { ProductDetails } from '../../components/ProductDetails';
import { ScanErrorText } from '../../components/ScanErrorText';
import { ScannerInput } from '../../components/ScannerInput';
import { SearchButton } from '../../components/SearchButton';
import { useSearchButton } from '../../components/SearchButton/useSearchButton';
import { EMPTY_STRING, HYPHEN } from '../../constants';
import { useScanField } from '../../hooks/useScanField';
import { resetToRoutes } from '../../NavigationService';
import { parseFromISODateToLocaleString } from '../../utils/utils';
import { CustomerDetails } from './CustomerDetails';
import { usePickingContext } from './PickingContext';
import styles from './styles';

// Lets the user stage at any scanned location. Set to false to require the scanned location to
// match the one suggested by the pick task.
const SKIP_STAGING_LOCATION_VALIDATION = true;

export default function PickingPickStagingLocationScreen() {
  const { tasks, dropCurrentTask, dropCurrentTaskAtStagingLocation, resetSession, setCurrentTaskIndex, homeRoute } =
    usePickingContext();
  const stagingScan = useScanField();
  const [currentUniqueIndex, setCurrentUniqueIndex] = React.useState(0);
  const { isSearchOpen, searchButtonProps } = useSearchButton({ onSelect: stagingScan.onChange });

  // Memoize unique tasks based on outbound container ID
  const uniqueTasks = React.useMemo(() => {
    const tasksWithContainers = tasks.filter((t) => t.outboundContainer?.id);
    return Array.from(new Map(tasksWithContainers.map((t) => [t?.outboundContainer?.id, t])).values());
  }, [tasks]);

  const currentTask = uniqueTasks[currentUniqueIndex];

  // Handle Navigation and Session Completion side effects
  React.useEffect(() => {
    if (!currentTask) {
      // No tasks left at all, return to home
      Alert.alert('Staging', 'No more tasks available for staging drop.');
      resetToRoutes([{ name: 'Drawer', params: { screen: 'Dashboard' } }, { name: homeRoute }]);
    }
  }, [currentTask, tasks.length, setCurrentTaskIndex, uniqueTasks.length, tasks, homeRoute]);

  function handleDropResponse(response: { errorMessage?: string }) {
    if (response.errorMessage) {
      stagingScan.fail(response.errorMessage);
      return;
    }

    const nextIndex = currentUniqueIndex + 1;
    if (nextIndex < uniqueTasks.length) {
      stagingScan.pass();
      setCurrentUniqueIndex(nextIndex);
      stagingScan.setValue(EMPTY_STRING);
      return;
    }

    stagingScan.pass(() =>
      Alert.alert('Picking Session Complete', 'You have completed all staging confirmations.', [
        {
          text: 'OK',
          onPress: () => {
            resetSession();
            resetToRoutes([{ name: 'Drawer', params: { screen: 'Dashboard' } }, { name: homeRoute }]);
          }
        }
      ])
    );
  }

  // Requires the scanned location to match the one suggested by the task. Used when SKIP_STAGING_LOCATION_VALIDATION is false.
  function handleScan(locationId: string) {
    const expected = currentTask.stagingLocation?.locationNumber;

    if (!expected || locationId !== expected) {
      stagingScan.fail(`Incorrect staging location scanned (${locationId}). Expected: ${expected ?? '-'}.`);
      return;
    }

    dropCurrentTask(currentTask, handleDropResponse);
  }

  // Drops at whatever location the user scans, without checking it against the task's suggestion.
  // Used when SKIP_STAGING_LOCATION_VALIDATION is true.
  function handleScanWithoutValidation(locationId: string) {
    if (!locationId) {
      return;
    }

    dropCurrentTaskAtStagingLocation(currentTask, locationId, handleDropResponse);
  }

  // If no task is selected yet, return null to avoid rendering
  // ProductDetails with undefined data while useEffect runs
  if (!currentTask) {
    return null;
  }

  return (
    <ScrollView style={styles.flex1} keyboardShouldPersistTaps="handled">
      <ProductDetails.Provider product={currentTask.product} status={currentTask.status}>
        <ProductDetails.Root>
          <ProductDetails.Header>
            <ProductDetails.Badge icon="navigation" label="Task Progress">
              {`${currentUniqueIndex + 1} / ${uniqueTasks.length}`}
            </ProductDetails.Badge>
          </ProductDetails.Header>

          <ProductDetails.Separator />
          <ProductDetails.Title />
          <ProductDetails.Caption
            title={currentTask.inventoryItem.lotNumber}
            subtitle={parseFromISODateToLocaleString(currentTask.inventoryItem.expirationDate)}
          />

          <ProductDetails.List
            items={[
              {
                icon: 'identifier',
                label: 'Order Number',
                value: currentTask.requisitionNumber || HYPHEN
              }
            ]}
          />
          <CustomerDetails
            name={currentTask.destination}
            locationType={currentTask.destinationLocationType}
            address={currentTask.destinationAddress}
          />
          <ProductDetails.List
            items={[
              {
                icon: 'account',
                label: 'Assignee',
                value: currentTask?.assignee
                  ? `${currentTask?.assignee?.firstName} ${currentTask?.assignee?.lastName}`.trim()
                  : HYPHEN
              },
              {
                icon: 'pin',
                label: 'Outbound Container',
                value: currentTask.outboundContainer?.locationNumber ?? '-'
              },
              {
                icon: 'package',
                label: 'Staging Location',
                value: currentTask.stagingLocation?.name ?? '-'
              }
            ]}
          />
        </ProductDetails.Root>

        <Divider />

        <View style={[styles.wrapperWithPadding]}>
          <Subheading style={styles.subheading}>Scan Staging Location</Subheading>
          <Paragraph style={styles.paragraph}>
            Point your barcode scanner at the staging location or use search to find it.
          </Paragraph>

          <View style={styles.scannerRow}>
            <ScannerInput
              style={styles.scannerInput}
              label="Staging Location Number"
              value={stagingScan.value}
              isEnabled={!isSearchOpen}
              danger={!!stagingScan.error}
              onChange={stagingScan.onChange}
              onSubmit={SKIP_STAGING_LOCATION_VALIDATION ? handleScanWithoutValidation : handleScan}
            />
            <SearchButton searchType="location" {...searchButtonProps} />
          </View>
          <ScanErrorText message={stagingScan.error} />
        </View>
      </ProductDetails.Provider>
    </ScrollView>
  );
}
