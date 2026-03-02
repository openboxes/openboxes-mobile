import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { Divider } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import Button from '../../components/Button';
import EmptyView from '../../components/EmptyView';
import { ContainerIcon, LocationIcon, QuantityIcon } from '../../components/Icons';
import { ScannerInput } from '../../components/ScannerInput';
import { EMPTY_FALLBACK, EMPTY_STRING } from '../../constants';
import { navigate } from '../../NavigationService';
import { patchPutawayTaskAction } from '../../redux/actions/putaways';
import { DetailChip, SortationProduct, SortationTask } from '../../types/sortation';
import { ContainerMismatchDialog } from './ContainerMismatchDialog';
import SortationProductDetails from './SortationProductDetails';
import styles from './styles';

type ContainerRouteProp = RouteProp<
  { SortationQuantity: { product: SortationProduct; quantitySorted: number; task: SortationTask } },
  'SortationQuantity'
>;

export default function SortationContainerScreen() {
  const { params } = useRoute<ContainerRouteProp>();
  const { product, quantitySorted, task } = params;

  const [putawayContainerBarcode, setPutawayContainerBarcode] = useState<string>('');
  const [isDialogVisible, setIsDialogVisible] = useState<boolean>(false);
  const [pendingContainerCode, setPendingContainerCode] = useState<string>('');
  const dispatch = useDispatch();

  if (!product) {
    return (
      <View style={styles.emptyContainer}>
        <EmptyView
          isRefresh
          title="Product Not Found"
          description="The product you are looking for does not exist or is not available."
          onPress={() => navigate('Sortation')}
        />
      </View>
    );
  }

  if (!quantitySorted || quantitySorted <= 0) {
    return (
      <View style={styles.emptyContainer}>
        <EmptyView
          isRefresh
          title="Invalid Quantity"
          description="Please enter a valid quantity greater than zero."
          onPress={() => navigate('SortationQuantity', { product })}
        />
      </View>
    );
  }

  /**
   * Unified logic to handle both Scanner "Enter" and "Confirm" button press.
   * @param code - The barcode string to validate.
   */
  function handleProcessing(code: string) {
    if (!code || code.trim() === '') {
      Alert.alert('Scan Required', 'Please scan the container barcode.');
      return;
    }

    const expectedContainer = task?.container?.locationNumber;

    if (code !== expectedContainer) {
      setPendingContainerCode(code);
      setIsDialogVisible(true);
      return;
    }

    confirmContainer(code, false);
  }

  function handleDialogScan(resolvedCode: string) {
    setIsDialogVisible(false);
    confirmContainer(resolvedCode, true);
    setPutawayContainerBarcode(EMPTY_STRING);
    setPendingContainerCode('');
  }

  function confirmContainer(code: string, override: boolean) {
    const payload = {
      action: 'load',
      quantity: quantitySorted,
      container: code,
      override
    };

    dispatch(
      patchPutawayTaskAction(task.facility.id, task.id, payload, (response) => {
        if (response && !response.error) {
          navigate('Sortation', {
            sortedProduct: {
              name: product.name,
              productCode: product.productCode
            }
          });
        } else {
          Alert.alert('Sortation Failed', response.errorMessage || 'An error occurred while sorting the product.');
          setPutawayContainerBarcode(EMPTY_STRING);
        }
      })
    );
  }

  const productDetailsChips: DetailChip[] = [
    {
      icon: () => <QuantityIcon size={16} color="#000" />,
      label: 'Quantity',
      value: quantitySorted
    },
    {
      icon: () => <ContainerIcon size={16} color="#000" />,
      label: 'Container',
      value: task?.container?.locationNumber,
      isActive: true
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
    <ScrollView keyboardShouldPersistTaps="always" style={styles.contentContainer}>
      <SortationProductDetails product={product} detailsChips={productDetailsChips} task={task} />

      <Divider />

      <View style={styles.formContainer}>
        <ScannerInput
          leftIcon={<ContainerIcon size={24} />}
          placeholder={task?.container?.locationNumber ?? EMPTY_FALLBACK}
          label="Container"
          value={putawayContainerBarcode}
          onChange={setPutawayContainerBarcode}
          onSubmit={handleProcessing}
        />

        <Button
          style={styles.topSpace}
          title="Confirm"
          mode="contained"
          size="100%"
          onPress={() => handleProcessing(putawayContainerBarcode)}
        >
          Submit
        </Button>
      </View>

      <ContainerMismatchDialog
        visible={isDialogVisible}
        scannedContainer={pendingContainerCode}
        expectedContainer={task?.container?.locationNumber ?? ''}
        onDismiss={() => setIsDialogVisible(false)}
        onScan={handleDialogScan}
      />
    </ScrollView>
  );
}
