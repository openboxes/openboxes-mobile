import { RouteProp, useIsFocused, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, TextInput, View } from 'react-native';
import { Divider, TextInput as PaperTextInput, Paragraph, Subheading } from 'react-native-paper';

import Button from '../../components/Button';
import EmptyView from '../../components/EmptyView';
import { EMPTY_STRING, INPUT_FOCUS_DELAY_TIME_IN_MS } from '../../constants';
import { navigate } from '../../NavigationService';
import { SortationLocation, SortationPutawayScreenType } from '../../types/sortation';
import AlternativeLocationSelector from './AlternativeLocationSelector';
import PutawayDetails from './PutawayDetails';
import { SkipButton } from './SkipButton';
import styles from './styles';

type PutawayLocationScanRouteProp = RouteProp<
  {
    SortationPutawayLocationScan: SortationPutawayScreenType;
  },
  'SortationPutawayLocationScan'
>;

export default function PutawayLocationScanScreen() {
  const { params } = useRoute<PutawayLocationScanRouteProp>();
  const { taskList, currentTaskIndex, isDirectPutaway } = params;
  const putawayDetails = taskList[currentTaskIndex];
  const inputRef = useRef<TextInput | null>(null);
  const isFocused = useIsFocused();
  const [putawayLocationBarcode, setPutawayLocationBarcode] = useState<string | undefined>();
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [selectedAlternativeDestination, setSelectedAlternativeDestination] = useState<SortationLocation | null>(
    putawayDetails.destination
  );

  useEffect(() => {
    setSelectedAlternativeDestination(putawayDetails.destination);
  }, [putawayDetails]);

  useEffect(() => {
    if (!isFocused) {
      return;
    }

    setPutawayLocationBarcode(EMPTY_STRING);

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

  function handleChange(barcode: string) {
    setPutawayLocationBarcode(barcode);
  }

  function handleSubmit() {
    if (!putawayLocationBarcode) {
      Alert.alert('Invalid Location Barcode', 'Please enter a valid putaway location barcode.');
      return;
    }

    const locationNumber = selectedAlternativeDestination?.locationNumber;
    if (putawayLocationBarcode !== locationNumber) {
      Alert.alert(
        'Invalid Location Barcode',
        `The scanned barcode does not match the expected putaway location: ${locationNumber}.`
      );
      setPutawayLocationBarcode(EMPTY_STRING);
      return;
    }

    const updatedTaskList = [...taskList];
    updatedTaskList[currentTaskIndex] = {
      ...putawayDetails,
      destination: selectedAlternativeDestination ?? putawayDetails.destination
    };
    navigate('SortationPutawayProductScan', {
      taskList: updatedTaskList,
      currentTaskIndex,
      isDirectPutaway
    });
  }

  const updatedPutawayDetails = {
    ...putawayDetails,
    destination: selectedAlternativeDestination ?? putawayDetails.destination
  };

  return (
    <>
      <ScrollView keyboardShouldPersistTaps="handled" style={styles.contentContainer}>
        <PutawayDetails putawayDetails={updatedPutawayDetails} />

        <Divider />

        <View style={styles.formContainer}>
          <Subheading style={styles.subheading}>Scan Putaway Location Barcode</Subheading>

          <PaperTextInput
            ref={inputRef}
            autoCompleteType="off"
            style={styles.topSpace}
            mode="outlined"
            label="Putaway Location Entry Field"
            keyboardType="number-pad"
            value={putawayLocationBarcode}
            returnKeyType="done"
            onChangeText={handleChange}
            onSubmitEditing={handleSubmit}
          />

          <View style={styles.topSpace}>
            <View style={[styles.headerRow, styles.bottomSpace]}>
              <Paragraph style={styles.subheading}>Alternative Location?</Paragraph>
              <Button size="50%" title="Request" onPress={() => setIsDialogVisible(true)} />
            </View>
          </View>

          <Button style={styles.topSpace} title="Confirm" mode="contained" size="100%" onPress={handleSubmit}>
            Submit
          </Button>
          <SkipButton taskList={taskList} currentTaskIndex={currentTaskIndex} isDirectPutaway={isDirectPutaway} />
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
    </>
  );
}
