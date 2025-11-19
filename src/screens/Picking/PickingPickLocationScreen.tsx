import { RouteProp, useIsFocused, useRoute } from '@react-navigation/native';
import * as React from 'react';
import { Alert, TextInput, View } from 'react-native';

import { Divider, TextInput as PaperTextInput, Paragraph, Subheading } from 'react-native-paper';
import { INPUT_FOCUS_DELAY_TIME_IN_MS } from '../../constants';
import { navigate } from '../../NavigationService';
import { ProductDetails, ProductProvider } from './ProductDetails';
import styles from './styles';
import { PickTask } from './types';

type PickingPickLocationRouteProp = RouteProp<
  {
    // TODO: Adjust PickTask type as needed
    PickingPickLocation: { pickTasks: PickTask[] };
  },
  'PickingPickLocation'
>;

const MOCKED_PICK_TASKS: PickTask[] = [
  {
    id: 'task-001',
    // @ts-ignore
    product: {
      productCode: 'PROD-001',
      name: 'Mocked Product Number 1'
    },
    // @ts-ignore
    destination: {
      name: 'Aisle 1, Shelf A'
    },
    quantityToPick: 10,
    status: 'PENDING'
  },
  {
    id: 'task-002',
    // @ts-ignore
    product: {
      productCode: 'PROD-002',
      name: 'Mocked Product Number 2'
    },
    // @ts-ignore
    destination: {
      name: 'Aisle 3, Shelf B'
    },
    quantityToPick: 5,
    status: 'IN_PROGRESS'
  }
];

export default function PickingPickLocationScreen() {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const { params } = useRoute<PickingPickLocationRouteProp>();
  //   const { pickTasks = [] } = params;
  // TODO: Use pickTasks to render details
  const currentTask = MOCKED_PICK_TASKS[0];
  const inputRef = React.useRef<TextInput | null>(null);
  const isFocused = useIsFocused();
  const [pickLocationBarcode, setPickLocationBarcode] = React.useState<string>('');

  function handleSubmit() {
    // TODO: Validate the productBarcode
    const isValid = true;

    if (!isValid) {
      Alert.alert('Invalid Barcode', 'Incorrect product scanned. Please scan again.');
      return;
    }

    navigate('PickingPickProduct', { pickTask: currentTask });
  }

  React.useEffect(() => {
    if (!isFocused) {
      return;
    }

    const t = setTimeout(() => inputRef.current?.focus(), INPUT_FOCUS_DELAY_TIME_IN_MS);
    return () => clearTimeout(t);
  }, [isFocused]);

  return (
    <ProductProvider product={currentTask.product} status={currentTask.status}>
      <ProductDetails.Root>
        <ProductDetails.Header>
          <ProductDetails.Badge icon="barcode" label="Product Code">
            {currentTask.product.productCode}
          </ProductDetails.Badge>
        </ProductDetails.Header>

        <ProductDetails.Separator />
        <ProductDetails.Title />

        <ProductDetails.List
          items={[
            { icon: 'truck', label: 'Quantity Required', value: currentTask.quantityToPick },
            { icon: 'pin', label: 'Pick Location', value: currentTask.destination.name }
          ]}
        />
      </ProductDetails.Root>

      <Divider />

      <View style={[styles.wrapperWithPadding]}>
        <Subheading style={styles.subheading}>Scan Pick Location Barcode</Subheading>
        <Paragraph style={styles.paragraph}>
          Point your barcode scanner at the pick location barcode or type the code manually, then wait a moment for it
          to auto‐submit.
        </Paragraph>

        <PaperTextInput
          style={styles.marginTop}
          autoCompleteType="off"
          ref={inputRef}
          mode="outlined"
          label="Pick Location Barcode"
          value={pickLocationBarcode}
          returnKeyType="done"
          onChangeText={setPickLocationBarcode}
          onSubmitEditing={handleSubmit}
        />
      </View>
    </ProductProvider>
  );
}
