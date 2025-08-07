import { RouteProp, useIsFocused, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, TextInput, View } from 'react-native';

import { Divider, TextInput as PaperTextInput, Paragraph, Subheading } from 'react-native-paper';
import Button from '../../components/Button';
import EmptyView from '../../components/EmptyView';
import Product from '../../data/product/Product';
import { navigate } from '../../NavigationService';
import SortationProductDetails, { DetailChip } from './SortationProductDetails';
import styles from './styles';

// TODO: The Product type will be changed to some `SortationProduct` type in the future.
type ContainerRouteProp = RouteProp<
  { SortationQuantity: { product: Product; quantitySorted: number } },
  'SortationQuantity'
>;

export default function SortationContainerScreen() {
  const { params } = useRoute<ContainerRouteProp>();
  const { product, quantitySorted } = params;

  const inputRef = useRef<TextInput | null>(null);
  const isFocused = useIsFocused();
  const [putawayContainerBarcode, setPutawayContainerBarcode] = useState<string>('');

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

    /**
     * TO DO: Handle the submission and validation of sortation container.
     * - Validate the putaway container exists in the system.
     * - Validate that the product can be sorted into this container (zone).
     * - Call the API here to finalize the sortation process.
     */
    // eslint-disable-next-line no-restricted-syntax
    console.log(
      'Submitting sortation for product:',
      product,
      'with quantity:',
      quantitySorted,
      'to container:',
      putawayContainerBarcode
    );

    // TODO: If the Putaway Container ID scanned has Product for a different zone,
    // the user will get a warning and will need to decide HOW to proceed (Yes / No option).

    // For now, if successful, navigate back to Sortation screen.
    Alert.alert('Sortation Successful', 'The product has been sorted successfully.');
    navigate('Sortation');
  }

  const productDetailsChips: DetailChip[] = [
    {
      icon: 'package',
      label: 'Quantity Sorted',
      // Mocked value for demonstration purposes
      value: quantitySorted
    },
    {
      icon: 'map-search',
      label: 'Putaway Zone',
      // Mocked value for demonstration purposes
      value: product?.putawayZone
    },
    {
      icon: 'map-marker',
      label: 'Final Storage Location',
      // Mocked value for demonstration purposes
      value: product?.finalStorageLocation
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
          label="Location Barcode"
          value={putawayContainerBarcode}
          returnKeyType="done"
          onChangeText={setPutawayContainerBarcode}
          onSubmitEditing={handleSubmit}
        />

        <Button style={styles.topSpace} title="Confirm" mode="contained" size="100%" onPress={handleSubmit}>
          Submit
        </Button>
      </View>
    </View>
  );
}
