import { RouteProp, useIsFocused, useRoute } from '@react-navigation/native';
import * as React from 'react';
import { Alert, TextInput, View } from 'react-native';
import { Divider, TextInput as PaperTextInput, Paragraph, Subheading } from 'react-native-paper';

import { INPUT_FOCUS_DELAY_TIME_IN_MS } from '../../constants';
import { navigate } from '../../NavigationService';
import { ReasonCode } from '../../types/picking';
import { usePickingContext } from './PickingContext';
import { ProductDetails } from './ProductDetails';
import styles from './styles';

type PickingPickOutboundContainerScreenProps = RouteProp<
  { PickingPickOutboundContainer: { reasonCode?: ReasonCode; quantityPicked?: string } },
  'PickingPickOutboundContainer'
>;

export default function PickingPickOutboundContainerScreen() {
  const {
    currentTask,
    pickCurrentTask,
    shortPickTask,
    currentTaskIndex,
    allTasksCount,
    revalidateCurrentTask,
    goToNextTask,
    revalidateTasksForRequisition
  } = usePickingContext();
  const { params } = useRoute<PickingPickOutboundContainerScreenProps>();
  const parsedQuantityPicked = params?.quantityPicked ? Number(params.quantityPicked) : undefined;

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

  function revalidateTaskAndProceed() {
    revalidateCurrentTask((revalidatedTask) => {
      if (!revalidatedTask) {
        Alert.alert('Error', 'Failed to revalidate the current pick task after picking.');
        return;
      }

      if (currentTaskIndex + 1 >= allTasksCount) {
        // Last Task -> Navigate to staging location drop
        Alert.alert('All Picks Complete', 'You have completed all picks. Proceeding to staging location drop.', [
          {
            text: 'OK',
            onPress: () => navigate('PickingPickStagingLocation')
          }
        ]);
      } else {
        // More Tasks -> Start over with next pick task
        goToNextTask();
        navigate('PickingPickLocation');
      }
    });
  }

  function handleSubmit() {
    if (!outboundContainerId) {
      Alert.alert('Missing Input', 'Please scan or enter a valid Outbound Container ID.');
      setOutboundContainerId('');
      return;
    }

    if (!currentTask) {
      Alert.alert('Error', 'No current pick task available.');
      setOutboundContainerId('');
      return;
    }

    if (parsedQuantityPicked !== undefined && parsedQuantityPicked < currentTask.quantityRequired) {
      // Handle Short Pick
      shortPickTask(
        outboundContainerId,
        parsedQuantityPicked,
        ({ errorMessage }) => {
          if (errorMessage) {
            Alert.alert('Short Pick Error', errorMessage);
            setOutboundContainerId('');
            return;
          }

          if (params?.reasonCode?.id) {
            // Revalidate all tasks for the requisition to get updated pick tasks
            revalidateTasksForRequisition(currentTask.requisitionId, () => {
              navigate('PickingPickLocation');
            });
          } else {
            revalidateTaskAndProceed();
          }
        },
        params?.reasonCode?.name
      );
      return;
    }

    pickCurrentTask(outboundContainerId, ({ errorMessage }) => {
      if (errorMessage) {
        Alert.alert('Pick Error', errorMessage);
        setOutboundContainerId('');
        return;
      }

      revalidateTaskAndProceed();
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
            {
              icon: 'truck',
              label: 'Quantity Picked',
              value: params?.quantityPicked || currentTask.quantityRequired
            },
            {
              icon: 'pin',
              label: 'Outbound Container Id',
              value: currentTask.outboundContainer?.locationNumber ?? 'New'
            }
          ]}
        />
      </ProductDetails.Root>

      <Divider />

      <View style={[styles.wrapperWithPadding]}>
        <Subheading style={styles.subheading}>Scan Outbound Container</Subheading>
        <Paragraph style={styles.paragraph}>
          Point your barcode scanner at the outbound container or type the code manually.
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
