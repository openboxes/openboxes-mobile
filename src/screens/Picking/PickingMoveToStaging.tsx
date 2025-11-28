import * as React from 'react';
import { Alert, TextInput, View } from 'react-native';
import { TextInput as PaperTextInput, Paragraph, Title } from 'react-native-paper';

import { useIsFocused } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { INPUT_FOCUS_DELAY_TIME_IN_MS } from '../../constants';
import { getPickedTasksByContainerAction } from '../../redux/actions/picking';
import styles from './styles';
import { navigate } from '../../NavigationService';

export default function PickingMoveToStagingScreen() {
  const [outboundContainerId, setOutboundContainerId] = React.useState<string>('');
  const inputRef = React.useRef<TextInput | null>(null);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!isFocused) {
      return;
    }
    const t = setTimeout(() => inputRef.current?.focus(), INPUT_FOCUS_DELAY_TIME_IN_MS);
    return () => clearTimeout(t);
  }, [isFocused]);

  function handleSubmit() {
    if (!outboundContainerId) {
      Alert.alert('Scan Required', 'Please scan the outbound container ID before proceeding.');
      return;
    }

    // Fetch pick tasks
    dispatch(
      getPickedTasksByContainerAction(outboundContainerId, ({ response }) => {
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
  }

  return (
    <View style={styles.wrapperWithPadding}>
      <Title>Scan The Container</Title>
      <Paragraph>Please scan the barcode of the outbound container you want to move to staging.</Paragraph>

      <PaperTextInput
        ref={inputRef}
        autoCompleteType="off"
        mode="outlined"
        style={styles.marginTopSmall}
        label="Outbound Container ID"
        value={outboundContainerId}
        returnKeyType="done"
        onChangeText={setOutboundContainerId}
        onSubmitEditing={handleSubmit}
      />
    </View>
  );
}
