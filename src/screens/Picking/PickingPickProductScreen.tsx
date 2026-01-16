import * as React from 'react';
import { Alert, View } from 'react-native';
import { Divider, Paragraph, Subheading } from 'react-native-paper';

import { ScannerInput } from '../../components/ScannerInput';
import { EMPTY_STRING, HYPHEN } from '../../constants';
import { navigate } from '../../NavigationService';
import { usePickingContext } from './PickingContext';
import { ProductDetails } from './ProductDetails';
import styles from './styles';
import { isProductBarcodeValid } from '../../utils/utils';

export default function PickingPickProductScreen() {
  const { currentTask, currentTaskIndex, allTasksCount } = usePickingContext();
  const [productBarcode, setProductBarcode] = React.useState<string>(EMPTY_STRING);

  if (!currentTask) {
    return null;
  }

  function handleScan(scannedBarcode: string) {
    const isValid = isProductBarcodeValid(scannedBarcode, currentTask?.product);

    if (!isValid) {
      Alert.alert(
        'Invalid Barcode',
        `Incorrect product scanned. Expected: ${currentTask?.product.productCode}. Please try again.`,
        [{ text: 'OK', onPress: () => setProductBarcode(EMPTY_STRING) }]
      );
      return;
    }

    navigate('PickingPickQuantity');

    setProductBarcode(EMPTY_STRING);
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
              icon: 'package',
              label: 'Quantity Picked',
              value: `${currentTask.quantityPicked || 0} / ${currentTask.quantityRequired}`
            },
            { icon: 'pin', label: 'Pick Location', value: currentTask.location?.name || HYPHEN }
          ]}
        />
      </ProductDetails.Root>

      <Divider />

      <View style={[styles.wrapperWithPadding]}>
        <Subheading style={styles.subheading}>Scan Product Barcode</Subheading>
        <Paragraph style={styles.paragraph}>
          Point your barcode scanner at the product barcode or type the code manually.
        </Paragraph>

        <ScannerInput
          style={styles.marginTop}
          label="Product Barcode"
          value={productBarcode}
          onChange={setProductBarcode}
          onSubmit={handleScan}
        />
      </View>
    </ProductDetails.Provider>
  );
}
