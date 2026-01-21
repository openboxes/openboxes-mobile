/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { RouteProp, useRoute } from '@react-navigation/native';
import * as React from 'react';
import { Alert, View } from 'react-native';
import { Divider, Paragraph, Subheading } from 'react-native-paper';

import { ProductDetails } from '../../components/ProductDetails';
import { ScannerInput } from '../../components/ScannerInput';
import { navigate } from '../../NavigationService';
import { ReasonCode } from '../../types/picking';
import { useReplenishmentContext } from './ReplenishmentContext';
import styles from './styles';

type ReplenishmentOutboundContainerScreenProps = RouteProp<
  { ReplenishmentOutboundContainer: { reasonCode?: ReasonCode; quantityPicked?: string } },
  'ReplenishmentOutboundContainer'
>;

export default function ReplenishmentOutboundContainerScreen() {
  const {
    currentTask,
    pickCurrentTask,
    shortPickTask,
    currentTaskIndex,
    tasksCount,
    revalidateCurrentTask,
    goToNextTask,
    revalidateTasksForOrder
  } = useReplenishmentContext();
  const { params } = useRoute<ReplenishmentOutboundContainerScreenProps>();

  const parsedQuantityPicked = params?.quantityPicked ? Number(params.quantityPicked) : undefined;
  const [outboundContainerId, setOutboundContainerId] = React.useState<string>('');

  if (!currentTask) {
    Alert.alert('No Pick Task', 'There is no current pick task available. Try again later.', [
      {
        text: 'OK',
        onPress: () => {
          navigate('Dashboard');
        }
      }
    ]);
    return null;
  }

  function revalidateTaskAndProceed() {
    revalidateCurrentTask((revalidatedTask) => {
      if (!revalidatedTask) {
        Alert.alert('Error', 'Failed to revalidate the current pick task after picking.');
        return;
      }

      if (currentTaskIndex + 1 >= tasksCount) {
        // Last Task -> Navigate to staging location drop
        Alert.alert('All Picks Complete', 'You have completed all picks. Proceeding to staging location drop.', [
          {
            text: 'OK',
            onPress: () => navigate('ReplenishmentStagingLocation')
          }
        ]);
      } else {
        // More Tasks -> Start over with next pick task
        goToNextTask();
        navigate('ReplenishmentPickingLocation');
      }
    });
  }

  function handleSubmit() {
    if (!outboundContainerId) {
      Alert.alert('Missing Input', 'Please scan or enter a valid Outbound Container ID.');
      setOutboundContainerId('');
      return;
    }

    if (!currentTask) {
      Alert.alert('Error', 'No current pick task available.');
      navigate('Dashboard');
      return;
    }

    if (parsedQuantityPicked !== undefined && parsedQuantityPicked < currentTask.quantityRequired) {
      // Handle Short Pick
      shortPickTask(
        outboundContainerId,
        parsedQuantityPicked,
        (response) => {
          if ('errorMessage' in response) {
            Alert.alert('Short Pick Error', response.errorMessage);
            setOutboundContainerId('');
            return;
          }

          if (params?.reasonCode?.id) {
            // Revalidate all tasks for the order to get updated pick tasks
            revalidateTasksForOrder(currentTask.orderId, () => {
              navigate('ReplenishmentPickingLocation');
            });
          } else {
            revalidateTaskAndProceed();
          }
        },
        params?.reasonCode?.name
      );
      return;
    }

    // pickCurrentTask(outboundContainerId, ({ errorMessage }) => {
    //   if (errorMessage) {
    //     Alert.alert('Pick Error', errorMessage);
    //     setOutboundContainerId('');
    //     return;
    //   }

    //   revalidateTaskAndProceed();
    // });

    // TODO: Temporarily bypass picking for outbound container scanning flow
    navigate('ReplenishmentStagingLocation');
  }

  return (
    <ProductDetails.Provider product={currentTask.product} status={currentTask.status}>
      <ProductDetails.Root>
        <ProductDetails.Header>
          <ProductDetails.Badge icon="barcode" label="Product Code">
            {currentTask.product.productCode}
          </ProductDetails.Badge>
          <ProductDetails.Badge icon="navigation" label="Pick Task">
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
          onSubmit={handleSubmit}
        />
      </View>
    </ProductDetails.Provider>
  );
}
