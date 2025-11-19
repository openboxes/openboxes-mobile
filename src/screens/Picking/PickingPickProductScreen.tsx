import { RouteProp, useIsFocused, useRoute } from '@react-navigation/native';
import * as React from 'react';
import { Alert, TextInput, View } from 'react-native';

import { Divider, TextInput as PaperTextInput, Paragraph, Subheading } from 'react-native-paper';
import { INPUT_FOCUS_DELAY_TIME_IN_MS } from '../../constants';
import { navigate } from '../../NavigationService';
import { ProductDetails, ProductProvider } from './ProductDetails';
import styles from './styles';
import { PickTask } from './types';

type PickingPickProductRouteProp = RouteProp<
  {
    // TODO: Adjust PickTask type as needed
    PickingPickProduct: { pickTask: PickTask };
  },
  'PickingPickProduct'
>;

export default function PickingPickProductScreen() {
  const { params } = useRoute<PickingPickProductRouteProp>();
  const { pickTask } = params;

  const inputRef = React.useRef<TextInput | null>(null);
  const isFocused = useIsFocused();
  const [productBarcode, setProductBarcode] = React.useState<string>('');

  React.useEffect(() => {
    if (!isFocused) {
      return;
    }

    const t = setTimeout(() => inputRef.current?.focus(), INPUT_FOCUS_DELAY_TIME_IN_MS);
    return () => clearTimeout(t);
  }, [isFocused]);

  if (!pickTask) {
    return navigate('PickingPickType');
  }

  function handleSubmit() {
    // TODO: Validate the productBarcode
    const isValid = true;

    if (!isValid) {
      Alert.alert('Invalid Barcode', 'Incorrect product scanned. Please scan again.');
      return;
    }

    navigate('PickingPickQuantity', { pickTask });
  }

  return (
    <ProductProvider product={pickTask.product} status={pickTask.status}>
      <ProductDetails.Root>
        <ProductDetails.Header>
          <ProductDetails.Badge icon="barcode" label="Product Code">
            {pickTask.product.productCode}
          </ProductDetails.Badge>
        </ProductDetails.Header>

        <ProductDetails.Separator />
        <ProductDetails.Title />

        <ProductDetails.List
          items={[
            { icon: 'truck', label: 'Quantity Required', value: pickTask.quantityToPick },
            { icon: 'pin', label: 'Pick Location', value: pickTask.destination.name }
          ]}
        />
      </ProductDetails.Root>

      <Divider />

      <View style={[styles.wrapperWithPadding]}>
        <Subheading style={styles.subheading}>Scan Product Barcode</Subheading>
        <Paragraph style={styles.paragraph}>
          Point your barcode scanner at the product barcode or type the code manually, then wait a moment for it to
          auto‐submit.
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
    </ProductProvider>
  );
}
