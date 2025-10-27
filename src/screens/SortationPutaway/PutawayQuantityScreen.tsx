import { RouteProp, useIsFocused, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, TextInput, View } from 'react-native';
import { Divider, Paragraph, Portal, Subheading, Switch, TextInput as PaperTextInput } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import AsyncModalSelect from '../../components/AsyncModalSelect';
import Button from '../../components/Button';
import EmptyView from '../../components/EmptyView';
import { INPUT_FOCUS_DELAY_TIME_IN_MS } from '../../constants';
import { navigate, replace } from '../../NavigationService';
import { patchPutawayTaskAction } from '../../redux/actions/putaways';
import { getReasonCodesAction } from '../../redux/actions/others';
import { PutawayDetailsModel, SortationLocation } from '../../types/sortation';
import PutawayDetails from './PutawayDetails';
import styles from './styles';
import Theme from '../../utils/Theme';
import AlternativeLocationSelector from '../../components/AlternativeLocationSelector';

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
    // Strip non-numeric characters and convert to number
    const digitsOnly = text.replace(/[^0-9]/g, '');
    const num = digitsOnly.length > 0 ? parseInt(digitsOnly, 10) : undefined;
    setPutawayQuantity(num);
  }

  function handleConfirm() {
    if (!isCancelRemainingEnabled) {
      if (!putawayQuantity) {
        Alert.alert('Invalid Putaway Quantity', 'Quantity is required.');
        return;
      }

      if (putawayQuantity < 1 || putawayQuantity > putawayDetails.quantity) {
        Alert.alert(
          'Invalid Putaway Quantity',
          `Please enter a valid putaway quantity between 1 and ${putawayDetails.quantity}.`
        );
        return;
      }
    }

    if (putawayQuantity === putawayDetails.quantity || isCancelRemainingEnabled) {
      if (isCancelRemainingEnabled && !selectedReasonCode?.id) {
        Alert.alert('Discrepancy Reason Required', 'Please select a discrepancy reason.');
        return;
      }
      const payload = {
        action: 'complete',
        destination: selectedAlternativeDestination?.id,
        isCancelRemaining: isCancelRemainingEnabled,
        reasonCode: selectedReasonCode?.id ? selectedReasonCode.id : null
      };
      dispatch(
        patchPutawayTaskAction(putawayDetails.facility.id, putawayDetails.id, payload, (response) => {
          if (response && !response.error) {
            Alert.alert('Putaway Successful', 'The putaway was successful.');
            const nextTaskIndex = currentTaskIndex + 1;
            if (nextTaskIndex < taskList.length) {
              navigate('SortationPutawayLocationScan', {
                taskList,
                currentTaskIndex: nextTaskIndex,
                isDirectPutaway
              });
            } else {
              if (isDirectPutaway) {
                navigate('Sortation');
              } else {
                navigate('SortationPutaway');
              }
            }
          } else {
            Alert.alert('Putaway Failed', response.errorMessage || 'Putaway Failed');
          }
        })
      );
    } else {
      if (!selectedReasonCode?.id) {
        Alert.alert('Discrepancy Reason Required', 'Please select a discrepancy reason.');
        return;
      }
      const payload = {
        action: 'partialComplete',
        quantity: putawayQuantity,
        destination: selectedAlternativeDestination?.id,
        reasonCode: selectedReasonCode?.id ? selectedReasonCode.id : null
      };
      dispatch(
        patchPutawayTaskAction(putawayDetails.facility.id, putawayDetails.id, payload, (response) => {
          if (response && !response.error && response.data) {
            const remainingTask = response.data;
            replace('SortationPutawayQuantity', {
              taskList: [remainingTask],
              currentTaskIndex: 0,
              isDirectPutaway
            });
          } else {
            Alert.alert('Partial Putaway Failed', response.errorMessage || 'Partial putaway operation failed');
          }
        })
      );
    }
  }

  function handleCancelRemainingToggle(isEnabled: boolean) {
    setIsCancelRemainingEnabled(isEnabled);

    if (isEnabled) {
      setPutawayQuantity(putawayDetails.quantity);
    } else {
      setPutawayQuantity(undefined);
    }
  }

  const updatedPutawayDetails = {
    ...putawayDetails,
    destination: selectedAlternativeDestination ?? putawayDetails.destination
  };

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
                  onSelect={(reason: ReasonCode) => setSelectedReasonCode(reason)}
                />
              </View>
            </View>
          </View>

          <View style={styles.cardAnnotation}>
            <Paragraph style={[styles.subheading]}>Cancel Remaining</Paragraph>
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
