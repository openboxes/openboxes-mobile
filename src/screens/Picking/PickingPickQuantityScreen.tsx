import { RouteProp, useIsFocused, useRoute } from '@react-navigation/native';
import * as React from 'react';
import { Alert, TextInput, View } from 'react-native';

import { Button, Divider, TextInput as PaperTextInput, Paragraph, Subheading } from 'react-native-paper';
import { INPUT_FOCUS_DELAY_TIME_IN_MS } from '../../constants';
import { navigate } from '../../NavigationService';
import { ProductDetails, ProductProvider } from './ProductDetails';
import styles from './styles';
import { PickTask } from './types';

type PickingPickQuantityRouteProp = RouteProp<
  {
    // TODO: Adjust PickTask type as needed
    PickingPickQuantity: { pickTask: PickTask };
  },
  'PickingPickQuantity'
>;

export default function PickingPickQuantityScreen() {
  const { params } = useRoute<PickingPickQuantityRouteProp>();
  const { pickTask } = params;

  const inputRef = React.useRef<TextInput | null>(null);
  const isFocused = useIsFocused();
  const [quantityPicked, setQuantityPicked] = React.useState<string>('');

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
    // TODO: Validate the quantityPicked
    const isValid = true;

    if (Number(quantityPicked) > pickTask.quantityToPick) {
      Alert.alert('Invalid Quantity', 'Picked quantity cannot exceed required quantity.');
      return;
    }

    if (!isValid) {
      Alert.alert('Invalid Quantity', 'Incorrect quantity picked. Please try again.');
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
        <Subheading style={styles.subheading}>Enter Quantity Picked</Subheading>
        <Paragraph style={styles.paragraph}>
          Please enter the quantity of the product that you have picked from the location.
        </Paragraph>

        <PaperTextInput
          style={styles.marginTop}
          autoCompleteType="off"
          ref={inputRef}
          mode="outlined"
          label="Quantity Picked"
          value={quantityPicked}
          returnKeyType="done"
          onChangeText={setQuantityPicked}
        />

        <Button mode="contained" style={styles.marginTop} onPress={handleSubmit}>
          Confirm Quantity
        </Button>
      </View>
    </ProductProvider>
  );
}
