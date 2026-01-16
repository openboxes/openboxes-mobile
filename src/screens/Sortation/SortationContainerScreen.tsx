import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { Divider, Paragraph, Subheading, Switch } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import Button from '../../components/Button';
import EmptyView from '../../components/EmptyView';
import { ScannerInput } from '../../components/ScannerInput';
import { EMPTY_STRING } from '../../constants';
import { navigate } from '../../NavigationService';
import { patchPutawayTaskAction } from '../../redux/actions/putaways';
import { DetailChip, SortationProduct, SortationTask } from '../../types/sortation';
import Theme from '../../utils/Theme';
import SortationProductDetails from './SortationProductDetails';
import styles from './styles';

type ContainerRouteProp = RouteProp<
  { SortationQuantity: { product: SortationProduct; quantitySorted: number; task: SortationTask } },
  'SortationQuantity'
>;

export default function SortationContainerScreen() {
  const { params } = useRoute<ContainerRouteProp>();
  const { product, quantitySorted, task } = params;

  const [isOverrideEnabled, setIsOverrideEnabled] = useState<boolean>(false);
  const [putawayContainerBarcode, setPutawayContainerBarcode] = useState<string>('');
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
    if (!isOverrideEnabled) {
      const containerLocationNumber = task?.container?.locationNumber;
      if (code !== containerLocationNumber) {
        Alert.alert(
          'Wrong container number',
          `Scanned container number: ${code} is different from the expected one: ${containerLocationNumber}. If you want to load into a different container please select 'Override container' option.`,
          [{ text: 'OK', onPress: () => setPutawayContainerBarcode(EMPTY_STRING) }]
        );
        return;
      }
    }

    const payload = {
      action: 'load',
      quantity: quantitySorted,
      container: code,
      override: isOverrideEnabled
    };

    dispatch(
      patchPutawayTaskAction(task.facility.id, task.id, payload, (response) => {
        if (response && !response.error) {
          Alert.alert('Sortation Successful', 'The product has been sorted successfully.');
          navigate('Sortation');
        } else {
          Alert.alert('Sortation Failed', response.errorMessage || 'Sortation Failed');
          setPutawayContainerBarcode(EMPTY_STRING);
        }
      })
    );
  }

  const productDetailsChips: DetailChip[] = [
    {
      icon: 'package',
      label: 'Quantity Sorted',
      value: quantitySorted
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
    <ScrollView keyboardShouldPersistTaps="always" style={styles.contentContainer}>
      <SortationProductDetails product={product} detailsChips={productDetailsChips} task={task} />

      <Divider />

      <View style={styles.formContainer}>
        <Subheading style={styles.subheading}>Scan Putaway Container ID</Subheading>
        <Paragraph style={styles.paragraph}>
          Scan the barcode of the putaway container where you want to place this product.
        </Paragraph>

        <ScannerInput
          style={styles.topSpace}
          label="Container Barcode"
          value={putawayContainerBarcode}
          onChange={setPutawayContainerBarcode}
          onSubmit={handleProcessing}
        />

        <View style={[styles.cardAnnotation, styles.cardContainer]}>
          <Paragraph style={[styles.paragraph, styles.bold]}>Override container</Paragraph>
          <Switch value={isOverrideEnabled} color={Theme.colors.primary} onValueChange={setIsOverrideEnabled} />
        </View>

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
    </ScrollView>
  );
}
