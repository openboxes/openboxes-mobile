/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import { Alert, View } from 'react-native';
import { Divider, Paragraph, Subheading } from 'react-native-paper';

import { ProductDetails } from '../../components/ProductDetails';
import { ScannerInput } from '../../components/ScannerInput';
import { navigate } from '../../NavigationService';
import { useReplenishmentContext } from './ReplenishmentContext';
import styles from './styles';

export function ReplenishmentStagingLocationScreen() {
  const { allTasks, dropCurrentTaskAtStagingLocation, resetReplenishmentSession } = useReplenishmentContext();

  const [stagingLocationNumber, setStagingLocationNumber] = React.useState('');
  const [currentUniqueIndex, setCurrentUniqueIndex] = React.useState(0);

  const uniqueTasks = React.useMemo(
    () => Array.from(new Map(allTasks.map((task) => [task.outboundContainer?.id, task])).values()),
    [allTasks]
  );

  const currentTask = uniqueTasks[currentUniqueIndex];

  if (!currentTask) {
    Alert.alert('Error', 'No current replenishment task available.');
    navigate('Dashboard');
    return null;
  }

  function handleSubmit() {
    if (!stagingLocationNumber) {
      Alert.alert('Missing Input', 'Please scan or enter a valid Staging Location ID.');
      setStagingLocationNumber('');
      return;
    }

    navigate('ReplenishmentPickingLocation');

    // TODO: Implement the staging location validation and task dropping logic
    // const expected = currentTask.stagingLocation?.locationNumber;

    // if (!expected || stagingLocationNumber !== expected) {
    //   Alert.alert(
    //     'Invalid Staging Location',
    //     `Expected: ${expected ?? '-'}, but got: ${stagingLocationNumber}. Please try again.`
    //   );
    //   setStagingLocationNumber('');
    //   return;
    // }

    // dropCurrentTaskAtStagingLocation(currentTask, (response) => {
    //   if ('errorMessage' in response) {
    //     Alert.alert('Error', response.errorMessage);
    //     setStagingLocationNumber('');
    //     return;
    //   }

    //   const nextIndex = currentUniqueIndex + 1;
    //   if (nextIndex < uniqueTasks.length) {
    //     Alert.alert('Success', 'Staging Location confirmed. Proceeding to the next container.', [
    //       {
    //         text: 'OK',
    //         onPress: () => {
    //           // Proceed to next unique task
    //           setCurrentUniqueIndex(nextIndex);
    //           setStagingLocationNumber('');
    //         }
    //       }
    //     ]);
    //   } else {
    //     Alert.alert('Picking Session Complete', 'You have completed all staging confirmations.', [
    //       {
    //         text: 'OK',
    //         onPress: () => {
    //           resetReplenishmentSession();
    //           navigate('Dashboard');
    //         }
    //       }
    //     ]);
    //   }
    // });
  }

  return (
    <ProductDetails.Provider product={currentTask.product} status={currentTask.status}>
      <ProductDetails.Root>
        <ProductDetails.Header>
          <ProductDetails.Badge icon="barcode" label="Product Code">
            {currentTask.product.productCode}
          </ProductDetails.Badge>
          <ProductDetails.Badge icon="navigation" label="Task Progress">
            {`${currentUniqueIndex + 1} / ${uniqueTasks.length}`}
          </ProductDetails.Badge>
        </ProductDetails.Header>

        <ProductDetails.Separator />
        <ProductDetails.Title />

        <ProductDetails.List
          items={[
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
          Point your barcode scanner at the staging location or type the ID manually.
        </Paragraph>

        <ScannerInput
          style={styles.marginTop}
          label="Staging Location ID"
          value={stagingLocationNumber}
          onChange={setStagingLocationNumber}
          onSubmit={handleSubmit}
        />
      </View>
    </ProductDetails.Provider>
  );
}
