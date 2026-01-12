import { useIsFocused } from '@react-navigation/native';
import * as React from 'react';
import { Alert, TextInput, View } from 'react-native';
import { Divider, TextInput as PaperTextInput, Paragraph, Subheading } from 'react-native-paper';

import { INPUT_FOCUS_DELAY_TIME_IN_MS } from '../../constants';
import { navigate } from '../../NavigationService';
import { usePickingContext } from './PickingContext';
import { ProductDetails } from './ProductDetails';
import styles from './styles';

export default function PickingPickStagingLocationScreen() {
  const { tasks, dropCurrentTask, resetSession, setCurrentTaskIndex } = usePickingContext();
  const isFocused = useIsFocused();

  const inputRef = React.useRef<TextInput | null>(null);
  const [stagingLocationNumber, setStagingLocationNumber] = React.useState('');
  const [currentUniqueIndex, setCurrentUniqueIndex] = React.useState(0);

  // Memoize unique tasks based on outbound container ID
  const uniqueTasks = React.useMemo(() => {
    const tasksWithContainers = tasks.filter((t) => t.outboundContainer?.id);
    return Array.from(new Map(tasksWithContainers.map((t) => [t?.outboundContainer?.id, t])).values());
  }, [tasks]);

  const currentTask = uniqueTasks[currentUniqueIndex];

  // Handle Navigation and Session Completion side effects
  React.useEffect(() => {
    if (!isFocused) {
      return;
    }

    if (!currentTask) {
      // No tasks left at all, return to home
      Alert.alert('Staging', 'No more tasks available for staging drop.');
      navigate('PickingPickType');
    }
  }, [currentTask, tasks.length, isFocused, setCurrentTaskIndex, uniqueTasks.length, tasks]);

  // Handle Input Auto-focus
  React.useEffect(() => {
    if (!isFocused || !currentTask) {
      return;
    }

    setStagingLocationNumber('');
    const t = setTimeout(() => {
      inputRef?.current?.focus();
    }, INPUT_FOCUS_DELAY_TIME_IN_MS);

    return () => clearTimeout(t);
  }, [isFocused, currentUniqueIndex, currentTask]);

  function handleSubmit() {
    if (!stagingLocationNumber) {
      Alert.alert('Missing Input', 'Please scan or enter a valid Staging Location ID.');
      setStagingLocationNumber('');
      return;
    }

    const expected = currentTask.stagingLocation?.locationNumber;

    if (!expected || stagingLocationNumber !== expected) {
      Alert.alert(
        'Invalid Staging Location',
        `Expected: ${expected ?? '-'}, but got: ${stagingLocationNumber}. Please try again.`
      );
      setStagingLocationNumber('');
      return;
    }

    dropCurrentTask(currentTask, (response) => {
      if (response.errorMessage) {
        Alert.alert('Error', response.errorMessage);
        setStagingLocationNumber('');
        return;
      }

      const nextIndex = currentUniqueIndex + 1;
      if (nextIndex < uniqueTasks.length) {
        Alert.alert('Success', 'Staging Location confirmed. Proceeding to the next container.', [
          {
            text: 'OK',
            onPress: () => {
              setCurrentUniqueIndex(nextIndex);
              setStagingLocationNumber('');
            }
          }
        ]);
      } else {
        Alert.alert('Picking Session Complete', 'You have completed all staging confirmations.', [
          {
            text: 'OK',
            onPress: () => {
              resetSession();
              navigate('PickingPickType');
            }
          }
        ]);
      }
    });
  }

  // If no task is selected yet, return null to avoid rendering
  // ProductDetails with undefined data while useEffect runs
  if (!currentTask) {
    return null;
  }

  return (
    <ProductDetails.Provider product={currentTask.product} status={currentTask.status}>
      <ProductDetails.Root>
        <ProductDetails.Header>
          <ProductDetails.Badge icon="barcode" label="Product Code">
            {currentTask.product.productCode}
          </ProductDetails.Badge>
          <ProductDetails.Badge icon="navigation" label="Task Progress">
            {`${currentUniqueIndex + 1} / ${uniqueTasks.length}`}
          </ProductDetails.Badge>
        </ProductDetails.Header>

        <ProductDetails.Separator />
        <ProductDetails.Title />

        <ProductDetails.List
          items={[
            {
              icon: 'pin',
              label: 'Outbound Container',
              value: currentTask.outboundContainer?.locationNumber ?? '-'
            },
            {
              icon: 'package',
              label: 'Staging Location',
              value: currentTask.stagingLocation?.name ?? '-'
            }
          ]}
        />
      </ProductDetails.Root>

      <Divider />

      <View style={[styles.wrapperWithPadding]}>
        <Subheading style={styles.subheading}>Scan Staging Location</Subheading>
        <Paragraph style={styles.paragraph}>
          Point your barcode scanner at the staging location or type the ID manually.
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
