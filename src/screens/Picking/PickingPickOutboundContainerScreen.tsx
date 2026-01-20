import { RouteProp, useRoute } from '@react-navigation/native';
import * as React from 'react';
import { Alert, View } from 'react-native';
import { Divider, Paragraph, Subheading } from 'react-native-paper';

import { ScannerInput } from '../../components/ScannerInput';
import { EMPTY_STRING } from '../../constants';
import { navigate } from '../../NavigationService';
import { ReasonCode } from '../../types/picking';
import { usePickingContext } from './PickingContext';
import { ProductDetails } from './ProductDetails';
import styles from './styles';
import { revalidateTaskAndProceed } from './lib';

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
    <ProductDetails.Provider product={currentTask.product} status={currentTask.status}>
      <ProductDetails.Root>
        <ProductDetails.Header>
          <ProductDetails.Badge icon="barcode" label="Product Code">
            {currentTask.product.productCode}
          </ProductDetails.Badge>
          <ProductDetails.Badge icon="navigation" label="Pick Task">
            {`${currentTaskIndex + 1} / ${allTasksCount}`}
          </ProductDetails.Badge>
        </ProductDetails.Header>

        <ProductDetails.Separator />
        <ProductDetails.Title />

        <ProductDetails.List
          items={[
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
          Point your barcode scanner at the outbound container or type the code manually.
        </Paragraph>

        <ScannerInput
          style={styles.marginTop}
          label="Outbound Container ID"
          value={outboundContainerId}
          onChange={setOutboundContainerId}
          onSubmit={handleScan}
        />
      </View>
    </ProductDetails.Provider>
  );
}
