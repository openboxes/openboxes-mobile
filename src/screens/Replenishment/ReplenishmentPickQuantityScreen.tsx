import React, { useEffect, useState } from 'react';
import { Alert, TextInput, View } from 'react-native';
import { Button, Divider, TextInput as PaperTextInput, Paragraph, Subheading } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import PickingShortAndReasonModal from '../../components/PickingShortAndReasonModal';
import { ProductDetails } from '../../components/ProductDetails';
import { HYPHEN } from '../../constants';
import { useInputFocus } from '../../hooks/useInputFocus';
import { navigate } from '../../NavigationService';
import { getReasonCodesAction } from '../../redux/actions/others';
import { ReasonCode } from '../../types/picking';
import { DUMMY_REPLENISHMENT } from './mock-data';
import { useReplenishmentContext } from './ReplenishmentContext';
import styles from './styles';

export default function ReplenishmentPickQuantityScreen() {
  const { currentTask, currentTaskIndex, tasksCount } = useReplenishmentContext();
  const dispatch = useDispatch();
  const inputRef = React.useRef<TextInput | null>(null);

  const [quantityPicked, setQuantityPicked] = useState<string>('');
  const [reasonCodes, setReasonCodes] = useState<ReasonCode[]>([]);
  const [selectedReasonCode, setSelectedReasonCode] = useState<ReasonCode | undefined>(undefined);
  const [isShortModalVisible, setIsShortModalVisible] = useState(false);

  // Focus input when screen is focused
  useInputFocus(inputRef);

  useEffect(() => {
    dispatch(
      getReasonCodesAction('PICKING_SHORTAGE', (data: any) => {
        if ('errorMessage' in data) {
          Alert.alert('Error', data.errorMessage);
          return;
        }

        setReasonCodes(data);
      })
    );
  }, [dispatch]);

  if (!currentTask) {
    Alert.alert('No Replenishment Task', 'There is no current replenishment task available. Try again later.');
    navigate('Dashboard');
    return null;
  }

  function handleSubmit() {
    const qty = Number(quantityPicked);
    const isValid = !isNaN(qty) && qty >= 0 && currentTask?.quantityRequired;

    if (!isValid) {
      Alert.alert('Invalid Quantity', 'Incorrect quantity picked. Please try again.');
      return;
    }

    const qtyRemaining = currentTask?.quantityRequired - (currentTask?.quantityPicked || 0);
    const isFullPicked = qty === qtyRemaining;

    if (qty > qtyRemaining) {
      Alert.alert('Invalid Quantity', `Picked quantity cannot exceed remaining quantity to pick (${qtyRemaining}).`);
      return;
    }

    if (isFullPicked) {
      navigate('ReplenishmentOutboundContainer');
      return;
    }

    setIsShortModalVisible(true);
  }

  function handleConfirmShort(reasonCode: ReasonCode | undefined) {
    setIsShortModalVisible(false);

    navigate('PickingPickOutboundContainer', { reasonCode, quantityPicked });
  }

  return (
    <>
      {/* @ts-ignore */}
      <ProductDetails.Provider product={DUMMY_REPLENISHMENT.product}>
        <ProductDetails.Root>
          <ProductDetails.Header>
            <ProductDetails.Badge icon="barcode" label="Product Code">
              {currentTask.product.productCode}
            </ProductDetails.Badge>
            <ProductDetails.Badge icon="navigation" label="Pick Task">
              {`${currentTaskIndex + 1} / ${tasksCount}`}
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
