import React, { useCallback, useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';

import { Button, Divider, TextInput as PaperTextInput, Paragraph, Subheading } from 'react-native-paper';
import { EMPTY_STRING } from '../../constants';
import { useInputFocus } from '../../hooks/useInputFocus';
import { navigate } from '../../NavigationService';
import CycleCountDetails from './CycleCountDetails';
import { MOCKED_CYCLE_COUNT } from './mocked-data';
import styles from './styles';

export default function CycleCountQuantityAvailable() {
  const [quantityAvailable, setQuantityAvailable] = useState<string>(EMPTY_STRING);
  // const dispatch = useDispatch();
  const inputRef = React.useRef<TextInput | null>(null);

  useInputFocus(inputRef);

  // TODO: Replace with a proper validation and submission logic
  const handleSubmit = useCallback(() => {
    navigate('CycleCountCountConfirmation');
  }, []);

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      style={styles.contentWrapper}
      contentContainerStyle={styles.contentContainer}
    >
      <CycleCountDetails cycleCountDetails={MOCKED_CYCLE_COUNT} />

      <Divider />

      <View style={styles.formContainer}>
        <Subheading style={styles.subheading}>Enter Quantity Available</Subheading>
        <Paragraph style={styles.paragraph}>
          Please enter the available quantity in location for the scanned product.
        </Paragraph>

        <PaperTextInput
          style={styles.topSpace}
          autoCompleteType="off"
          ref={inputRef}
          mode="outlined"
          label="Quantity Available"
          value={quantityAvailable}
          keyboardType="numeric"
          returnKeyType="done"
          onChangeText={setQuantityAvailable}
        />

        <Button mode="contained" style={styles.topSpace} onPress={handleSubmit}>
          Confirm Quantity
        </Button>
      </View>
    </ScrollView>
  );
}
