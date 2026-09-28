import { useIsFocused } from '@react-navigation/native';
import * as React from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { Button, Divider, Paragraph, Subheading } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import { QuantityIcon } from '../../components/Icons';
import PickingShortAndReasonModal from '../../components/PickingShortAndReasonModal';
import { ProductDetails } from '../../components/ProductDetails';
import { ScannerInput } from '../../components/ScannerInput';
import { HYPHEN } from '../../constants';
import { navigate } from '../../NavigationService';
import { getReasonCodesAction } from '../../redux/actions/others';
import { ReasonCode } from '../../types/picking';
import { parseFromISODateToLocaleString } from '../../utils/utils';
import { CustomerDetails } from './CustomerDetails';
import { proceedToNextOrComplete } from './lib';
import { usePickingContext } from './PickingContext';
import styles from './styles';

export default function PickingPickQuantityScreen() {
  const {
    tasks,
    currentTask,
    currentTaskIndex,
    allTasksCount,
    shortPickTask,
    goToNextTask,
    homeRoute,
    skipStagingStep,
    resetSession
  } = usePickingContext();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const [quantityPicked, setQuantityPicked] = React.useState<string>('');
  const [reasonCodes, setReasonCodes] = React.useState<ReasonCode[]>([]);
  const [selectedReasonCode, setSelectedReasonCode] = React.useState<ReasonCode | undefined>(undefined);
  const [isShortModalVisible, setIsShortModalVisible] = React.useState(false);

  // Reset quantity when screen is focused
  React.useEffect(() => {
    if (!isFocused) {
      return;
    }
    setQuantityPicked('');
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
        null,
        0,
        ({ errorMessage }) => {
          if (errorMessage) {
            Alert.alert('Short Pick Error', errorMessage);
            setQuantityPicked('');
            return;
          }

          // Skip staging if any other task was short picked without a reason code.
          const omitStagingLocationStep = tasks.some(
            (task, index) =>
              index !== currentTaskIndex && task.quantityPicked < task.quantityRequired && !task.reasonCode
          );
          // Skip revalidation: task is closed server-side, and GET /pick-tasks/:id 404s if the requisition is canceled.
          proceedToNextOrComplete({
            currentTaskIndex,
            allTasksCount,
            goToNextTask,
            homeRoute,
            omitStagingLocationStep,
            skipStagingStep,
            resetSession
          });
        },
        reasonCode?.name
      );
      return;
    }

    navigate('PickingPickOutboundContainer', { reasonCode, quantityPicked });
  }

  return (
    <>
      <ScrollView style={styles.flex1} keyboardShouldPersistTaps="handled">
        <ProductDetails.Provider product={currentTask.product} status={currentTask.status}>
          <ProductDetails.Root>
            <ProductDetails.Header>
              <ProductDetails.Badge icon="navigation" label="Pick Task">
                {`${currentTaskIndex + 1} / ${allTasksCount}`}
              </ProductDetails.Badge>
            </ProductDetails.Header>

            <ProductDetails.Separator />
            <ProductDetails.Title />
            <ProductDetails.Caption
              title={currentTask.inventoryItem.lotNumber}
              subtitle={parseFromISODateToLocaleString(currentTask.inventoryItem.expirationDate)}
            />

            <ProductDetails.List
              items={[
                {
                  icon: 'identifier',
                  label: 'Order Number',
                  value: currentTask.requisitionNumber || HYPHEN
                }
              ]}
            />
            <CustomerDetails
              name={currentTask.destination}
              locationType={currentTask.destinationLocationType}
              address={currentTask.destinationAddress}
            />
            <ProductDetails.List
              items={[
                {
                  icon: 'account',
                  label: 'Assignee',
                  value: currentTask?.assignee
                    ? `${currentTask?.assignee?.firstName} ${currentTask?.assignee?.lastName}`.trim()
                    : HYPHEN
                },
                {
                  icon: 'package',
                  label: 'Quantity Picked',
                  value: `${currentTask.quantityPicked || 0} / ${currentTask.quantityRequired}`
                },
                { icon: 'pin', label: 'Pick Location', value: currentTask.location?.name || 'Default' }
              ]}
            />
          </ProductDetails.Root>

          <Divider />

          <View style={[styles.wrapperWithPadding]}>
            <Subheading style={styles.subheading}>Enter Quantity Picked</Subheading>
            <Paragraph style={styles.paragraph}>
              Please enter the quantity of the product that you have picked from the location.
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
        </ProductDetails.Provider>
      </ScrollView>

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
