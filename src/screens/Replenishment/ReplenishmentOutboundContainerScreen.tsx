import { RouteProp, useRoute } from '@react-navigation/native';
import * as React from 'react';
import { Alert, View } from 'react-native';
import { Button, Divider, Paragraph, Subheading } from 'react-native-paper';

import EmptyView from '../../components/EmptyView';
import { ProductDetails } from '../../components/ProductDetails';
import { ScannerInput } from '../../components/ScannerInput';
import { navigate } from '../../NavigationService';
import { ReasonCode } from '../../types/picking';
import { proceedToNextTask } from './lib';
import { useReplenishmentContext } from './ReplenishmentContext';
import styles from './styles';

type ReplenishmentOutboundContainerScreenProps = RouteProp<
  { ReplenishmentOutboundContainer: { reasonCode?: ReasonCode; quantityPicked?: string } },
  'ReplenishmentOutboundContainer'
>;

// TODO(OBLS-412): validate and associate the container (NEW or existing), log the association
export default function ReplenishmentOutboundContainerScreen() {
  const { currentTask, pickCurrentTask, shortPickTask, currentTaskIndex, tasksCount, goToNextTask } =
    useReplenishmentContext();
  const { params } = useRoute<ReplenishmentOutboundContainerScreenProps>();

  const [outboundContainerId, setOutboundContainerId] = React.useState<string>('');

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

  function onPicked({ errorMessage }: { errorMessage?: string }) {
    if (errorMessage) {
      Alert.alert('Pick Error', errorMessage);
      setOutboundContainerId('');
      return;
    }
    proceedToNextTask({ currentTaskIndex, tasksCount, goToNextTask });
  }

  // A hardware scan submits before `outboundContainerId` re-renders, so use the submitted code.
  function handleSubmit(containerId: string) {
    if (!containerId) {
      Alert.alert('Missing Input', 'Please scan or enter a valid Outbound Container ID.');
      setOutboundContainerId('');
      return;
    }

    if (parsedQuantityPicked < qtyRemaining) {
      shortPickTask(containerId, parsedQuantityPicked, onPicked, params?.reasonCode?.name);
      return;
    }

    pickCurrentTask(containerId, onPicked);
  }

  return (
    <ProductDetails.Provider product={currentTask.product} status={currentTask.status}>
      <ProductDetails.Root>
        <ProductDetails.Header>
          <ProductDetails.Badge icon="barcode" label="Product Code">
            {currentTask.product.productCode}
          </ProductDetails.Badge>
          <ProductDetails.Badge icon="navigation" label="Task">
            {`${currentTaskIndex + 1} / ${tasksCount}`}
          </ProductDetails.Badge>
        </ProductDetails.Header>

        <ProductDetails.Separator />
        <ProductDetails.Title />

        <ProductDetails.List
          items={[
            {
              icon: 'truck',
              label: 'Quantity Picked',
              value: `${parsedQuantityPicked}`
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
          onSubmit={handleSubmit}
        />
      </View>
    </ProductDetails.Provider>
  );
}
