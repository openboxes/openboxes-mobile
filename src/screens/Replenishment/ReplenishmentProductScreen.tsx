import React from 'react';
import { Alert, View } from 'react-native';
import { Button, Divider, Paragraph, Subheading } from 'react-native-paper';

import EmptyView from '../../components/EmptyView';
import { ProductDetails } from '../../components/ProductDetails';
import { ScannerInput } from '../../components/ScannerInput';
import { HYPHEN } from '../../constants';
import { navigate } from '../../NavigationService';
import { useReplenishmentContext } from './ReplenishmentContext';
import styles from './styles';

export function ReplenishmentProductScreen() {
  const { currentTask, currentTaskIndex, tasksCount } = useReplenishmentContext();
  const [productBarcode, setProductBarcode] = React.useState<string>('');

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

  function handleSubmit() {
    // TODO(OBLS-409): Replace with actual barcode validation logic
    const isValid = true;

    if (!isValid) {
      Alert.alert(
        'Invalid Barcode',
        `Incorrect product scanned. Expected: ${currentTask?.product?.productCode}. Try again.`
      );
      setProductBarcode('');
      return;
    }

    // TODO: Implement the logic for proceeding to the next step
    navigate('ReplenishmentPickQuantity');
  }

  return (
    <ProductDetails.Provider product={currentTask.product} status={currentTask.status}>
      <ProductDetails.Root>
        <ProductDetails.Header>
          <ProductDetails.Badge icon="barcode" label="Product Code">
            {currentTask.product?.productCode}
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
              icon: 'package',
              label: 'Quantity Picked',
              value: `${currentTask.quantityPicked || 0} / ${currentTask.quantityRequired}`
            },
            { icon: 'pin', label: 'Pick Product', value: currentTask.product?.name || HYPHEN }
          ]}
        />
      </ProductDetails.Root>

      <Divider />

      <View style={styles.wrapperWithPadding}>
        <Subheading style={styles.subheading}>Scan Pick Product Barcode</Subheading>
        <Paragraph style={styles.paragraph}>
          Point your barcode scanner at the product barcode or type the code manually.
        </Paragraph>

        <ScannerInput
          style={styles.marginTop}
          label="Product Barcode"
          value={productBarcode}
          onChange={setProductBarcode}
          onSubmit={handleSubmit}
        />
      </View>
    </ProductDetails.Provider>
  );
}
