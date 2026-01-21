import React, { useCallback } from 'react';
import { ScrollView } from 'react-native';
import { Paragraph, Title } from 'react-native-paper';

import { ScannerInput } from '../../components/ScannerInput';
import { EMPTY_STRING } from '../../constants';
import { navigate } from '../../NavigationService';
import styles from './styles';

export default function CycleCountListEntry() {
  const [cycleCountListId, setCycleCountListId] = React.useState<string>(EMPTY_STRING);
  // const dispatch = useDispatch();

  // TODO: Replace with a proper action to fetch cycle count list details
  const performScan = useCallback((scannedId: string) => {
    // dispatch(getCycleCountListDetailsAction(scannedId, ({ response }) => {});
    // eslint-disable-next-line no-restricted-syntax
    console.log(scannedId);

    setCycleCountListId(EMPTY_STRING);
    navigate('CycleCountLocation');
  }, []);

  return (
    <ScrollView keyboardShouldPersistTaps="always" style={styles.screen}>
      <Title>Scan Cycle Count List ID</Title>
      <Paragraph>Point your barcode scanner at the cycle count list ID or type the code manually.</Paragraph>

      <ScannerInput
        style={styles.topSpace}
        label="Cycle Count List ID"
        value={cycleCountListId}
        onChange={setCycleCountListId}
        onSubmit={performScan}
      />
    </ScrollView>
  );
}
