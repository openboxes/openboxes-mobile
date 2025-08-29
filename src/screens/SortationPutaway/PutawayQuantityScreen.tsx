import { RouteProp, useIsFocused, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, TextInput, View } from 'react-native';
import { Divider, TextInput as PaperTextInput, Paragraph, Subheading } from 'react-native-paper';

import { useDispatch } from 'react-redux';
import Button from '../../components/Button';
import EmptyView from '../../components/EmptyView';
import PutawayDetails from './PutawayDetails';
import styles from './styles';

type PutawayQuantityRouteProp = RouteProp<
  // TODO [Putaway]: Create a proper type for putawayDetails
  { SortationPutawayQuantity: { putawayDetails: any } },
  'SortationPutawayQuantity'
>;

export default function PutawayQuantityScreen() {
  const { params } = useRoute<PutawayQuantityRouteProp>();
  const { putawayDetails } = params;
  const dispatch = useDispatch();

  const inputRef = useRef<TextInput | null>(null);
  const isFocused = useIsFocused();

  const [putawayQuantity, setPutawayQuantity] = useState<number | undefined>();

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    const t = setTimeout(() => inputRef.current?.focus(), 100);
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

  function handleChange(text: string) {
    // Strip non-numeric characters and convert to number
    const digitsOnly = text.replace(/[^0-9]/g, '');
    const num = digitsOnly.length > 0 ? parseInt(digitsOnly, 10) : undefined;
    setPutawayQuantity(num);
  }

  function handleMainConfirm() {
    if (!putawayQuantity) {
      Alert.alert('Invalid Putaway Quantity', 'Please enter a valid putaway quantity.');
      return;
    }

    if (putawayQuantity < 1 || putawayQuantity > putawayDetails.quantity) {
      Alert.alert(
        'Invalid Putaway Quantity',
        `Please enter a valid putaway quantity between 1 and ${putawayDetails.quantity}.`
      );
      return;
    }

    if (putawayQuantity !== putawayDetails.quantity) {
      Alert.alert(
        'Confirm Partial Putaway',
        `Entered quantity (${putawayQuantity}) does not match expected quantity (${putawayDetails.quantity}). If you want to proceed with the partial putaway, please use the "Partial Putaway" confirmation.`
      );
      return;
    }

    const mockedPutawayAction = (quantity: number, callback: (response: any) => void) => {
      // Simulate an API call
      setTimeout(() => {
        callback({ success: true });
      }, 1000);
    };

    dispatch(
      mockedPutawayAction(putawayQuantity, (response) => {
        if (response.success) {
          // Navigate to the init screen
          // navigate('SortationPutaway');
          Alert.alert('Success', 'The putaway has been completed successfully.');
        } else {
          Alert.alert('Error', 'Failed to update putaway quantity.');
        }
      })
    );
  }

  function handleAlternativeLocation() {
    // Handle alternative location logic
  }

  function handlePartialPutaway() {
    // Handle partial putaway logic
  }

  return (
    <View style={styles.contentContainer}>
      <PutawayDetails putawayDetails={putawayDetails} />

      <Divider />

      <View style={styles.formContainer}>
        <Subheading style={styles.subheading}>Enter Putaway Quantity</Subheading>

        <PaperTextInput
          ref={inputRef}
          autoCompleteType="off"
          style={styles.topSpace}
          mode="outlined"
          label="Putaway Quantity Entry Field"
          keyboardType="number-pad"
          value={putawayQuantity?.toString() || ''}
          returnKeyType="done"
          onChangeText={handleChange}
        />

        <Button style={styles.topSpace} title="Confirm" mode="contained" size="100%" onPress={handleMainConfirm}>
          Submit
        </Button>
      </View>

      <View style={styles.formContainer}>
        <View style={[styles.headerRow, styles.bottomSpace]}>
          <Paragraph style={styles.paragraph}>Alternative Location?</Paragraph>
          <Button style={styles.secondaryButton} size="50%" title="Request" onPress={handleAlternativeLocation} />
        </View>

        <View style={styles.headerRow}>
          <Paragraph style={styles.paragraph}>Partial Putaway?</Paragraph>
          <Button style={styles.secondaryButton} size="50%" title="Confirm" onPress={handlePartialPutaway} />
        </View>
      </View>
    </View>
  );
}
