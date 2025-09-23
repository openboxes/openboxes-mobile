import { RouteProp, useIsFocused, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, TextInput, View } from 'react-native';
import { Divider, TextInput as PaperTextInput, Paragraph, Subheading } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import AsyncModalSelect from '../../components/AsyncModalSelect';
import Button from '../../components/Button';
import EmptyView from '../../components/EmptyView';
import { INPUT_FOCUS_DELAY_TIME_IN_MS } from '../../constants';
import { navigate, replace } from '../../NavigationService';
import { searchInternalLocations } from '../../redux/actions/locations';
import { patchPutawayTaskAction } from '../../redux/actions/putaways';
import { getReasonCodesAction } from '../../redux/actions/others';
import { RootState } from '../../redux/reducers';
import { PutawayDetailsModel } from '../../types/sortation';
import PutawayDetails from './PutawayDetails';
import styles from './styles';

type PutawayQuantityRouteProp = RouteProp<
  {
    SortationPutawayQuantity: { taskList: PutawayDetailsModel[]; currentTaskIndex: number; isDirectPutaway?: boolean };
  },
  'SortationPutawayQuantity'
>;

type Location = {
  id: string;
  name: string;
  locationNumber?: string;
};

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
  const currentLocation = useSelector((rootState: RootState) => rootState.mainReducer.currentLocation);

  const [putawayQuantity, setPutawayQuantity] = useState<number | undefined>();
  const [internalLocations, setInternalLocations] = useState<Location[]>([]);
  const [selectedAlternativeDestination, setSelectedAlternativeDestination] = useState<Location | null>(
    putawayDetails.destination
  );
  const [reasonCodes, setReasonCodes] = useState<ReasonCode[]>([]);
  const [selectedReasonCode, setSelectedReasonCode] = useState<ReasonCode | null>(null);

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
    dispatch(
      searchInternalLocations('', { 'parentLocation.id': currentLocation?.id }, (data: any) => {
        if (data?.error) {
          Alert.alert('Error', 'Failed to load internal locations.');
          return;
        }
        const mappedLocations: Location[] = data.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          locationNumber: item.locationNumber
        }));

        const filteredLocations = mappedLocations.filter((location) => location.id !== putawayDetails.destination?.id);
        setInternalLocations(filteredLocations);
      })
    );
  }, [dispatch, currentLocation.id, putawayDetails.destination?.id]);

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

    const isAlternativeLocationSelected = selectedAlternativeDestination?.id !== putawayDetails.destination?.id;
    if (putawayQuantity === putawayDetails.quantity) {
      const payload = {
        action: 'complete',
        destination: selectedAlternativeDestination?.id,
        force: isAlternativeLocationSelected
      };
      dispatch(
        patchPutawayTaskAction(putawayDetails.facility.id, putawayDetails.id, payload, (response) => {
          if (response && !response.error) {
            Alert.alert('Sortation Successful', 'The product has been sorted successfully.');
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
            Alert.alert('Sortation Failed', response.errorMessage || 'Sortation Failed');
          }
        })
      );
    } else {
      const payload = {
        action: 'partialComplete',
        quantity: putawayQuantity,
        destination: selectedAlternativeDestination?.id,
        force: isAlternativeLocationSelected,
        reasonCode: selectedReasonCode?.id ? selectedReasonCode.id : null
      };
      if (!selectedReasonCode?.id) {
        Alert.alert('Discrepancy Reason Required', 'Please select a discrepancy reason for a partial putaway.');
        return;
      }
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

  function handleAlternativeLocation() {
    if (internalLocations.length === 0) {
      Alert.alert('No Alternatives', 'No alternative locations are available');
      return;
    }

    const randomIndex = Math.floor(Math.random() * internalLocations.length);
    const randomLocation = internalLocations[randomIndex];

    setSelectedAlternativeDestination(randomLocation);
  }

  const updatedPutawayDetails = {
    ...putawayDetails,
    destination: selectedAlternativeDestination
  };

  return (
    <ScrollView style={styles.contentContainer}>
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
            <Paragraph style={styles.paragraph}>Alternative Location?</Paragraph>
            <Button style={styles.secondaryButton} size="50%" title="Request" onPress={handleAlternativeLocation} />
          </View>

          <View style={styles.headerRow}>
            <Paragraph style={styles.paragraph}>Discrepancy Reason</Paragraph>
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
      </View>

      <View style={styles.bottomActionContainer}>
        <Button style={styles.topSpace} title="Confirm" mode="contained" size="100%" onPress={handleConfirm}>
          Submit
        </Button>
      </View>
    </ScrollView>
  );
}
