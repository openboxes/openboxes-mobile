import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { Divider, Paragraph, Subheading } from 'react-native-paper';
import { useSelector } from 'react-redux';

import Button from '../../components/Button';
import EmptyView from '../../components/EmptyView';
import { ScannerInput } from '../../components/ScannerInput';
import { EMPTY_STRING } from '../../constants';
import { navigate } from '../../NavigationService';
import { RootState } from '../../redux/reducers';
import { SortationLocation, SortationTask } from '../../types/sortation';
import AlternativeLocationSelector from './AlternativeLocationSelector';
import PutawayDetails from './PutawayDetails';
import { SkipButton } from './SkipButton';
import styles from './styles';

type PutawayLocationScanRouteProp = RouteProp<
  {
    SortationPutawayLocationScan: {
      currentTaskIndex: number;
      isDirectPutaway?: boolean;
      isUserDirected?: boolean;
      containerId?: string;
    };
  },
  'SortationPutawayLocationScan'
>;

export default function PutawayLocationScanScreen() {
  const { params } = useRoute<PutawayLocationScanRouteProp>();
  const { currentTaskIndex, isDirectPutaway, isUserDirected, containerId } = params;
  const putawayTasks = useSelector((state: RootState) => state.putawayReducer.putawayTasks) as SortationTask[];
  const putawayDetails = putawayTasks?.[currentTaskIndex];

  const [putawayLocationBarcode, setPutawayLocationBarcode] = useState<string>(EMPTY_STRING);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [selectedAlternativeDestination, setSelectedAlternativeDestination] = useState<SortationLocation | null>(
    putawayDetails?.destination
  );

  useEffect(() => {
    setSelectedAlternativeDestination(putawayDetails?.destination);
  }, [putawayDetails]);

  useEffect(() => {
    setPutawayLocationBarcode(EMPTY_STRING);
  }, [currentTaskIndex]);

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

  function handleProcessing(code: string) {
    const expectedLocation = selectedAlternativeDestination?.locationNumber;

    if (code !== expectedLocation) {
      Alert.alert(
        'Wrong Location',
        `The scanned barcode (${code}) does not match the expected location: ${expectedLocation}.`,
        [{ text: 'OK', onPress: () => setPutawayLocationBarcode(EMPTY_STRING) }]
      );
      return;
    }

    navigate('SortationPutawayProductScan', {
      currentTaskIndex,
      isDirectPutaway,
      isUserDirected,
      containerId
    });
  }

  const updatedPutawayDetails = {
    ...putawayDetails,
    destination: selectedAlternativeDestination ?? putawayDetails.destination
  };

  return (
    <>
      <ScrollView
        keyboardShouldPersistTaps="always"
        style={styles.contentWrapper}
        contentContainerStyle={styles.contentContainer}
      >
        <PutawayDetails
          putawayDetails={updatedPutawayDetails}
          taskIndex={currentTaskIndex}
          totalTasks={putawayTasks?.length || 0}
          showTaskCounter={!isUserDirected}
        />

        <Divider />

        <View style={styles.formContainer}>
          <Subheading style={styles.subheading}>Scan Putaway Location Barcode</Subheading>

          <ScannerInput
            style={styles.topSpace}
            label="Putaway Location Entry Field"
            value={putawayLocationBarcode}
            // Disable scanner logic if the alternative location modal is open
            isEnabled={!isDialogVisible}
            onChange={setPutawayLocationBarcode}
            onSubmit={handleProcessing}
          />

          <View style={styles.topSpace}>
            <View style={[styles.headerRow, styles.bottomSpace]}>
              <Paragraph style={styles.subheading}>Alternative Location?</Paragraph>
              <Button size="50%" title="Request" onPress={() => setIsDialogVisible(true)} />
            </View>
          </View>

          <Button
            style={styles.topSpace}
            title="Confirm"
            mode="contained"
            size="100%"
            onPress={() => handleProcessing(putawayLocationBarcode)}
          >
            Submit
          </Button>

          {isUserDirected ? (
            <Button
              style={styles.topSpace}
              title="Back To List"
              mode="text"
              size="100%"
              onPress={() => navigate('SortationPutawayTaskList', { containerId })}
            />
          ) : (
            <SkipButton
              taskList={putawayTasks}
              currentTaskIndex={currentTaskIndex}
              isDirectPutaway={isDirectPutaway}
              containerId={containerId}
            />
          )}
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
