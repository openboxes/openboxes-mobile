import * as React from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { Divider, Paragraph, Subheading } from 'react-native-paper';

import { ProductDetails } from '../../components/ProductDetails';
import { ScannerInput } from '../../components/ScannerInput';
import { SearchButton } from '../../components/SearchButton';
import { useSearchButton } from '../../components/SearchButton/useSearchButton';
import { EMPTY_STRING, HYPHEN } from '../../constants';
import { resetToRoutes } from '../../NavigationService';
import { parseFromISODateToLocaleString } from '../../utils/utils';
import { usePickingContext } from './PickingContext';
import styles from './styles';

export default function PickingPickStagingLocationScreen() {
  const { tasks, dropCurrentTask, resetSession, setCurrentTaskIndex } = usePickingContext();
  const [stagingLocationNumber, setStagingLocationNumber] = React.useState(EMPTY_STRING);
  const [currentUniqueIndex, setCurrentUniqueIndex] = React.useState(0);
  const { isSearchOpen, searchButtonProps } = useSearchButton({ onSelect: setStagingLocationNumber });

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
      resetToRoutes([{ name: 'Drawer', params: { screen: 'Dashboard' } }, { name: 'PickingPickType' }]);
    }
  }, [currentTask, tasks.length, setCurrentTaskIndex, uniqueTasks.length, tasks]);

  function handleScan(locationId: string) {
    const expected = currentTask.stagingLocation?.locationNumber;

    if (!expected || locationId !== expected) {
      Alert.alert(
        'Invalid Staging Location',
        `Expected: ${expected ?? '-'}, but got: ${locationId}. Please try again.`
      );
      setStagingLocationNumber(EMPTY_STRING);
      return;
    }

    dropCurrentTask(currentTask, (response) => {
      if (response.errorMessage) {
        Alert.alert('Error', response.errorMessage);
        setStagingLocationNumber(EMPTY_STRING);
        return;
      }

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
              resetToRoutes([{ name: 'Drawer', params: { screen: 'Dashboard' } }, { name: 'PickingPickType' }]);
            }
          }
        ]);
      }
    });
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
              },
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
    </ScrollView>
  );
}
