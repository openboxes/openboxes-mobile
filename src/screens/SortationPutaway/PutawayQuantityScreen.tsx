import { RouteProp, useIsFocused, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Modal, TextInput, View } from 'react-native';
import { Divider, TextInput as PaperTextInput, Paragraph, Subheading } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/Button';
import EmptyView from '../../components/EmptyView';
import PutawayDetails from './PutawayDetails';
import styles from './styles';
import { patchPutawayTaskAction } from '../../redux/actions/putaways';
import { navigate } from '../../NavigationService';
import { searchInternalLocations } from '../../redux/actions/locations';
import { RootState } from '../../redux/reducers';
import AsyncModalSelect from '../../components/AsyncModalSelect';
import { PutawayDetailsModel } from '../../types/sortation';
import { INPUT_FOCUS_DELAY_TIME_IN_MS } from '../../constants';

type PutawayQuantityRouteProp = RouteProp<
  { SortationPutawayQuantity: { taskList: PutawayDetailsModel[]; currentTaskIndex: number; isDirectPutaway?: boolean } },
  'SortationPutawayQuantity'
>;

type Location = {
  id: string;
  name: string;
  locationNumber?: string;
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
  const [isAlternativeLocationModalVisible, setIsAlternativeLocationModalVisible] = useState(false)
  const [internalLocations, setInternalLocations] = useState<Location[]>([]);
  const [selectedAlternativeDestination, setSelectedAlternativeDestination] = useState<Location | null>(putawayDetails.destination);

  useEffect(() => {
    dispatch(
      searchInternalLocations('', { 'parentLocation.id': currentLocation?.id }, (data: any) => {
        if (data?.error) {
          Alert.alert(
            'Error', 
            'Failed to load internal locations.'
          );
          return;
        }
        const internalLocations: Location[] = data.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          locationNumber: item.locationNumber
        }));

        const filteredLocations = internalLocations.filter(
          (location) => location.id !== putawayDetails.destination?.id
        )
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

  function handleMainConfirm() {
    if (!putawayQuantity) {
      Alert.alert(
        'Invalid Putaway Quantity', 
        'Please enter a valid putaway quantity.'
      );
      return;
    }

    if (putawayQuantity < 1 || putawayQuantity > putawayDetails.quantity) {
      Alert.alert(
        'Invalid Putaway Quantity',
        `Please enter a valid putaway quantity between 1 and ${putawayDetails.quantity}.`
      );
      return;
    }

    if (putawayQuantity !== putawayDetails.quantity) {
      Alert.alert(
        'Confirm Partial Putaway',
        `Entered quantity (${putawayQuantity}) does not match expected quantity (${putawayDetails.quantity}). If you want to proceed with the partial putaway, please use the "Partial Putaway" confirmation.`
      );
      return;
    }

    const isAlternativeLocationSelected = selectedAlternativeDestination?.id !== putawayDetails.destination?.id;
    const payload = {
      action: 'complete',
      destination: selectedAlternativeDestination?.id,
      force: isAlternativeLocationSelected
    };

    dispatch(
      patchPutawayTaskAction(putawayDetails.facility.id, putawayDetails.id, payload, (response) => {
        if (response && !response.error) {
          Alert.alert(
            'Sortation Successful', 
            'The product has been sorted successfully.'
          );
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
          Alert.alert(
            'Sortation Failed', 
            response.errorMessage || 'Sortation Failed'
          );
        }
      })
    );
  }

  function handleAlternativeLocation() {
    setIsAlternativeLocationModalVisible(true);
  }

  function handleLocationSelect(location: Location) {
    if (!location || !location.id) {
      setSelectedAlternativeDestination(putawayDetails.destination);
    } else {
      setSelectedAlternativeDestination(location);
    }

    setIsAlternativeLocationModalVisible(false)
  }

  function handlePartialPutaway() {
    handleMainConfirm() // so far call the same logic as for main(full qty) confirm
  }

  const updatedPutawayDetails = {
    ...putawayDetails,
    destination: selectedAlternativeDestination
  };

  return (
    <View style={styles.contentContainer}>
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

        <Button style={styles.topSpace} title="Confirm" mode="contained" size="100%" onPress={handleMainConfirm}>
          Submit
        </Button>
      </View>

      <View style={styles.formContainer}>
        <View style={[styles.headerRow, styles.bottomSpace]}>
          <Paragraph style={styles.paragraph}>Alternative Location?</Paragraph>
          <Button style={styles.secondaryButton} size="50%" title="Request" onPress={handleAlternativeLocation} />
        </View>

        <View style={styles.headerRow}>
          <Paragraph style={styles.paragraph}>Partial Putaway?</Paragraph>
          <Button style={styles.secondaryButton} size="50%" title="Confirm" onPress={handlePartialPutaway} />
        </View>
      </View>

      <Modal 
        visible={isAlternativeLocationModalVisible} 
        animationType="slide" 
        onRequestClose={() => setIsAlternativeLocationModalVisible(false)}
        transparent={true} >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Subheading style={{ marginBottom: 15 }}>Select Alternative Location</Subheading>
              <AsyncModalSelect
                placeholder="Search for internal location"
                label="Search for internal location"
                initValue={
                  selectedAlternativeDestination?.id !== putawayDetails.destination?.id
                    ? selectedAlternativeDestination?.name || ''
                    : ''
                }
                initialData={internalLocations}
                searchAction={searchInternalLocations}
                searchActionParams={{ 'parentLocation.id': currentLocation.id }}
                onSelect={handleLocationSelect}
              />
              <Button 
                style={styles.secondaryButton} 
                size="50%" 
                title="Close" 
                onPress={() => setIsAlternativeLocationModalVisible(false)}
              />
            </View>
          </View>
      </Modal>
    </View>
  );
}
