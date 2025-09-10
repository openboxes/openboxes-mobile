import { RouteProp, useIsFocused, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, TextInput, View } from 'react-native';
import { Divider, TextInput as PaperTextInput, Paragraph, Subheading } from 'react-native-paper';

import Button from '../../components/Button';
import EmptyView from '../../components/EmptyView';
import { navigate } from '../../NavigationService';
import { DetailChip, SortationProduct, SortationTask } from '../../types/sortation';
import SortationProductDetails from './SortationProductDetails';
import styles from './styles';
import { useDispatch } from 'react-redux';
import { patchPutawayTaskAction } from '../../redux/actions/putaways';

type QuantityRouteProp = RouteProp<
  { SortationQuantity: { product: SortationProduct; task: SortationTask } },
  'SortationQuantity'
>;

export default function SortationQuantityScreen() {
  const { params } = useRoute<QuantityRouteProp>();
  const { product, task } = params;

  const inputRef = useRef<TextInput | null>(null);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const [quantitySorted, setQuantitySorted] = useState<number | undefined>();
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [directPutawayRequired, setDirectPutawayRequired] = useState<boolean>(false);

  useEffect(() => {
    if (directPutawayRequired) {
      navigate('SortationPutawayLocationScan', {
        putawayDetails: {
          ...task
        }
      });
    }
  }, [directPutawayRequired, product, task]);

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    const t = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(t);
  }, [isFocused]);

  useEffect(() => {
    if (isFocused) {
      setDirectPutawayRequired(false);
    }
  }, [isFocused]);

  useEffect(() => {
    if (task && task.status === 'PENDING') {
      const payload = {
        action: 'start'
      }

      dispatch(
        patchPutawayTaskAction(task.facility.id, task.id, payload, (response) => {
          if (response && response.error) {
            Alert.alert(
              'Error',
              response?.errorMessage || 'An error occurred while starting the task.'
            );
          }
        })
      );

    }
  }, [task, dispatch]);

  if (!product) {
    return (
      <View style={styles.emptyContainer}>
        <EmptyView
          title="Product Not Found"
          description="The product you are looking for does not exist or is not available."
        />
      </View>
    );
  }

  function handleChange(text: string) {
    // Strip non-numeric characters and convert to number
    const digitsOnly = text.replace(/[^0-9]/g, '');
    const num = digitsOnly.length > 0 ? parseInt(digitsOnly, 10) : undefined;
    setQuantitySorted(num);
  }

  function handleSubmit() {
    if (!quantitySorted || quantitySorted <= 0) {
      Alert.alert('Invalid Quantity', 'Please enter a valid quantity greater than zero.');
      return;
    }

    if (quantitySorted > task.quantity) {
      Alert.alert('Invalid Quantity', 'Quantity to sort can not be greater than quantity in total');
      return;
    }

    navigate('SortationContainer', {
      product,
      quantitySorted,
      task
    });
  }

  const productDetailsChips: DetailChip[] = [
    {
      icon: 'package',
      label: 'Quantity Required',
      value: task?.quantity
    },
    {
      icon: 'map-search',
      label: 'Putaway Zone',
      value: task?.destination?.zoneName
    },
    {
      icon: 'package',
      label: 'Container',
      value: task?.container?.locationNumber
    },
    {
      icon: 'map-marker',
      label: 'Final Storage Location',
      value: task?.destination?.name
    }
  ];

  return (
    <View style={styles.contentContainer}>
      <SortationProductDetails
        showDirectPutawayRequired
        product={product}
        detailsChips={productDetailsChips}
        directPutawayRequired={directPutawayRequired}
        onToggleDirectPutaway={setDirectPutawayRequired}
      />

      <Divider />

      <View style={styles.formContainer}>
        <Subheading style={styles.subheading}>Enter Quantity for Sortation</Subheading>
        <Paragraph style={styles.paragraph}>
          Enter the quantity of this product that you want to sort. This will be used to update the inventory records.
        </Paragraph>

        <PaperTextInput
          ref={inputRef}
          autoCompleteType="off"
          style={styles.topSpace}
          mode="outlined"
          label="Sortation Quantity"
          keyboardType="number-pad"
          value={quantitySorted?.toString() ?? ''}
          returnKeyType="done"
          onChangeText={handleChange}
          onSubmitEditing={handleSubmit}
        />

        <Button style={styles.topSpace} title="Confirm" mode="contained" size="100%" onPress={handleSubmit}>
          Submit
        </Button>
      </View>
    </View>
  );
}
