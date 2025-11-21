import { useIsFocused } from '@react-navigation/native';
import * as React from 'react';
import { Alert, TextInput, View } from 'react-native';
import { Divider, TextInput as PaperTextInput, Paragraph, Subheading } from 'react-native-paper';

import { INPUT_FOCUS_DELAY_TIME_IN_MS } from '../../constants';
import { navigate } from '../../NavigationService';
import { usePickingContext } from './PickingContext';
import { ProductDetails } from './ProductDetails';
import styles from './styles';

export default function PickingPickOutboundContainerScreen() {
  const { currentTask, completeCurrentTask, resetSession, currentTaskIndex, allTasksCount } = usePickingContext();

  const inputRef = React.useRef<TextInput | null>(null);
  const isFocused = useIsFocused();
  const [outboundContainerId, setOutboundContainerId] = React.useState<string>('');

  React.useEffect(() => {
    if (!isFocused) {
      return;
    }

    setOutboundContainerId('');

    const t = setTimeout(() => inputRef.current?.focus(), INPUT_FOCUS_DELAY_TIME_IN_MS);
    return () => clearTimeout(t);
  }, [isFocused]);

  if (!currentTask) {
    return null;
  }

  function handleSubmit() {
    if (!outboundContainerId) {
      Alert.alert('Missing Input', 'Please scan or enter a valid Outbound Container ID.');
      return;
    }

    // TODO: Validate Outbound Container
    const isValid = true;

    if (!isValid) {
      Alert.alert('Invalid Outbound Container', 'The scanned Outbound Container ID is not valid. Please try again.');
      return;
    }

    // 1. Complete the task in the context
    // This updates the task status and checks if there are more tasks pending
    const { isSessionComplete } = completeCurrentTask(outboundContainerId);

    if (isSessionComplete) {
      // Case: All tasks done
      Alert.alert('Staging Complete', 'All orders have been picked and staged successfully.', [
        {
          text: 'OK',
          onPress: () => {
            resetSession();
            navigate('PickingPickType');
          }
        }
      ]);
      return;
    }
    // Case: More tasks remaining
    // The Context has already incremented the index, so navigating to Location
    // will display the next task immediately.
    Alert.alert('Item Picked', 'Proceeding to the next pick location.', [
      {
        text: 'OK',
        onPress: () => {
          navigate('PickingPickLocation');
        }
      }
    ]);
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
            { icon: 'truck', label: 'Quantity Picked', value: currentTask.quantityToPick },
            { icon: 'pin', label: 'Outbound Container ID', value: currentTask.outboundContainer?.id ?? 'New' }
          ]}
        />
      </ProductDetails.Root>

      <Divider />

      <View style={[styles.wrapperWithPadding]}>
        <Subheading style={styles.subheading}>Scan Outbound Container</Subheading>
        <Paragraph style={styles.paragraph}>
          Point your barcode scanner at the outbound container or type the code manually, then wait a moment for it to
          auto‐submit.
        </Paragraph>

        <PaperTextInput
          ref={inputRef}
          autoCompleteType="off"
          style={styles.marginTop}
          mode="outlined"
          label="Outbound Container ID"
          value={outboundContainerId}
          returnKeyType="done"
          onChangeText={setOutboundContainerId}
          onSubmitEditing={handleSubmit}
        />
      </View>
    </ProductDetails.Provider>
  );
}
