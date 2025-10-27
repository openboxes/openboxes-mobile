import { debounce } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Modal, View } from 'react-native';
import { Paragraph, Subheading, TextInput } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import { appConfig } from '../../constants';
import { getAlternativeDestinationsAction, searchLocationByLocationNumber } from '../../redux/actions/locations';
import styles from './styles';
import { PutawayDetailsModel, SortationLocation } from '../../types/sortation';
import Button from '../../components/Button';

type Props = {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: (location: SortationLocation) => void;
  putawayDetails: PutawayDetailsModel;
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

  useEffect(() => {
    if (visible) {
      setTempAlternativeLocation(initialLocation);
      setScannedLocationInput('');
      setSuggestionIndex(0);
    }
  }, [visible, initialLocation]);

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

  const performLocationSearch = useCallback(
    (locationNumber: string) => {
      const trimmed = locationNumber.trim();
      if (!trimmed) {
        setTempAlternativeLocation(null);
        return;
      }
      dispatch(
        searchLocationByLocationNumber(trimmed, (data: any) => {
          if (data && !data.error) {
            setTempAlternativeLocation(data);
          } else {
            setTempAlternativeLocation(null);
          }
        })
      );
    },
    [dispatch]
  );

  const debouncedLocationSearch = useMemo(
    () => debounce(performLocationSearch, appConfig.DEFAULT_DEBOUNCE_TIME),
    [performLocationSearch]
  );

  useEffect(() => {
    return () => {
      debouncedLocationSearch.cancel();
    };
  }, [debouncedLocationSearch]);

  const handleSuggestLocation = () => {
    if (alternativeLocations.length === 0) {
      return;
    }
    const suggested = alternativeLocations[suggestionIndex];
    setTempAlternativeLocation(suggested);
    setScannedLocationInput('');
    const nextIndex = (suggestionIndex + 1) % alternativeLocations.length;
    setSuggestionIndex(nextIndex);
  };

  const handleScanLocation = (text: string) => {
    setScannedLocationInput(text);
    debouncedLocationSearch(text);
  };

  const handleConfirmAlternative = () => {
    if (tempAlternativeLocation) {
      onConfirm(tempAlternativeLocation);
    }
    onDismiss();
  };

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

          <TextInput
            autoCompleteType="off"
            label="Scan location number"
            value={scannedLocationInput}
            mode="outlined"
            onChangeText={handleScanLocation}
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
