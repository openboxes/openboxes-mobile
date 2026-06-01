import { RouteProp, useIsFocused, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { Divider, Paragraph, Portal, Subheading, Switch } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import AsyncModalSelect from '../../components/AsyncModalSelect';
import Button from '../../components/Button';
import EmptyView from '../../components/EmptyView';
import Icon, { Name as IconName } from '../../components/Icon';
import { QuantityIcon } from '../../components/Icons';
import { ScannerInput } from '../../components/ScannerInput';
import { navigate, replace } from '../../NavigationService';
import { getReasonCodesAction } from '../../redux/actions/others';
import { getPutawayDetailsByContainerId, patchPutawayTaskAction } from '../../redux/actions/putaways';
import { RootState } from '../../redux/reducers';
import { SortationLocation, SortationTask } from '../../types/sortation';
import Theme from '../../utils/Theme';
import AlternativeLocationSelector from './AlternativeLocationSelector';
import PutawayDetails from './PutawayDetails';
import styles from './styles';

type PutawayQuantityRouteProp = RouteProp<
  {
    SortationPutawayQuantity: {
      currentTaskIndex: number;
      isDirectPutaway?: boolean;
      isUserDirected?: boolean;
      containerId?: string;
      task?: SortationTask;
    };
  },
  'SortationPutawayQuantity'
>;

type ReasonCode = {
  id: string;
  name: string;
};

// eslint-disable-next-line complexity
export default function PutawayQuantityScreen() {
  const { params } = useRoute<PutawayQuantityRouteProp>();
  const { currentTaskIndex, isDirectPutaway, isUserDirected, containerId, task } = params;
  const putawayTasks = useSelector((state: RootState) => state.putawayReducer.putawayTasks) as SortationTask[];
  const putawayDetails = task ?? putawayTasks?.[currentTaskIndex];
  const dispatch = useDispatch();

  const isFocused = useIsFocused();

  const [putawayQuantity, setPutawayQuantity] = useState<number | undefined>();
  const [selectedAlternativeDestination, setSelectedAlternativeDestination] = useState<SortationLocation | null>(
    putawayDetails?.destination
  );
  const [reasonCodes, setReasonCodes] = useState<ReasonCode[]>([]);
  const [selectedReasonCode, setSelectedReasonCode] = useState<ReasonCode | null>(null);
  const [isCancelRemainingEnabled, setIsCancelRemainingEnabled] = useState<boolean>(false);

  const [isDialogVisible, setIsDialogVisible] = useState(false);

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
    setPutawayQuantity(undefined);
  }, [isFocused]);

  const remainingQty = Math.max((putawayDetails?.quantity ?? 0) - (putawayQuantity ?? 0), 0);
  const isCancelRemainingDisabled = remainingQty === 0;
  const hasDiscrepancy =
    (putawayQuantity !== undefined && putawayQuantity < (putawayDetails?.quantity ?? 0)) || isCancelRemainingEnabled;

  useEffect(() => {
    if (isCancelRemainingDisabled && isCancelRemainingEnabled) {
      setIsCancelRemainingEnabled(false);
    }
  }, [isCancelRemainingDisabled, isCancelRemainingEnabled]);

  useEffect(() => {
    if (!hasDiscrepancy && selectedReasonCode) {
      setSelectedReasonCode(null);
    }
  }, [hasDiscrepancy, selectedReasonCode]);

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
    const totalQty = Number(putawayDetails.quantity);

    if (putawayQuantity === undefined || putawayQuantity < 0 || putawayQuantity > putawayDetails.quantity) {
      Alert.alert(
        'Invalid Putaway Quantity',
        `Please enter a valid putaway quantity between 0 and ${putawayDetails.quantity}.`
      );
      return;
    }

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
        } else if (isDirectPutaway) {
          // Direct Putaway: partial done, remaining task lives on backend
          navigate('Sortation');
        } else if (isUserDirected && containerId) {
          // User-Directed: go back to task list after partial putaway
          navigate('SortationPutawayTaskList', { containerId });
        } else {
          // System-Directed: navigate to Quantity Screen with remaining task
          dispatch(
            getPutawayDetailsByContainerId(containerId!, () => {
              replace('SortationPutawayLocationScan', {
                currentTaskIndex: 0,
                isDirectPutaway,
                isUserDirected,
                containerId
              });
            })
          );
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

      if (isDirectPutaway) {
        // Direct Putaway: single task done, go back to Sortation
        navigate('Sortation');
      } else if (isUserDirected && containerId) {
        navigate('SortationPutawayTaskList', { containerId });
      } else {
        // Re-fetch removes the completed task, so remaining tasks shift down.
        // Use index 0 to start at the new first task after re-fetch.
        const hasMoreTasks = putawayTasks?.length > 1;
        if (hasMoreTasks) {
          dispatch(getPutawayDetailsByContainerId(containerId!));
          navigate('SortationPutawayLocationScan', {
            currentTaskIndex: 0,
            isDirectPutaway,
            isUserDirected,
            containerId
          });
        } else {
          navigate(isDirectPutaway ? 'Sortation' : 'SortationPutaway');
        }
      }
    } else {
      Alert.alert('Putaway Failed', response?.errorMessage || 'Putaway failed.');
    }
  }

  const updatedPutawayDetails = {
    ...putawayDetails,
    destination: selectedAlternativeDestination ?? putawayDetails?.destination
  };

  return (
    <Portal.Host>
      <ScrollView keyboardShouldPersistTaps="always" style={styles.contentContainer}>
        <PutawayDetails
          putawayDetails={updatedPutawayDetails}
          taskIndex={currentTaskIndex}
          totalTasks={putawayTasks?.length || 0}
          showTaskCounter={!isUserDirected}
          onOverrideDestination={() => setIsDialogVisible(true)}
        />
        <Divider />

        <View style={styles.formContainer}>
          <Subheading style={styles.subheading}>Enter Putaway Quantity</Subheading>
          <ScannerInput
            showKeyboardOnMount
            autoSubmitTimeout={0}
            keyboardType="number-pad"
            leftIcon={<QuantityIcon size={24} />}
            label="Putaway Quantity"
            value={putawayQuantity?.toString() ?? ''}
            isEnabled={!isDialogVisible}
            onChange={handleChange}
            onSubmit={handleConfirm}
          />

          {hasDiscrepancy && (
            <View style={[styles.topSpace, styles.headerRow]}>
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
          )}

          <View style={styles.cardAnnotation}>
            <Paragraph style={[styles.subheading, isCancelRemainingDisabled && styles.subheadingDisabled]}>
              Cancel Remaining ({remainingQty})
            </Paragraph>
            <Switch
              value={isCancelRemainingEnabled}
              color={Theme.colors.primary}
              disabled={isCancelRemainingDisabled}
              onValueChange={handleCancelRemainingToggle}
            />
          </View>

          {isCancelRemainingEnabled && remainingQty > 0 && (
            <View style={styles.lostAndFoundBanner}>
              <Icon name={IconName.Warning} size={20} color={Theme.colors.warningText} />
              <Paragraph style={styles.lostAndFoundBannerText}>
                The remaining {remainingQty} will be recorded as Lost & Found upon submission.
              </Paragraph>
            </View>
          )}
        </View>

        <View style={styles.bottomActionContainer}>
          <Button style={styles.topSpace} title="Submit" mode="contained" size="100%" onPress={handleConfirm} />
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
