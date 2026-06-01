import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Modal, ScrollView, TouchableOpacity, View } from 'react-native';
import { Paragraph, RadioButton } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import Button from '../../components/Button';
import { ScannerInput } from '../../components/ScannerInput';
import { SearchButton } from '../../components/SearchButton';
import { useSearchButton } from '../../components/SearchButton/useSearchButton';
import { appConfig, EMPTY_STRING } from '../../constants';
import { getAlternativeDestinationsAction, searchLocationByLocationNumber } from '../../redux/actions/locations';
import { SortationLocation, SortationTask } from '../../types/sortation';
import Theme from '../../utils/Theme';
import styles from './styles';

const NEW_LOCATION_OPTION = '__new__';

const buildDisplayList = (
  current: SortationLocation | null | undefined,
  alternatives: SortationLocation[]
): SortationLocation[] => (current ? [current, ...alternatives.filter((loc) => loc.id !== current.id)] : alternatives);

const getLocationSubtext = (location: SortationLocation): string | null =>
  location?.locationType?.name ?? location?.locationType?.description ?? null;

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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newLocationInput, setNewLocationInput] = useState<string>(EMPTY_STRING);
  const [resolvedNewLocation, setResolvedNewLocation] = useState<SortationLocation | null>(null);

  const handleLocationSearch = useCallback(
    (locationNumber: string) => {
      const trimmed = locationNumber?.trim();
      if (!trimmed) {
        setResolvedNewLocation(null);
        return;
      }
      dispatch(
        searchLocationByLocationNumber(trimmed, (data: any) => {
          if (data && !data.error) {
            setResolvedNewLocation(data);
          } else {
            setResolvedNewLocation(null);
            Alert.alert('Location Not Found', `Location "${trimmed}" could not be found.`);
          }
        })
      );
    },
    [dispatch]
  );

  const handleSearchSelect = useCallback(
    (value: string) => {
      setNewLocationInput(value);
      handleLocationSearch(value);
    },
    [handleLocationSearch]
  );

  const { isSearchOpen, searchButtonProps } = useSearchButton({ onSelect: handleSearchSelect });

  const displayLocations = useMemo(
    () => buildDisplayList(putawayDetails.destination, alternativeLocations),
    [alternativeLocations, putawayDetails.destination]
  );

  useEffect(() => {
    if (!visible) {
      return;
    }
    setNewLocationInput(EMPTY_STRING);
    setResolvedNewLocation(null);

    const provisionalTarget = initialLocation ?? putawayDetails.destination;
    setSelectedId(provisionalTarget?.id ?? null);

    dispatch(
      getAlternativeDestinationsAction(putawayDetails.facility.id, putawayDetails.id, (data: any) => {
        if (data?.error) {
          Alert.alert('Error', 'Failed to load alternative locations.');
          return;
        }
        const items: any[] = Array.isArray(data?.data) ? data.data : [];
        const mapped: SortationLocation[] = items.map((item: any) => ({
          id: item.id,
          name: item.name,
          locationNumber: item.locationNumber,
          locationType: item.locationType,
          locationTypeCode: item.locationTypeCode,
          zoneId: item.zoneId,
          zoneName: item.zoneName,
          active: item.active
        }));
        setAlternativeLocations(mapped);

        const target = initialLocation ?? putawayDetails.destination;
        if (!target) {
          return;
        }
        const displayList = buildDisplayList(putawayDetails.destination, mapped);
        if (displayList.some((loc) => loc.id === target.id)) {
          setSelectedId(target.id);
        } else {
          setSelectedId(NEW_LOCATION_OPTION);
          setNewLocationInput(target.locationNumber);
          setResolvedNewLocation(target);
        }
      })
    );
  }, [dispatch, putawayDetails.facility.id, putawayDetails.id, putawayDetails.destination, visible, initialLocation]);

  const handleSelectListed = (locationId: string) => {
    setSelectedId(locationId);
    setNewLocationInput(EMPTY_STRING);
    setResolvedNewLocation(null);
  };

  const handleSelectNew = () => {
    setSelectedId(NEW_LOCATION_OPTION);
  };

  const handleNewLocationInputChange = (value: string) => {
    setNewLocationInput(value);
    setResolvedNewLocation(null);
  };

  const isNewLocationMode = selectedId === NEW_LOCATION_OPTION;

  const selectedLocation = isNewLocationMode
    ? resolvedNewLocation
    : displayLocations.find((loc) => loc.id === selectedId) ?? null;

  // Disable Save until the selection actually differs from the current destination.
  const isSaveEnabled = selectedLocation !== null && selectedLocation.id !== putawayDetails.destination?.id;

  const handleSave = () => {
    if (selectedLocation) {
      onConfirm(selectedLocation);
      onDismiss();
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onDismiss}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Paragraph style={styles.dialogTitle}>Override destination</Paragraph>

          <ScrollView style={styles.locationList} keyboardShouldPersistTaps="always">
            {displayLocations.map((location) => {
              const isSelected = selectedId === location.id;
              const subtext = getLocationSubtext(location);
              return (
                <TouchableOpacity
                  key={location.id}
                  style={[styles.locationRow, isSelected && styles.locationRowSelected]}
                  onPress={() => handleSelectListed(location.id)}
                >
                  <RadioButton
                    value={location.id}
                    status={isSelected ? 'checked' : 'unchecked'}
                    color={Theme.colors.primary}
                    onPress={() => handleSelectListed(location.id)}
                  />
                  <View style={styles.locationRowContent}>
                    <View>
                      <Paragraph style={styles.locationRowName}>{location.name}</Paragraph>
                      {subtext ? <Paragraph style={styles.locationRowSubtext}>{subtext}</Paragraph> : null}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              style={[
                styles.useNewLocationRow,
                styles.locationRowLast,
                isNewLocationMode && styles.locationRowSelected
              ]}
              onPress={handleSelectNew}
            >
              <RadioButton
                value={NEW_LOCATION_OPTION}
                status={isNewLocationMode ? 'checked' : 'unchecked'}
                color={Theme.colors.primary}
                onPress={handleSelectNew}
              />
              <View style={styles.locationRowContent}>
                <Paragraph style={styles.locationRowName}>Use a new location</Paragraph>
              </View>
            </TouchableOpacity>
          </ScrollView>

          {isNewLocationMode && (
            <View style={styles.destinationInputContainer}>
              <View style={styles.scannerRow}>
                <ScannerInput
                  style={styles.scannerInput}
                  label="Destination"
                  placeholder="Scan or type the new ID"
                  value={newLocationInput}
                  isEnabled={!isSearchOpen}
                  autoSubmitTimeout={appConfig.DEFAULT_SEARCH_DEBOUNCE_TIME}
                  onChange={handleNewLocationInputChange}
                  onSubmit={handleLocationSearch}
                />
                <SearchButton searchType="location" {...searchButtonProps} />
              </View>
            </View>
          )}

          <View style={styles.dialogActionsRow}>
            <Button
              icon="close-circle"
              size="default"
              variant="secondary"
              style={styles.dialogActionButton}
              title="Cancel"
              mode="contained"
              onPress={onDismiss}
            />
            <View style={styles.dialogActionSpacer} />
            <Button
              icon="check-circle"
              size="default"
              style={styles.dialogActionButton}
              title="Save"
              mode="contained"
              disabled={!isSaveEnabled}
              onPress={handleSave}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
