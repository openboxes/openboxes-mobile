import * as React from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { Paragraph, Title } from 'react-native-paper';

import { useDispatch } from 'react-redux';
import { ScannerInput } from '../../components/ScannerInput';
import { SearchButton } from '../../components/SearchButton';
import { useSearchButton } from '../../components/SearchButton/useSearchButton';
import { EMPTY_STRING } from '../../constants';

import { navigate } from '../../NavigationService';
import { getPickedTasksByContainerAction } from '../../redux/actions/picking';
import styles from './styles';

export default function PickingMoveToStagingScreen() {
  const [outboundContainerId, setOutboundContainerId] = React.useState<string>(EMPTY_STRING);
  const { isSearchOpen, searchButtonProps } = useSearchButton({ onSelect: setOutboundContainerId });
  const dispatch = useDispatch();

  function handleScan(containerId: string) {
    // Fetch pick tasks
    dispatch(
      getPickedTasksByContainerAction(containerId, ({ response }) => {
        if (response.errorCode) {
          Alert.alert('Error', response.message || 'An error occurred while fetching pick tasks.');
          return;
        }

        if (!response.data || response.data.length === 0) {
          Alert.alert('No Tasks Found', 'No picked tasks found for the scanned outbound container ID.');
          return;
        }

        // Navigate to the staging screen with the fetched tasks
        navigate('PickingStagingDrop', { tasks: response.data });
      })
    );

    setOutboundContainerId(EMPTY_STRING);
  }

  return (
    <ScrollView style={styles.flex1} keyboardShouldPersistTaps="handled">
      <View style={styles.wrapperWithPadding}>
        <Title>Scan The Container</Title>
        <Paragraph>Please scan the barcode of the outbound container you want to move to staging.</Paragraph>

        <View style={styles.scannerRow}>
          <ScannerInput
            style={styles.scannerInput}
            label="Outbound Container ID"
            value={outboundContainerId}
            isEnabled={!isSearchOpen}
            onChange={setOutboundContainerId}
            onSubmit={handleScan}
          />
          <SearchButton searchType="container" {...searchButtonProps} />
        </View>
      </View>
    </ScrollView>
  );
}
