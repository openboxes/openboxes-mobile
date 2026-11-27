import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Divider, Paragraph, Subheading } from 'react-native-paper';

import EmptyView from '../../components/EmptyView';
import { ScanErrorText } from '../../components/ScanErrorText';
import { ScannerInput } from '../../components/ScannerInput';
import { SearchButton } from '../../components/SearchButton';
import { useSearchButton } from '../../components/SearchButton/useSearchButton';
import { EMPTY_STRING } from '../../constants';
import { useScanField } from '../../hooks/useScanField';
import { navigate } from '../../NavigationService';
import { ReasonCode } from '../../types/picking';
import { ReplenishmentTask } from '../../types/replenishment';
import { proceedToNextTask } from './lib';
import { useReplenishmentContext } from './ReplenishmentContext';
import { ReplenishmentTaskDetails } from './ReplenishmentTaskDetails';
import { useReplenishmentScanLog } from './scanLog';
import styles from './styles';

type ReplenishmentOutboundContainerScreenProps = RouteProp<
  { ReplenishmentOutboundContainer: { reasonCode?: ReasonCode; quantityPicked?: string } },
  'ReplenishmentOutboundContainer'
>;

/**
 * Puts the picked quantity in a container, like outbound picking: any container accepted by the server, so several
 * products can share one.
 */
export default function ReplenishmentOutboundContainerScreen() {
  const { currentList, allTasks, currentTask, pickCurrentTask, shortPickTask, currentTaskIndex, tasksCount, goToTask } =
    useReplenishmentContext();
  const { params } = useRoute<ReplenishmentOutboundContainerScreenProps>();
  const containerScan = useScanField();
  const resetContainerScan = containerScan.setValue;
  const { isSearchOpen, searchButtonProps } = useSearchButton({ onSelect: containerScan.onChange });
  const logScan = useReplenishmentScanLog();

  useEffect(() => {
    resetContainerScan(EMPTY_STRING);
  }, [currentTask?.id, resetContainerScan]);

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

  const qtyRemaining = currentTask.quantityRequired - (currentTask.quantityPicked || 0);
  const parsedQuantityPicked = params?.quantityPicked !== undefined ? Number(params.quantityPicked) : qtyRemaining;

  function handleScan(containerId: string) {
    if (!containerId) {
      logScan('CONTAINER', 'FAIL', containerId, undefined, { quantity: parsedQuantityPicked, message: 'Empty scan' });
      containerScan.fail('Please scan or enter a valid Replenishment Container ID.');
      return;
    }

    const onPicked = ({ errorMessage, tasks }: { errorMessage?: string; tasks?: ReplenishmentTask[] }) => {
      if (errorMessage) {
        logScan('CONTAINER', 'FAIL', containerId, undefined, { quantity: parsedQuantityPicked, message: errorMessage });
        containerScan.fail(errorMessage);
        return;
      }
      logScan('CONTAINER', 'PASS', containerId, undefined, { quantity: parsedQuantityPicked });
      containerScan.setValue(EMPTY_STRING);
      containerScan.pass();
      proceedToNextTask({ tasks: tasks ?? allTasks, currentTaskIndex, goToTask });
    };

    if (parsedQuantityPicked < qtyRemaining) {
      shortPickTask(containerId, parsedQuantityPicked, onPicked, params?.reasonCode?.name);
      return;
    }

    pickCurrentTask(containerId, onPicked);
  }

  return (
    <ScrollView style={styles.flex1} keyboardShouldPersistTaps="handled">
      <ReplenishmentTaskDetails
        task={currentTask}
        list={currentList}
        taskIndex={currentTaskIndex}
        tasksCount={tasksCount}
        items={[
          { icon: 'truck', label: 'Quantity Picked', value: parsedQuantityPicked },
          {
            icon: 'package-variant-closed',
            label: 'Outbound Container ID',
            value: currentTask.outboundContainer?.locationNumber ?? 'New'
          }
        ]}
      />

      <Divider />

      <View style={styles.wrapperWithPadding}>
        <Subheading style={styles.subheading}>Scan Replenishment Container</Subheading>
        <Paragraph style={styles.paragraph}>
          Point your barcode scanner at the replenishment container or use search to find it.
        </Paragraph>

        <View style={styles.scannerRow}>
          <ScannerInput
            style={styles.scannerInput}
            label="Replenishment Container ID"
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
