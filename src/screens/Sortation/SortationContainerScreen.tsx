import { RouteProp, useIsFocused, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, TextInput, View } from 'react-native';
import { Divider, TextInput as PaperTextInput, Paragraph, Subheading, Switch } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import Button from '../../components/Button';
import EmptyView from '../../components/EmptyView';
import { navigate } from '../../NavigationService';
import { patchPutawayTaskAction } from '../../redux/actions/putaways';
import { DetailChip, SortationProduct, SortationTask } from '../../types/sortation';
import SortationProductDetails from './SortationProductDetails';
import styles from './styles';
import Theme from '../../utils/Theme';

type ContainerRouteProp = RouteProp<
  { SortationQuantity: { product: SortationProduct; quantitySorted: number; task: SortationTask } },
  'SortationQuantity'
>;

export default function SortationContainerScreen() {
  const { params } = useRoute<ContainerRouteProp>();
  const { product, quantitySorted, task } = params;

  const inputRef = useRef<TextInput | null>(null);
  const isFocused = useIsFocused();
  const [isOverrideEnabled, setIsOverrideEnabled] = useState<boolean>(false);
  const [putawayContainerBarcode, setPutawayContainerBarcode] = useState<string>('');
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    const t = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(t);
  }, [isFocused]);

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

  function handleSubmit() {
    if (!putawayContainerBarcode) {
      Alert.alert('Empty Barcode', 'You must scan a putaway container barcode to proceed.');
      return;
    }

    if (!isOverrideEnabled) {
      const containerLocationNumber = task?.container?.locationNumber;
      if (putawayContainerBarcode !== containerLocationNumber) {
        Alert.alert(
          'Wrong container number',
          `Scanned container number: ${putawayContainerBarcode} is different from the expected one: ${containerLocationNumber}. If you want to load into different container please select 'Override container' option.`
        );
        return;
      }
    }

    const payload = {
      action: 'load',
      container: putawayContainerBarcode,
      override: isOverrideEnabled
    };

    dispatch(
      patchPutawayTaskAction(task.facility.id, task.id, payload, (response) => {
        if (response && !response.error) {
          Alert.alert('Sortation Successful', 'The product has been sorted successfully.');
          navigate('Sortation');
        } else {
          Alert.alert('Sortation Failed', response.errorMessage || 'Sortation Failed');
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
    <View style={styles.contentContainer}>
      <SortationProductDetails product={product} detailsChips={productDetailsChips} />

      <Divider />

      <View style={styles.formContainer}>
        <Subheading style={styles.subheading}>Scan Putaway Container ID</Subheading>
        <Paragraph style={styles.paragraph}>
          Scan the barcode of the putaway container where you want to place this product.
        </Paragraph>

        <PaperTextInput
          ref={inputRef}
          autoCompleteType="off"
          style={styles.topSpace}
          mode="outlined"
          label="Container Barcode"
          value={putawayContainerBarcode}
          returnKeyType="done"
          onChangeText={setPutawayContainerBarcode}
          onSubmitEditing={handleSubmit}
        />

        <View style={[styles.cardAnnotation, styles.cardContainer]}>
          <Paragraph style={[styles.paragraph, styles.bold]}>Override container</Paragraph>
          <Switch 
            value={isOverrideEnabled} 
            onValueChange={setIsOverrideEnabled}
            color={Theme.colors.primary}
          />
        </View>

        <Button style={styles.topSpace} title="Confirm" mode="contained" size="100%" onPress={handleSubmit}>
          Submit
        </Button>
      </View>
    </View>
  );
}
