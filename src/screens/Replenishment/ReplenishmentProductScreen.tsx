import React from 'react';
import { Divider, Paragraph, Subheading } from 'react-native-paper';

import { Alert, View } from 'react-native';
import { ProductDetails } from '../../components/ProductDetails';
import { ScannerInput } from '../../components/ScannerInput';
import { HYPHEN } from '../../constants';
import { navigate } from '../../NavigationService';
import { DUMMY_REPLENISHMENT } from './mock-data';
import { useReplenishmentContext } from './ReplenishmentContext';
import styles from './styles';

export function ReplenishmentProductScreen() {
  const { currentTask, currentTaskIndex, tasksCount } = useReplenishmentContext();
  const [productBarcode, setProductBarcode] = React.useState<string>('');

  if (!currentTask) {
    Alert.alert('No Replenishment Task', 'There is no current replenishment task available. Try again later.');
    navigate('Dashboard');
    return null;
  }

  function handleSubmit() {
    // TODO: Replace with actual barcode validation logic
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
    // @ts-ignore
    <ProductDetails.Provider product={DUMMY_REPLENISHMENT.product}>
      <ProductDetails.Root>
        <ProductDetails.Header>
          <ProductDetails.Badge icon="barcode" label="Replenishment ID">
            {DUMMY_REPLENISHMENT.product.productCode}
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
