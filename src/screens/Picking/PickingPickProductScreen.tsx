import { useIsFocused } from '@react-navigation/native';
import * as React from 'react';
import { Alert, TextInput, View } from 'react-native';
import { Divider, TextInput as PaperTextInput, Paragraph, Subheading } from 'react-native-paper';

import { HYPHEN, INPUT_FOCUS_DELAY_TIME_IN_MS } from '../../constants';
import { navigate } from '../../NavigationService';
import { usePickingContext } from './PickingContext';
import { ProductDetails } from './ProductDetails';
import styles from './styles';
import { isProductBarcodeValid } from '../../utils/utils';

export default function PickingPickProductScreen() {
  const { currentTask, currentTaskIndex, allTasksCount } = usePickingContext();

  const inputRef = React.useRef<TextInput | null>(null);
  const isFocused = useIsFocused();
  const [productBarcode, setProductBarcode] = React.useState<string>('');

  React.useEffect(() => {
    if (!isFocused) {
      return;
    }

    setProductBarcode('');

    const t = setTimeout(() => inputRef.current?.focus(), INPUT_FOCUS_DELAY_TIME_IN_MS);
    return () => clearTimeout(t);
  }, [isFocused]);

  if (!currentTask) {
    return null;
  }

  function handleSubmit() {
    const isValid = isProductBarcodeValid(productBarcode, currentTask?.product);

    if (!isValid) {
      Alert.alert(
        'Invalid Barcode',
        `Incorrect product scanned. Expected: ${currentTask?.product.productCode}. Please try again.`
      );
      setProductBarcode('');
      return;
    }

    navigate('PickingPickQuantity');
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

        <PaperTextInput
          style={styles.marginTop}
          autoCompleteType="off"
          ref={inputRef}
          mode="outlined"
          label="Product Barcode"
          value={productBarcode}
          returnKeyType="done"
          onChangeText={setProductBarcode}
          onSubmitEditing={handleSubmit}
        />
      </View>
    </ProductDetails.Provider>
  );
}
