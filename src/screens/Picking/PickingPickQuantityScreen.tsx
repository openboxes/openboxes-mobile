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

export default function PickingPickQuantityScreen() {
  const {
    currentTask,
    currentTaskIndex,
    allTasksCount
    // handlePartialPick
  } = usePickingContext();
  const dispatch = useDispatch();
  const inputRef = React.useRef<TextInput | null>(null);
  const isFocused = useIsFocused();

  const [quantityPicked, setQuantityPicked] = React.useState<string>('');
  const [reasonCodes, setReasonCodes] = React.useState<ReasonCode[]>([]);
  const [selectedReasonCode, setSelectedReasonCode] = React.useState<ReasonCode | null>(null);
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
      getReasonCodesAction('PUTAWAY_DISCREPANCY', (data: any) => {
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
    const qty = Number(quantityPicked);
    const isValid = !isNaN(qty) && qty >= 0;
    const isFullPicked = qty === currentTask?.quantityRequired;
    const is0Picked = qty === 0;

    if (qty > (currentTask?.quantityRequired ?? 0)) {
      Alert.alert('Invalid Quantity', 'Picked quantity cannot exceed required quantity.');
      return;
    }

    if (!isValid) {
      Alert.alert('Invalid Quantity', 'Incorrect quantity picked. Please try again.');
      return;
    }

    // NOTE: Not supported yet
    if (is0Picked) {
      setIsShortModalVisible(true);
      return;
    }

    if (isFullPicked) {
      navigate('PickingPickOutboundContainer');
      return;
    }

    Alert.alert(
      'Partial Pick Recorded',
      `You have picked ${qty} units. The remaining quantity will need to be picked later.`,
      [
        {
          text: 'OK',
          onPress: () => setQuantityPicked('')
        }
      ]
    );

    // TODO: Handle partial pick
    // Handle partial pick
    // handlePartialPick(qty);
  }

  function handleConfirmShort(reasonCode: ReasonCode) {
    setIsShortModalVisible(false);
    // TODO: Handle short pick with reason code
    // eslint-disable-next-line no-restricted-syntax
    console.log(reasonCode);
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
              { icon: 'truck', label: 'Quantity Required', value: currentTask.quantityRequired },
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
        onDismiss={() => setIsShortModalVisible(false)}
        onConfirm={handleConfirmShort}
      />
    </>
  );
}
