import { RouteProp, useIsFocused, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, TextInput, View } from 'react-native';
import { Divider, TextInput as PaperTextInput, Paragraph, Portal, Subheading, Switch } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import AsyncModalSelect from '../../components/AsyncModalSelect';
import Button from '../../components/Button';
import EmptyView from '../../components/EmptyView';
import { INPUT_FOCUS_DELAY_TIME_IN_MS } from '../../constants';
import { navigate, replace } from '../../NavigationService';
import { getReasonCodesAction } from '../../redux/actions/others';
import { patchPutawayTaskAction } from '../../redux/actions/putaways';
import { PutawayDetailsModel, SortationLocation } from '../../types/sortation';
import Theme from '../../utils/Theme';
import AlternativeLocationSelector from './AlternativeLocationSelector';
import PutawayDetails from './PutawayDetails';
import styles from './styles';

type PutawayQuantityRouteProp = RouteProp<
  {
    SortationPutawayQuantity: { taskList: PutawayDetailsModel[]; currentTaskIndex: number; isDirectPutaway?: boolean };
  },
  'SortationPutawayQuantity'
>;

type ReasonCode = {
  id: string;
  name: string;
};

export default function PutawayQuantityScreen() {
  const { params } = useRoute<PutawayQuantityRouteProp>();
  const { taskList, currentTaskIndex, isDirectPutaway } = params;
  const putawayDetails = taskList[currentTaskIndex];
  const dispatch = useDispatch();

  const inputRef = useRef<TextInput | null>(null);
  const isFocused = useIsFocused();

  const [putawayQuantity, setPutawayQuantity] = useState<number | undefined>();
  const [selectedAlternativeDestination, setSelectedAlternativeDestination] = useState<SortationLocation | null>(
    putawayDetails.destination
  );
  const [reasonCodes, setReasonCodes] = useState<ReasonCode[]>([]);
  const [selectedReasonCode, setSelectedReasonCode] = useState<ReasonCode | null>(null);
  const [isCancelRemainingEnabled, setIsCancelRemainingEnabled] = useState<boolean>(false);

  const [isDialogVisible, setIsDialogVisible] = useState(false);

  useEffect(() => {
    setSelectedAlternativeDestination(putawayDetails.destination);
  }, [putawayDetails]);

  useEffect(() => {
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

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    const t = setTimeout(() => inputRef.current?.focus(), INPUT_FOCUS_DELAY_TIME_IN_MS);
    return () => clearTimeout(t);
  }, [isFocused]);

  if (!putawayDetails) {
    return (
      <View style={styles.emptyContainer}>
        <EmptyView
          title="Putaway Details Not Found"
          description="The putaway details you are looking for do not exist or are not available."
        />
      </View>
    );
  }

  function handleChange(text: string) {
    const digitsOnly = text.replace(/\D/g, '');
    const num = digitsOnly ? Math.min(parseInt(digitsOnly, 10), putawayDetails.quantity) : undefined;
    setPutawayQuantity(num);
  }

  function handleCancelRemainingToggle(isEnabled: boolean) {
    setIsCancelRemainingEnabled(isEnabled);
  }

  function handleConfirm() {
    const totalQty = putawayDetails.quantity;

    if (putawayQuantity === undefined || putawayQuantity < 0 || putawayQuantity > putawayDetails.quantity) {
      Alert.alert(
        'Invalid Putaway Quantity',
        `Please enter a valid putaway quantity between 0 and ${putawayDetails.quantity}.`
      );
      return;
    }

    const hasDiscrepancy = putawayQuantity < totalQty || isCancelRemainingEnabled;

    if (hasDiscrepancy && !selectedReasonCode?.id) {
      Alert.alert('Discrepancy Reason Required', 'Please select a discrepancy reason.');
      return;
    }

    // Full quantity putaway
    if (putawayQuantity === totalQty) {
      const payload = {
        action: 'complete',
        destination: selectedAlternativeDestination?.id,
        isCancelRemaining: false,
        reasonCode: selectedReasonCode?.id ?? null,
        isDirectPutaway
      };
      return dispatchComplete(payload);
    }

    // Partial putaway (first step)
    const partialPayload = {
      action: 'partialComplete',
      quantity: putawayQuantity,
      destination: selectedAlternativeDestination?.id,
      reasonCode: selectedReasonCode?.id ?? null,
      isDirectPutaway
    };

    dispatch(
      patchPutawayTaskAction(putawayDetails.facility.id, putawayDetails.id, partialPayload, (response: any) => {
        if (!response || response.error || !response.data) {
          Alert.alert('Partial Putaway Failed', response?.errorMessage || 'Partial putaway failed.');
          return;
        }

        const remainingTask = response.data;

        // Cancel Remaining True
        if (isCancelRemainingEnabled) {
          const cancelPayload = {
            action: 'complete',
            destination: remainingTask.destination?.id,
            isCancelRemaining: true,
            reasonCode: selectedReasonCode?.id ?? null,
            isDirectPutaway
          };

          dispatch(
            patchPutawayTaskAction(
              remainingTask.facility.id,
              remainingTask.id,
              cancelPayload,
              handleResponseAfterComplete
            )
          );
        } else {
          // Cancel Remaining False - Navigate to Quantity Screen with new task
          replace('SortationPutawayQuantity', {
            taskList: [remainingTask],
            currentTaskIndex: 0,
            isDirectPutaway
          });
        }
      })
    );
  }

  function dispatchComplete(payload: any) {
    dispatch(
      patchPutawayTaskAction(putawayDetails.facility.id, putawayDetails.id, payload, handleResponseAfterComplete)
    );
  }

  function handleResponseAfterComplete(response: any) {
    if (response && !response.error) {
      Alert.alert('Putaway Successful', 'The putaway was successful.');
      const nextIndex = currentTaskIndex + 1;
      if (nextIndex < taskList.length) {
        navigate('SortationPutawayLocationScan', {
          taskList,
          currentTaskIndex: nextIndex,
          isDirectPutaway
        });
      } else {
        navigate(isDirectPutaway ? 'Sortation' : 'SortationPutaway');
      }
    } else {
      Alert.alert('Putaway Failed', response?.errorMessage || 'Putaway failed.');
    }
  }

  const updatedPutawayDetails = {
    ...putawayDetails,
    destination: selectedAlternativeDestination ?? putawayDetails.destination
  };

  const remainingQty = Math.max(putawayDetails.quantity - (putawayQuantity ?? 0), 0);

  return (
    <Portal.Host>
      <ScrollView keyboardShouldPersistTaps="handled" style={styles.contentContainer}>
        <PutawayDetails putawayDetails={updatedPutawayDetails} />
        <Divider />

        <View style={styles.formContainer}>
          <Subheading style={styles.subheading}>Enter Putaway Quantity</Subheading>
          <PaperTextInput
            ref={inputRef}
            autoCompleteType="off"
            style={styles.topSpace}
            mode="outlined"
            label="Putaway Quantity Entry Field"
            keyboardType="number-pad"
            value={putawayQuantity?.toString() || ''}
            returnKeyType="done"
            onChangeText={handleChange}
          />

          <View style={styles.topSpace}>
            <View style={[styles.headerRow, styles.bottomSpace]}>
              <Paragraph style={styles.subheading}>Alternative Location?</Paragraph>
              <Button size="50%" title="Request" onPress={() => setIsDialogVisible(true)} />
            </View>

            <View style={styles.headerRow}>
              <Paragraph style={styles.subheading}>Discrepancy Reason</Paragraph>
              <View style={styles.dropdownContainer}>
                <AsyncModalSelect
                  placeholder="Select a reason"
                  label="Reason for shortage"
                  initValue={selectedReasonCode?.name || ''}
                  initialData={reasonCodes}
                  searchAction={() => {}}
                  serverSearchEnabled={false}
                  disabled={!isCancelRemainingEnabled && putawayQuantity === putawayDetails.quantity}
                  onSelect={(reason: ReasonCode) => setSelectedReasonCode(reason)}
                />
              </View>
            </View>
          </View>

          <View style={styles.cardAnnotation}>
            <Paragraph style={styles.subheading}>Cancel Remaining ({remainingQty})</Paragraph>
            <Switch
              value={isCancelRemainingEnabled}
              color={Theme.colors.primary}
              onValueChange={handleCancelRemainingToggle}
            />
          </View>
        </View>

        <View style={styles.bottomActionContainer}>
          <Button style={styles.topSpace} title="Confirm" mode="contained" size="100%" onPress={handleConfirm}>
            Submit
          </Button>
        </View>
      </ScrollView>

      <AlternativeLocationSelector
        visible={isDialogVisible}
        putawayDetails={putawayDetails}
        initialLocation={selectedAlternativeDestination}
        onDismiss={() => setIsDialogVisible(false)}
        onConfirm={(location) => {
          setSelectedAlternativeDestination(location);
          setIsDialogVisible(false);
        }}
      />
    </Portal.Host>
  );
}
