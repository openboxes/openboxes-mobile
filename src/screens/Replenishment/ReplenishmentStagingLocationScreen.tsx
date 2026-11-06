import React, { useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { Button, Card, Chip, Divider, Paragraph, Subheading, Text } from 'react-native-paper';

import { LayoutStyle } from '../../assets/styles';
import EmptyView from '../../components/EmptyView';
import { ProductDetails } from '../../components/ProductDetails';
import { ScanErrorText } from '../../components/ScanErrorText';
import { ScannerInput } from '../../components/ScannerInput';
import { SearchButton } from '../../components/SearchButton';
import { useSearchButton } from '../../components/SearchButton/useSearchButton';
import { EMPTY_STRING, HYPHEN } from '../../constants';
import { useScanField } from '../../hooks/useScanField';
import { navigate, resetToRoutes } from '../../NavigationService';
import { ContainerToStage, summarizeListTasks } from './lib';
import { useReplenishmentContext } from './ReplenishmentContext';
import { useReplenishmentScanLog } from './scanLog';
import styles from './styles';

/**
 * Stages the containers of the list one by one, like outbound picking: the expected staging location is shown, and
 * the server accepts or rejects the scanned one.
 */
export function ReplenishmentStagingLocationScreen() {
  const { currentList, listTasks, loadListTasks, dropContainerAtStagingLocation, resetReplenishmentSession } =
    useReplenishmentContext();
  const stagingScan = useScanField();
  const { isSearchOpen, searchButtonProps } = useSearchButton({ onSelect: stagingScan.onChange });
  const logScan = useReplenishmentScanLog();

  // Taken once, so staging a container does not shift the ones left
  const [containers, setContainers] = useState<ContainerToStage[] | undefined>(undefined);
  const [containerIndex, setContainerIndex] = useState(0);

  const hasRequestedTasks = useRef(false);
  const [hasLoadedTasks, setHasLoadedTasks] = useState(false);

  useEffect(() => {
    if (containers) {
      return;
    }
    // The summary loads the tasks of the list before staging; load them here only when they are missing
    if (listTasks.length > 0 || hasLoadedTasks) {
      setContainers(summarizeListTasks(listTasks).containersToStage);
      return;
    }
    if (!hasRequestedTasks.current) {
      hasRequestedTasks.current = true;
      loadListTasks(() => setHasLoadedTasks(true));
    }
  }, [containers, listTasks, hasLoadedTasks, loadListTasks]);

  if (!containers) {
    return null;
  }

  const current = containers[containerIndex];

  if (!currentList || !current) {
    return (
      <View style={styles.flex1}>
        <EmptyView title="Replenishment Staging" description="There are no replenishment containers to stage." />
        <Button mode="text" style={styles.marginBottom} onPress={() => navigate('ReplenishmentList')}>
          Back To List
        </Button>
      </View>
    );
  }

  const containerNumber = current.container.locationNumber;

  function completeStaging() {
    Alert.alert('Staging Complete', `${currentList?.orderNumber} is staged and ready for putaway.`, [
      {
        text: 'OK',
        onPress: () => {
          resetReplenishmentSession();
          resetToRoutes([{ name: 'Drawer', params: { screen: 'Dashboard' } }]);
        }
      }
    ]);
  }

  function handleScan(stagingLocationId: string) {
    if (!stagingLocationId) {
      return;
    }

    dropContainerAtStagingLocation(current.container.id, stagingLocationId, ({ errorMessage }) => {
      if (errorMessage) {
        logScan('STAGING', 'FAIL', stagingLocationId, current.stagingLocation?.locationNumber, {
          message: `${containerNumber}: ${errorMessage}`
        });
        stagingScan.fail(errorMessage);
        return;
      }

      logScan('STAGING', 'PASS', stagingLocationId, current.stagingLocation?.locationNumber, {
        message: containerNumber
      });
      stagingScan.setValue(EMPTY_STRING);
      if (containerIndex + 1 < (containers?.length ?? 0)) {
        stagingScan.pass();
        setContainerIndex(containerIndex + 1);
        return;
      }
      stagingScan.pass(completeStaging);
    });
  }

  return (
    <ScrollView style={styles.flex1} keyboardShouldPersistTaps="handled">
      <Card style={LayoutStyle.listItemContainer}>
        <Card.Content>
          <View style={styles.headerRow}>
            <Chip icon="identifier" style={[styles.chipDefault, styles.orderNumberChip]}>
              <Text style={[styles.orderNumberText, styles.fontBold]}>{currentList.orderNumber ?? HYPHEN}</Text>
            </Chip>
            <Chip icon="navigation" style={styles.chipDefault}>
              <Text style={styles.chipText}>
                Container:{' '}
                <Text style={[styles.chipText, styles.fontBold]}>{`${containerIndex + 1} / ${containers.length}`}</Text>
              </Text>
            </Chip>
          </View>

          <Divider style={styles.divider} />

          <ProductDetails.List
            items={[
              { icon: 'package-variant-closed', label: 'Outbound Container ID', value: containerNumber },
              { icon: 'tray-arrow-down', label: 'Staging Location', value: current.stagingLocation?.name ?? HYPHEN },
              {
                icon: 'barcode',
                label: 'Products',
                value: current.tasks.map((task) => `${task.product?.productCode} (${task.quantityPicked})`).join(', ')
              }
            ]}
          />
        </Card.Content>
      </Card>

      <View style={styles.wrapperWithPadding}>
        <Subheading style={styles.subheading}>Scan Staging Location</Subheading>
        <Paragraph style={styles.paragraph}>
          Put the container in the staging location and scan its barcode, or use search to find it.
        </Paragraph>

        <View style={styles.scannerRow}>
          <ScannerInput
            style={styles.scannerInput}
            label="Staging Location ID"
            value={stagingScan.value}
            isEnabled={!isSearchOpen}
            danger={!!stagingScan.error}
            onChange={stagingScan.onChange}
            onSubmit={handleScan}
          />
          <SearchButton searchType="location" {...searchButtonProps} />
        </View>
        <ScanErrorText message={stagingScan.error} />
      </View>
    </ScrollView>
  );
}
