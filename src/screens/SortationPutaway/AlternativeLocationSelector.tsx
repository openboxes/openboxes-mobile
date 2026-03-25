import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Modal, View } from 'react-native';
import { Paragraph, Subheading } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import Button from '../../components/Button';
import { ScannerInput } from '../../components/ScannerInput';
import { EMPTY_STRING } from '../../constants';
import { getAlternativeDestinationsAction, searchLocationByLocationNumber } from '../../redux/actions/locations';
import { SortationLocation, SortationTask } from '../../types/sortation';
import styles from './styles';

type Props = {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: (location: SortationLocation) => void;
  putawayDetails: SortationTask;
  initialLocation: SortationLocation | null;
};

export default function AlternativeLocationSelector({
  visible,
  onDismiss,
  onConfirm,
  putawayDetails,
  initialLocation
}: Props) {
  const dispatch = useDispatch();

  const [alternativeLocations, setAlternativeLocations] = useState<SortationLocation[]>([]);
  const [tempAlternativeLocation, setTempAlternativeLocation] = useState<SortationLocation | null>(initialLocation);
  const [scannedLocationInput, setScannedLocationInput] = useState('');
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  // Reset state when modal opens
  useEffect(() => {
    if (visible) {
      setTempAlternativeLocation(initialLocation);
      setScannedLocationInput(EMPTY_STRING);
      setSuggestionIndex(0);
    }
  }, [visible, initialLocation]);

  // Load list of alternatives when modal opens
  useEffect(() => {
    if (!visible) {
      return;
    }

    dispatch(
      getAlternativeDestinationsAction(putawayDetails.facility.id, putawayDetails.id, (data: any) => {
        if (data?.error) {
          Alert.alert('Error', 'Failed to load alternative locations.');
          return;
        }
        const mapped: SortationLocation[] = data.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          locationNumber: item.locationNumber
        }));
        setAlternativeLocations(mapped);
      })
    );
  }, [dispatch, putawayDetails.facility.id, putawayDetails.id, visible]);

  const handleLocationSearch = useCallback(
    (locationNumber: string) => {
      dispatch(
        searchLocationByLocationNumber(locationNumber, (data: any) => {
          if (data && !data.error) {
            setTempAlternativeLocation(data);
          } else {
            setTempAlternativeLocation(null);
            Alert.alert('Location Not Found', `Location "${locationNumber}" could not be found.`);
          }
        })
      );
    },
    [dispatch]
  );

  const handleSuggestLocation = () => {
    if (alternativeLocations.length === 0) {
      Alert.alert('No Suggestions', 'No alternative locations are available.');
      return;
    }
    const suggested = alternativeLocations[suggestionIndex];
    setTempAlternativeLocation(suggested);

    // Clear the manual input if they choose a suggestion
    setScannedLocationInput(EMPTY_STRING);

    const nextIndex = (suggestionIndex + 1) % alternativeLocations.length;
    setSuggestionIndex(nextIndex);
  };

  const handleConfirmAlternative = () => {
    if (tempAlternativeLocation) {
      onConfirm(tempAlternativeLocation);
    }
    onDismiss();
  };

  // Don't render anything if not visible
  // This ensures we do not fight for focus with the scanner input when the modal is closed
  if (!visible) {
    return null;
  }

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onDismiss}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Subheading style={styles.modalTitleText}>Choose Alternative Location</Subheading>
          </View>

          <Paragraph style={styles.dialogCurrentLocationWrapper}>
            <Paragraph style={styles.dialogCurrentLocationLabel}>Current Location: </Paragraph>
            {putawayDetails.destination?.name || 'Unassigned'}
          </Paragraph>

          <Button
            size="100%"
            title="Suggest new location"
            mode="contained"
            style={styles.dialogSuggestButton}
            onPress={handleSuggestLocation}
          />

          <ScannerInput
            label="Scan location number"
            value={scannedLocationInput}
            onChange={setScannedLocationInput}
            onSubmit={handleLocationSearch}
          />

          <Paragraph style={styles.dialogNewLocationHeader}>
            New Location: {tempAlternativeLocation?.name || 'Unknown'}
          </Paragraph>

          <View style={styles.dialogActions}>
            <Button size="default" mode="text" title="Cancel" onPress={onDismiss} />
            <Button size="default" title="Confirm" onPress={handleConfirmAlternative} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
