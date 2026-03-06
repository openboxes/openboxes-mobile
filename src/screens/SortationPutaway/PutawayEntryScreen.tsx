import React, { useCallback, useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { Paragraph, Title } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { ScannerInput } from '../../components/ScannerInput';
import { EMPTY_STRING } from '../../constants';
import { navigate } from '../../NavigationService';
import { getPutawayDetailsByContainerId } from '../../redux/actions/putaways';
import { RootState } from '../../redux/reducers';
import styles from './styles';

export default function PutawayEntryScreen() {
  const [putawayContainerId, setPutawayContainerId] = useState<string>(EMPTY_STRING);
  const dispatch = useDispatch();
  const putawayTasks = useSelector((state: RootState) => state.putawayReducer.putawayTasks);

  const performScan = useCallback(
    (containerId: string) => {
      dispatch(
        getPutawayDetailsByContainerId(containerId, (response) => {
          if (response && !response.error) {
            if (putawayTasks.length > 0) {
              navigate('SortationPutawayMode', {
                containerId
              });
            } else {
              Alert.alert('No Valid Tasks Found', `No open tasks found for container ${containerId}`);
            }
          } else {
            Alert.alert('Error', `Error while fetching putaway tasks: ${response?.errorMessage}`);
          }

          setPutawayContainerId(EMPTY_STRING);
        })
      );
    },
    [dispatch, putawayTasks]
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
