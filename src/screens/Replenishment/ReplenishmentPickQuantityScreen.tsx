import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { Button, Divider, Paragraph, Subheading } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import EmptyView from '../../components/EmptyView';
import { QuantityIcon } from '../../components/Icons';
import PickingShortAndReasonModal from '../../components/PickingShortAndReasonModal';
import { ScannerInput } from '../../components/ScannerInput';
import { navigate } from '../../NavigationService';
import { getReasonCodesAction } from '../../redux/actions/others';
import { ReasonCode } from '../../types/picking';
import { proceedToNextTask } from './lib';
import { useReplenishmentContext } from './ReplenishmentContext';
import { ReplenishmentTaskDetails } from './ReplenishmentTaskDetails';
import styles from './styles';

export default function ReplenishmentPickQuantityScreen() {
  const { currentList, allTasks, currentTask, currentTaskIndex, tasksCount, shortPickTask, goToTask } =
    useReplenishmentContext();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const [quantityPicked, setQuantityPicked] = useState<string>('');
  const [reasonCodes, setReasonCodes] = useState<ReasonCode[]>([]);
  const [selectedReasonCode, setSelectedReasonCode] = useState<ReasonCode | undefined>(undefined);
  const [isShortModalVisible, setIsShortModalVisible] = useState(false);

  // Each task starts with an empty quantity and no reason
  useEffect(() => {
    if (!isFocused) {
      return;
    }
    setQuantityPicked('');
    setSelectedReasonCode(undefined);
  }, [isFocused, currentTask?.id]);

  useEffect(() => {
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
    return (
      <View style={styles.flex1}>
        <EmptyView
          title="No Replenishment Task"
          description="There is no replenishment task to work on. Choose a replenishment list to start."
        />
        <Button mode="text" style={styles.marginBottom} onPress={() => navigate('ReplenishmentList')}>
          Back To List
        </Button>
      </View>
    );
  }

  function handleSubmit() {
    if (!currentTask) {
      return;
    }
    const parsedQuantityPicked = Number(quantityPicked);
    const isValid = quantityPicked.trim() !== '' && !isNaN(parsedQuantityPicked) && parsedQuantityPicked >= 0;

    if (!isValid) {
      Alert.alert('Invalid Quantity', 'Incorrect quantity picked. Please try again.');
      return;
    }

    const qtyRemaining = currentTask.quantityRequired - (currentTask.quantityPicked || 0);

    if (parsedQuantityPicked > qtyRemaining) {
      Alert.alert('Invalid Quantity', `Qty more than required, Please Re-Enter (required ${qtyRemaining}).`, [
        { text: 'OK', onPress: () => setQuantityPicked('') }
      ]);
      return;
    }

    if (parsedQuantityPicked === qtyRemaining) {
      navigate('ReplenishmentOutboundContainer', { quantityPicked });
      return;
    }

    // Less than required, including zero: "Return" to re-enter the quantity or "Short" with a reason
    setIsShortModalVisible(true);
  }

  function handleConfirmShort(reasonCode: ReasonCode | undefined) {
    setIsShortModalVisible(false);

    if (Number(quantityPicked) > 0) {
      navigate('ReplenishmentOutboundContainer', { quantityPicked, reasonCode });
      return;
    }

    // Nothing picked, so there is nothing to put in a container
    shortPickTask(
      null,
      0,
      ({ errorMessage }) => {
        if (errorMessage) {
          Alert.alert('Short Pick Error', errorMessage);
          setQuantityPicked('');
          return;
        }
        proceedToNextTask({ tasks: allTasks, currentTaskIndex, goToTask });
      },
      reasonCode?.name
    );
  }

  return (
    <>
      <ScrollView style={styles.flex1} keyboardShouldPersistTaps="handled">
        <ReplenishmentTaskDetails
          task={currentTask}
          list={currentList}
          taskIndex={currentTaskIndex}
          tasksCount={tasksCount}
        />

        <Divider />

        <View style={styles.wrapperWithPadding}>
          <Subheading style={styles.subheading}>Enter Quantity Picked</Subheading>
          <Paragraph style={styles.paragraph}>
            Check the quantity in the location and enter the quantity that you have picked.
          </Paragraph>

          <ScannerInput
            showKeyboardOnMount
            autoSubmitTimeout={0}
            keyboardType="number-pad"
            leftIcon={<QuantityIcon size={24} />}
            label="Quantity Picked"
            value={quantityPicked}
            isEnabled={!isShortModalVisible}
            onChange={setQuantityPicked}
            onSubmit={handleSubmit}
          />

          <Button mode="contained" style={styles.marginTop} onPress={handleSubmit}>
            Confirm Quantity
          </Button>
        </View>
      </ScrollView>

      <PickingShortAndReasonModal
        isReasonCodeRequired
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
