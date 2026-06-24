import { RouteProp, useIsFocused, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { Divider } from 'react-native-paper';

import { useDispatch } from 'react-redux';
import Button from '../../components/Button';
import EmptyView from '../../components/EmptyView';
import { ContainerIcon, LocationIcon, QuantityIcon } from '../../components/Icons';
import { ScannerInput } from '../../components/ScannerInput';
import { EMPTY_FALLBACK } from '../../constants';
import { navigate } from '../../NavigationService';
import { patchPutawayTaskAction } from '../../redux/actions/putaways';
import { DetailChip, SortationProduct, SortationTask } from '../../types/sortation';
import SortationProductDetails from './SortationProductDetails';
import styles from './styles';

const startedTaskIds = new Set<string>();

type QuantityRouteProp = RouteProp<
  { SortationQuantity: { product: SortationProduct; task: SortationTask } },
  'SortationQuantity'
>;

export default function SortationQuantityScreen() {
  const { params } = useRoute<QuantityRouteProp>();
  const { product, task } = params;

  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const [quantitySorted, setQuantitySorted] = useState<number | undefined>();
  const [directPutawayRequired, setDirectPutawayRequired] = useState<boolean>(false);

  useEffect(() => {
    if (directPutawayRequired) {
      navigate('SortationPutawayLocationScan', {
        currentTaskIndex: 0,
        isDirectPutaway: true,
        isUserDirected: true,
        task,
        requiresValidationScan: false
      });
    }
  }, [directPutawayRequired, product, task]);

  useEffect(() => {
    if (!isFocused) {
      return;
    }

    setQuantitySorted(undefined);
  }, [isFocused]);

  useEffect(() => {
    if (isFocused) {
      setDirectPutawayRequired(false);
    }
  }, [isFocused]);

  useEffect(() => {
    if (task && task.status === 'PENDING' && !startedTaskIds.has(task.id)) {
      const payload = {
        action: 'start'
      };

      dispatch(
        patchPutawayTaskAction(task.facility.id, task.id, payload, (response) => {
          if (response && !response.error) {
            startedTaskIds.add(task.id);
          } else {
            Alert.alert('Error', response?.errorMessage || 'An error occurred while starting the task.');
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
      icon: () => <QuantityIcon size={16} color="#000" />,
      label: 'Quantity Required',
      value: task?.quantity,
      isActive: true
    },
    {
      icon: () => <ContainerIcon size={16} color="#000" />,
      label: 'Container',
      value: task?.container?.locationNumber
    },
    {
      icon: () => <LocationIcon size={16} color="#000" />,
      label: 'Storage Location',
      value:
        task?.destination?.zoneName && task?.destination?.name
          ? `${task.destination.zoneName} \u2022 ${task.destination.name}`
          : task?.destination?.zoneName || task?.destination?.name
    }
  ];

  return (
    <ScrollView keyboardShouldPersistTaps="handled" style={styles.contentContainer}>
      <SortationProductDetails
        showDirectPutawayRequired
        product={product}
        detailsChips={productDetailsChips}
        directPutawayRequired={directPutawayRequired}
        task={task}
        onToggleDirectPutaway={setDirectPutawayRequired}
      />

      <Divider />

      <View style={styles.formContainer}>
        <ScannerInput
          showKeyboardOnMount
          autoSubmitTimeout={0}
          leftIcon={<QuantityIcon size={24} />}
          placeholder={task?.quantity?.toString() ?? EMPTY_FALLBACK}
          keyboardType="number-pad"
          label="Quantity"
          value={quantitySorted?.toString() ?? ''}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />

        <Button style={styles.topSpace} title="Confirm" mode="contained" size="100%" onPress={handleSubmit}>
          Submit
        </Button>
      </View>
    </ScrollView>
  );
}
