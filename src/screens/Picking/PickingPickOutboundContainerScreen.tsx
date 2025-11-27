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
  const { currentTask, pickCurrentTask, currentTaskIndex, allTasksCount, revalidateCurrentTask } = usePickingContext();

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

    pickCurrentTask(outboundContainerId, ({ errorMessage }) => {
      if (errorMessage) {
        Alert.alert('Pick Error', errorMessage);
        return;
      }

      revalidateCurrentTask((revalidatedTask) => {
        if (!revalidatedTask) {
          Alert.alert('Error', 'Failed to revalidate the current pick task after picking.');
          return;
        }

        navigate('PickingPickStagingLocation');
      });
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
            {`${currentTaskIndex + 1} / ${allTasksCount}`}
          </ProductDetails.Badge>
        </ProductDetails.Header>

        <ProductDetails.Separator />
        <ProductDetails.Title />

        <ProductDetails.List
          items={[
            // NOTE: For now, we assume quantity picked equals quantity required.
            // This might change in the future if we implement partial picks.
            {
              icon: 'truck',
              label: 'Quantity Picked',
              value: currentTask.quantityPicked || currentTask.quantityRequired
            },
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
