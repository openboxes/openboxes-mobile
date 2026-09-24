import * as React from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { Divider, Paragraph, Subheading } from 'react-native-paper';

import StagingLocationZoneMismatchModal from '../../components/StagingLocationZoneMismatchModal';
import { ProductDetails } from '../../components/ProductDetails';
import { ScannerInput } from '../../components/ScannerInput';
import { SearchButton } from '../../components/SearchButton';
import { useSearchButton } from '../../components/SearchButton/useSearchButton';
import { EMPTY_STRING, HYPHEN } from '../../constants';
import { resetToRoutes } from '../../NavigationService';
import { parseFromISODateToLocaleString } from '../../utils/utils';
import { CustomerDetails } from './CustomerDetails';
import { usePickingContext } from './PickingContext';
import styles from './styles';

export default function PickingPickStagingLocationScreen() {
  const { tasks, dropCurrentTaskAtStagingLocation, resetSession, setCurrentTaskIndex, homeRoute } = usePickingContext();
  const [stagingLocationNumber, setStagingLocationNumber] = React.useState(EMPTY_STRING);
  const [currentUniqueIndex, setCurrentUniqueIndex] = React.useState(0);
  const { isSearchOpen, searchButtonProps } = useSearchButton({ onSelect: setStagingLocationNumber });

  const [pendingLocationId, setPendingLocationId] = React.useState(EMPTY_STRING);
  const [zoneMismatchMessage, setZoneMismatchMessage] = React.useState<string | undefined>(undefined);

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

  function advanceOrComplete() {
    const nextIndex = currentUniqueIndex + 1;
    if (nextIndex < uniqueTasks.length) {
      Alert.alert('Success', 'Staging Location confirmed. Proceeding to the next container.', [
        {
          text: 'OK',
          onPress: () => {
            setCurrentUniqueIndex(nextIndex);
            setStagingLocationNumber(EMPTY_STRING);
          }
        }
      ]);
    } else {
      Alert.alert('Picking Session Complete', 'You have completed all staging confirmations.', [
        {
          text: 'OK',
          onPress: () => {
            resetSession();
            resetToRoutes([{ name: 'Drawer', params: { screen: 'Dashboard' } }, { name: homeRoute }]);
          }
        }
      ]);
    }
  }

  // Always defers to the server: it's the authority on whether the scanned location is valid for
  // this delivery type's zone (per-facility configurable). A mismatch surfaces a modal offering
  // to stage at the scanned location anyway, rather than a plain error.
  function handleScan(locationId: string) {
    if (!locationId) {
      return;
    }

    dropCurrentTaskAtStagingLocation(currentTask, locationId, (response) => {
      if (response.overridable) {
        setPendingLocationId(locationId);
        setZoneMismatchMessage(response.errorMessage);
        return;
      }

      if (response.errorMessage) {
        Alert.alert('Error', response.errorMessage);
        setStagingLocationNumber(EMPTY_STRING);
        return;
      }

      advanceOrComplete();
    });
  }

  function handleStageAnyway() {
    setZoneMismatchMessage(undefined);

    dropCurrentTaskAtStagingLocation(
      currentTask,
      pendingLocationId,
      (response) => {
        if (response.errorMessage) {
          Alert.alert('Error', response.errorMessage);
          setStagingLocationNumber(EMPTY_STRING);
          return;
        }

        advanceOrComplete();
      },
      true
    );
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
              value={stagingLocationNumber}
              isEnabled={!isSearchOpen}
              onChange={setStagingLocationNumber}
              onSubmit={handleScan}
            />
            <SearchButton searchType="location" {...searchButtonProps} />
          </View>
        </View>
      </ProductDetails.Provider>

      <StagingLocationZoneMismatchModal
        visible={!!zoneMismatchMessage}
        message={zoneMismatchMessage}
        onScanAnother={() => {
          setZoneMismatchMessage(undefined);
          setStagingLocationNumber(EMPTY_STRING);
        }}
        onStageAnyway={handleStageAnyway}
      />
    </ScrollView>
  );
}
