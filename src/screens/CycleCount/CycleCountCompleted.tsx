import React, { useCallback } from 'react';
import { ScrollView, View } from 'react-native';

import { Button, Chip, Paragraph, Subheading, Text } from 'react-native-paper';
import { navigate } from '../../NavigationService';
import { MOCKED_CYCLE_COUNT } from './mocked-data';
import styles from './styles';

export default function CycleCountCompleted() {
  const handleSubmit = useCallback(() => {
    navigate('CycleCountListEntry');
  }, []);

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      style={styles.contentWrapper}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.formContainer}>
        <Subheading style={styles.subheading}>Cycle Count Completed</Subheading>
        <Paragraph style={styles.paragraph}>
          The cycle count has been successfully completed and recorded in the system.
        </Paragraph>

        <Chip
          mode="outlined"
          icon="identifier"
          style={[styles.chipDefault, styles.topSpace]}
          textStyle={styles.chipText}
        >
          Cycle Count List Id: <Text style={[styles.chipText, styles.bold]}>{MOCKED_CYCLE_COUNT.id} </Text>
        </Chip>

        <Button mode="contained" style={styles.topSpace} onPress={handleSubmit}>
          Confirm
        </Button>
      </View>
    </ScrollView>
  );
}
