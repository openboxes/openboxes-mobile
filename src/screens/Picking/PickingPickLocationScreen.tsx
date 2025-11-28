import { useIsFocused } from '@react-navigation/native';
import * as React from 'react';
import { Alert, TextInput, View } from 'react-native';
import { Divider, TextInput as PaperTextInput, Paragraph, Subheading } from 'react-native-paper';

import { HYPHEN, INPUT_FOCUS_DELAY_TIME_IN_MS } from '../../constants';
import { navigate } from '../../NavigationService';
import { usePickingContext } from './PickingContext';
import { ProductDetails } from './ProductDetails';
import styles from './styles';

export default function PickingPickLocationScreen() {
  const { currentTask, currentTaskIndex, allTasksCount, startPickTask } = usePickingContext();

  const inputRef = React.useRef<TextInput | null>(null);
  const isFocused = useIsFocused();
  const [pickLocationBarcode, setPickLocationBarcode] = React.useState<string>('');

  React.useEffect(() => {
    if (!isFocused) {
      return;
    }

    setPickLocationBarcode('');

    const t = setTimeout(() => inputRef.current?.focus(), INPUT_FOCUS_DELAY_TIME_IN_MS);
    return () => clearTimeout(t);
  }, [isFocused]);

  if (!currentTask) {
    return null;
  }

  function handleSubmit() {
    const isValid = pickLocationBarcode === currentTask?.location?.locationNumber;
    if (!isValid) {
      Alert.alert(
        'Invalid Barcode',
        `Incorrect location scanned. Expected: ${currentTask?.location?.locationNumber}. Try again.`
      );
      return;
    }

    startPickTask(({ errorMessage }) => {
      if (errorMessage) {
        Alert.alert('Error', errorMessage);
        return;
      }

      navigate('PickingPickProduct');
    });
  }

  return (
    <ProductDetails.Provider product={currentTask.product} status={currentTask.status}>
      <ProductDetails.Root>
        <ProductDetails.Header>
          <ProductDetails.Badge icon="barcode" label="Product Code">
            {currentTask.product.productCode}
          </ProductDetails.Badge>
          <ProductDetails.Badge icon="navigation" label="Pick Task">
            {`${currentTaskIndex + 1} / ${allTasksCount || 0}`}
          </ProductDetails.Badge>
        </ProductDetails.Header>

        <ProductDetails.Separator />
        <ProductDetails.Title />

        <ProductDetails.List
          items={[
            { icon: 'truck', label: 'Quantity Required', value: currentTask.quantityRequired },
            { icon: 'pin', label: 'Pick Location', value: currentTask.location?.name || HYPHEN }
          ]}
        />
      </ProductDetails.Root>

      <Divider />

      <View style={[styles.wrapperWithPadding]}>
        <Subheading style={styles.subheading}>Scan Pick Location Barcode</Subheading>
        <Paragraph style={styles.paragraph}>
          Point your barcode scanner at the pick location barcode or type the code manually.
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
    </ProductDetails.Provider>
  );
}
