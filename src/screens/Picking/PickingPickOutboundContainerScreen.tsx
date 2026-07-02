import { RouteProp, useRoute } from '@react-navigation/native';
import * as React from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { Divider, Paragraph, Subheading } from 'react-native-paper';

import { ProductDetails } from '../../components/ProductDetails';
import { ScannerInput } from '../../components/ScannerInput';
import { SearchButton } from '../../components/SearchButton';
import { useSearchButton } from '../../components/SearchButton/useSearchButton';
import { EMPTY_STRING, HYPHEN } from '../../constants';
import { navigate } from '../../NavigationService';
import { ReasonCode } from '../../types/picking';
import { parseFromISODateToLocaleString } from '../../utils/utils';
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
    revalidateTasksForRequisition
  } = usePickingContext();
  const { params } = useRoute<PickingPickOutboundContainerScreenProps>();
  const parsedQuantityPicked = params?.quantityPicked ? Number(params.quantityPicked) : undefined;

  const [outboundContainerId, setOutboundContainerId] = React.useState<string>(EMPTY_STRING);
  const { isSearchOpen, searchButtonProps } = useSearchButton({ onSelect: setOutboundContainerId });

  if (!currentTask) {
    return null;
  }

  function handleScan(containerId: string) {
    if (!currentTask) {
      Alert.alert('Error', 'No current pick task available.');
      setOutboundContainerId(EMPTY_STRING);
      return;
    }

    if (parsedQuantityPicked !== undefined && parsedQuantityPicked < currentTask.quantityRequired) {
      // Handle Short Pick
      shortPickTask(
        containerId,
        parsedQuantityPicked,
        ({ errorMessage }) => {
          if (errorMessage) {
            Alert.alert('Short Pick Error', errorMessage);
            setOutboundContainerId(EMPTY_STRING);
            return;
          }

          if (params?.reasonCode?.id) {
            revalidateCurrentTask(() => {
              // Revalidate all tasks for the requisition to get updated pick tasks
              revalidateTasksForRequisition(currentTask.requisitionId, () => {
                navigate('PickingPickLocation');
              });
            });
          } else {
            const omitStagingLocationStep =
              currentTask.quantityPicked + parsedQuantityPicked < currentTask.quantityRequired;

            revalidateTaskAndProceed(
              revalidateCurrentTask,
              currentTaskIndex,
              allTasksCount,
              goToNextTask,
              omitStagingLocationStep
            );
          }
        },
        params?.reasonCode?.name
      );
      return;
    }

    pickCurrentTask(containerId, ({ errorMessage }) => {
      if (errorMessage) {
        Alert.alert('Pick Error', errorMessage);
        setOutboundContainerId(EMPTY_STRING);
        return;
      }

      revalidateTaskAndProceed(revalidateCurrentTask, currentTaskIndex, allTasksCount, goToNextTask);
    });

    setOutboundContainerId(EMPTY_STRING);
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
              },
              {
                icon: 'map-marker',
                label: 'Destination',
                value: currentTask.destination || HYPHEN
              },
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
              value={outboundContainerId}
              isEnabled={!isSearchOpen}
              onChange={setOutboundContainerId}
              onSubmit={handleScan}
            />
            <SearchButton searchType="container" {...searchButtonProps} />
          </View>
        </View>
      </ProductDetails.Provider>
    </ScrollView>
  );
}
