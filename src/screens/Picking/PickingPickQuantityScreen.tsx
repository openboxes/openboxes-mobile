import { useIsFocused } from '@react-navigation/native';
import * as React from 'react';
import { Alert, TextInput, View } from 'react-native';
import { Button, Divider, TextInput as PaperTextInput, Paragraph, Subheading } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import { HYPHEN, INPUT_FOCUS_DELAY_TIME_IN_MS } from '../../constants';
import { navigate } from '../../NavigationService';
import { getReasonCodesAction } from '../../redux/actions/others';
import { ReasonCode } from '../../types/picking';
import { usePickingContext } from './PickingContext';
import PickingShortAndReasonModal from './PickingShortAndReasonModal';
import { ProductDetails } from './ProductDetails';
import styles from './styles';
import { revalidateTaskAndProceed } from './lib';

export default function PickingPickQuantityScreen() {
  const { currentTask, currentTaskIndex, allTasksCount, shortPickTask, revalidateCurrentTask, goToNextTask } =
    usePickingContext();
  const dispatch = useDispatch();
  const inputRef = React.useRef<TextInput | null>(null);
  const isFocused = useIsFocused();

  const [quantityPicked, setQuantityPicked] = React.useState<string>('');
  const [reasonCodes, setReasonCodes] = React.useState<ReasonCode[]>([]);
  const [selectedReasonCode, setSelectedReasonCode] = React.useState<ReasonCode | undefined>(undefined);
  const [isShortModalVisible, setIsShortModalVisible] = React.useState(false);

  // Focus input when screen is focused
  React.useEffect(() => {
    if (!isFocused) {
      return;
    }
    setQuantityPicked('');
    const t = setTimeout(() => inputRef.current?.focus(), INPUT_FOCUS_DELAY_TIME_IN_MS);
    return () => clearTimeout(t);
  }, [isFocused]);

  // Fetch reason codes
  React.useEffect(() => {
    dispatch(
      getReasonCodesAction('PICKING_SHORTAGE', (data: any) => {
        if (data?.error) {
          Alert.alert('Error', 'Failed to load reason codes.');
        } else {
          setReasonCodes(data);
        }
      })
    );
  }, [dispatch]);

  if (!currentTask) {
    return null;
  }

  function handleSubmit() {
    const parsedQuantityPicked = Number(quantityPicked);
    const isValid = !isNaN(parsedQuantityPicked) && parsedQuantityPicked >= 0 && currentTask?.quantityRequired;

    if (!isValid) {
      Alert.alert('Invalid Quantity', 'Incorrect quantity picked. Please try again.');
      return;
    }

    const qtyRemaining = currentTask?.quantityRequired - (currentTask?.quantityPicked || 0);

    if (parsedQuantityPicked > qtyRemaining) {
      Alert.alert('Invalid Quantity', `Picked quantity cannot exceed remaining quantity to pick (${qtyRemaining}).`);
      return;
    }

    if (parsedQuantityPicked === currentTask.quantityRequired) {
      navigate('PickingPickOutboundContainer');
      return;
    }

    // For now, if not full picked, treat as short pick
    setIsShortModalVisible(true);
  }

  function handleConfirmShort(reasonCode: ReasonCode | undefined) {
    setIsShortModalVisible(false);

    if (!currentTask) {
      Alert.alert('Error', 'No current pick task found.');
      return;
    }

    if (Number(quantityPicked) === 0) {
      // Handle 0 Short Pick
      // For 0 short pick, we need to provide a reason code
      shortPickTask(
        '',
        0,
        ({ errorMessage }) => {
          if (errorMessage) {
            Alert.alert('Short Pick Error', errorMessage);
            setQuantityPicked('');
            return;
          }

          revalidateTaskAndProceed(revalidateCurrentTask, currentTaskIndex, allTasksCount, goToNextTask);
        },
        reasonCode?.name
      );
      return;
    }

    navigate('PickingPickOutboundContainer', { reasonCode, quantityPicked });
  }

  return (
    <>
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
            keyboardType="numeric"
            returnKeyType="done"
            onChangeText={setQuantityPicked}
          />

          <Button mode="contained" style={styles.marginTop} onPress={handleSubmit}>
            Confirm Quantity
          </Button>
        </View>
      </ProductDetails.Provider>

      <PickingShortAndReasonModal
        visible={isShortModalVisible}
        reasonCodes={reasonCodes}
        selectedReasonCode={selectedReasonCode}
        setSelectedReasonCode={setSelectedReasonCode}
        quantityPicked={quantityPicked}
        onDismiss={() => setIsShortModalVisible(false)}
        onConfirm={handleConfirmShort}
      />
    </>
  );
}
