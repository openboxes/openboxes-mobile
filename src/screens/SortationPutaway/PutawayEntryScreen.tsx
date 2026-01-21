import React, { useCallback, useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { Paragraph, Title } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import { ScannerInput } from '../../components/ScannerInput';
import { EMPTY_STRING } from '../../constants';
import { navigate } from '../../NavigationService';
import { getPutawayDetailsByContainerId } from '../../redux/actions/putaways';
import { SortationTask } from '../../types/sortation';
import styles from './styles';

export default function PutawayEntryScreen() {
  const [putawayContainerId, setPutawayContainerId] = useState<string>(EMPTY_STRING);
  const dispatch = useDispatch();

  const performScan = useCallback(
    (containerId: string) => {
      dispatch(
        getPutawayDetailsByContainerId(containerId, (response) => {
          if (response && !response.error) {
            const allTasks: SortationTask[] = response?.response?.data || [];
            const filteredTasks = allTasks.filter((task) => task.status === 'IN_PROGRESS' || task.status === 'PENDING');

            if (filteredTasks.length > 0) {
              navigate('SortationPutawayLocationScan', {
                taskList: filteredTasks,
                currentTaskIndex: 0
              });
            } else {
              Alert.alert('No Valid Tasks Found', `No IN_PROGRESS tasks found for container ${containerId}`);
            }
          } else {
            Alert.alert('Error', `Error while fetching putaway tasks: ${response?.errorMessage}`);
          }

          setPutawayContainerId(EMPTY_STRING);
        })
      );
    },
    [dispatch]
  );

  return (
    <ScrollView keyboardShouldPersistTaps="always" style={styles.screen}>
      <Title>Scan Putaway Container ID</Title>
      <Paragraph>Point your barcode scanner at the container ID or type the code manually.</Paragraph>

      <ScannerInput
        style={styles.topSpace}
        label="Putaway Container ID"
        value={putawayContainerId}
        onChange={setPutawayContainerId}
        onSubmit={performScan}
      />
    </ScrollView>
  );
}
