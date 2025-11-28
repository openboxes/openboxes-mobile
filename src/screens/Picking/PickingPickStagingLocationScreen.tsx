import { useIsFocused } from '@react-navigation/native';
import * as React from 'react';
import { Alert, TextInput, View } from 'react-native';
import { Divider, TextInput as PaperTextInput, Paragraph, Subheading } from 'react-native-paper';

import { HYPHEN, INPUT_FOCUS_DELAY_TIME_IN_MS } from '../../constants';
import { navigate } from '../../NavigationService';
import { usePickingContext } from './PickingContext';
import { ProductDetails } from './ProductDetails';
import styles from './styles';

export default function PickingPickStagingLocationScreen() {
  const { currentTask, dropCurrentTask, currentTaskIndex, allTasksCount, resetSession } = usePickingContext();

  const inputRef = React.useRef<TextInput | null>(null);
  const isFocused = useIsFocused();
  const [stagingLocationNumber, setStagingLocationNumber] = React.useState<string>('');

  React.useEffect(() => {
    if (!isFocused) {
      return;
    }

    setStagingLocationNumber('');
    const t = setTimeout(() => inputRef.current?.focus(), INPUT_FOCUS_DELAY_TIME_IN_MS);
    return () => clearTimeout(t);
  }, [isFocused]);

  if (!currentTask) {
    return null;
  }

  function handleSubmit() {
    if (!stagingLocationNumber) {
      Alert.alert('Missing Input', 'Please scan or enter a valid Staging Location ID.');
      return;
    }

    // Enforce that the scanned staging location ID matches the task's staging location
    const isValid = stagingLocationNumber === currentTask?.stagingLocation?.locationNumber;

    if (!isValid) {
      Alert.alert(
        'Invalid Staging Location ID',
        `The scanned Staging Location ID is not valid. Expecting: ${
          currentTask?.stagingLocation?.locationNumber ?? HYPHEN
        }. Please try again.`
      );
      return;
    }

    // Here we could mark the task as staged or continue workflow
    dropCurrentTask(stagingLocationNumber);

    // NOTE: Happy path - for now, just navigate to the Pick Type screen
    // TODO: In the future, we gonna navigate to the next task if exists
    resetSession();
    navigate('PickingPickType');
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
              icon: 'pin',
              label: 'Outbound Container ID',
              value: currentTask.outboundContainer?.locationNumber ?? HYPHEN
            },
            {
              icon: 'package',
              label: 'Staging Location',
              value: currentTask.stagingLocation?.name || HYPHEN
            }
          ]}
        />
      </ProductDetails.Root>

      <Divider />

      <View style={[styles.wrapperWithPadding]}>
        <Subheading style={styles.subheading}>Scan Staging Location</Subheading>
        <Paragraph style={styles.paragraph}>
          Point your barcode scanner at the staging location or type the ID manually, then wait a moment for it to
          auto-submit.
        </Paragraph>

        <PaperTextInput
          ref={inputRef}
          autoCompleteType="off"
          style={styles.marginTop}
          mode="outlined"
          label="Staging Location Number"
          value={stagingLocationNumber}
          returnKeyType="done"
          onChangeText={setStagingLocationNumber}
          onSubmitEditing={handleSubmit}
        />
      </View>
    </ProductDetails.Provider>
  );
}
