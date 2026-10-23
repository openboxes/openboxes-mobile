import { RouteProp, useRoute } from '@react-navigation/native';
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
import { navigate } from '../../NavigationService';
import { ReasonCode } from '../../types/picking';
import { parseFromISODateToLocaleString } from '../../utils/utils';
import { CustomerDetails } from './CustomerDetails';
import { revalidateTaskAndProceed } from './lib';
import { usePickingContext } from './PickingContext';
import styles from './styles';

type PickingPickOutboundContainerScreenProps = RouteProp<
  { PickingPickOutboundContainer: { reasonCode?: ReasonCode; quantityPicked?: string } },
  'PickingPickOutboundContainer'
>;

export default function PickingPickOutboundContainerScreen() {
  const {
    currentTask,
    pickCurrentTask,
    shortPickTask,
    currentTaskIndex,
    allTasksCount,
    revalidateCurrentTask,
    goToNextTask,
    revalidateTasksForRequisition,
    homeRoute
  } = usePickingContext();
  const { params } = useRoute<PickingPickOutboundContainerScreenProps>();
  const parsedQuantityPicked = params?.quantityPicked ? Number(params.quantityPicked) : undefined;

  const containerScan = useScanField();
  const { isSearchOpen, searchButtonProps } = useSearchButton({ onSelect: containerScan.onChange });

  if (!currentTask) {
    return null;
  }

  function handleScan(containerId: string) {
    if (!currentTask) {
      containerScan.fail('No current pick task available.');
      return;
    }

    if (parsedQuantityPicked !== undefined && parsedQuantityPicked < currentTask.quantityRequired) {
      // Handle Short Pick
      shortPickTask(
        containerId,
        parsedQuantityPicked,
        ({ errorMessage }) => {
          if (errorMessage) {
            containerScan.fail(errorMessage);
            return;
          }

          containerScan.pass();

          if (params?.reasonCode?.id) {
            revalidateCurrentTask((_task, revalidateError) => {
              if (revalidateError) {
                Alert.alert('Error', revalidateError);
              }
              // Revalidate all tasks for the requisition to get updated pick tasks
              revalidateTasksForRequisition(currentTask.requisitionId, (requisitionError) => {
                if (requisitionError) {
                  Alert.alert('Error', requisitionError);
                  return;
                }
                navigate('PickingPickLocation');
              });
            });
          } else {
            const omitStagingLocationStep =
              currentTask.quantityPicked + parsedQuantityPicked < currentTask.quantityRequired;

            revalidateTaskAndProceed({
              revalidateCurrentTask,
              currentTaskIndex,
              allTasksCount,
              goToNextTask,
              homeRoute,
              omitStagingLocationStep
            });
          }
        },
        params?.reasonCode?.name
      );
      return;
    }

    pickCurrentTask(containerId, ({ errorMessage }) => {
      if (errorMessage) {
        containerScan.fail(errorMessage);
        return;
      }

      containerScan.pass();
      revalidateTaskAndProceed({ revalidateCurrentTask, currentTaskIndex, allTasksCount, goToNextTask, homeRoute });
    });

    containerScan.setValue(EMPTY_STRING);
  }

  return (
    <ScrollView style={styles.flex1} keyboardShouldPersistTaps="handled">
      <ProductDetails.Provider product={currentTask.product} status={currentTask.status}>
        <ProductDetails.Root>
          <ProductDetails.Header>
            <ProductDetails.Badge icon="navigation" label="Pick Task">
              {`${currentTaskIndex + 1} / ${allTasksCount}`}
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
                icon: 'truck',
                label: 'Quantity Picked',
                value: params?.quantityPicked || currentTask.quantityRequired
              },
              {
                icon: 'pin',
                label: 'Outbound Container Id',
                value: currentTask.outboundContainer?.locationNumber ?? 'New'
              }
            ]}
          />
        </ProductDetails.Root>

        <Divider />

        <View style={[styles.wrapperWithPadding]}>
          <Subheading style={styles.subheading}>Scan Outbound Container</Subheading>
          <Paragraph style={styles.paragraph}>
            Point your barcode scanner at the outbound container or use search to find it.
          </Paragraph>

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
      </ProductDetails.Provider>
    </ScrollView>
  );
}
