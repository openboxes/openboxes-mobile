import React, { useCallback, useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';

import { Button, Chip, TextInput as PaperTextInput, Paragraph, Subheading, Text } from 'react-native-paper';
import { EMPTY_STRING } from '../../constants';
import { useInputFocus } from '../../hooks/useInputFocus';
import { navigate } from '../../NavigationService';
import { MOCKED_CYCLE_COUNT } from './mocked-data';
import styles from './styles';

export default function CycleCountCountConfirmation() {
  const [productsInLocationCount, setProductsInLocationCount] = useState<string>(EMPTY_STRING);
  // const dispatch = useDispatch();
  const inputRef = React.useRef<TextInput | null>(null);

  useInputFocus(inputRef);

  // TODO: Replace with a proper action to
  const handleSubmit = useCallback(() => {
    // dispatch(countQuantityAvailableSubmitted(quantityAvailable, ({ response } => {})));

    navigate('CycleCountCompleted');
  }, []);

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      style={styles.contentWrapper}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.formContainer}>
        <Subheading style={styles.subheading}>Enter Number of Products in Location</Subheading>
        <Paragraph style={styles.paragraph}>
          Please enter the number of products currently located in the specified location.
        </Paragraph>

        <Chip
          mode="outlined"
          icon="map-marker"
          style={[styles.chipDefault, styles.topSpace]}
          textStyle={styles.chipText}
        >
          Location: <Text style={[styles.chipText, styles.bold]}>{MOCKED_CYCLE_COUNT.location.locationNumber} </Text>
        </Chip>

        <PaperTextInput
          style={styles.topSpace}
          autoCompleteType="off"
          ref={inputRef}
          mode="outlined"
          label="Number of Products in Location"
          value={productsInLocationCount}
          keyboardType="numeric"
          returnKeyType="done"
          onChangeText={setProductsInLocationCount}
        />

        <Button mode="contained" style={styles.topSpace} onPress={handleSubmit}>
          Confirm Quantity
        </Button>
      </View>
    </ScrollView>
  );
}
