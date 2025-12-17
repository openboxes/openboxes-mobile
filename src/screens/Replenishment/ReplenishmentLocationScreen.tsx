/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Divider, TextInput as PaperTextInput, Paragraph, Subheading } from 'react-native-paper';

import { Alert, TextInput, View } from 'react-native';
import { ProductDetails } from '../../components/ProductDetails';
import { HYPHEN } from '../../constants';
import { useInputFocus } from '../../hooks/useInputFocus';
import { navigate } from '../../NavigationService';
import { DUMMY_REPLENISHMENT } from './mock-data';
import { useReplenishmentContext } from './ReplenishmentContext';
import styles from './styles';

export function ReplenishmentLocationScreen() {
  const { currentTask, currentTaskIndex, tasksCount, startReplenishment } = useReplenishmentContext();

  const inputRef = React.useRef<TextInput | null>(null);
  const [locationBarcode, setLocationBarcode] = React.useState<string>('');

  // Focus input when screen is focused
  useInputFocus(inputRef);

  if (!currentTask) {
    Alert.alert('No Replenishment Task', 'There is no current replenishment task available. Try again later.', [
      {
        text: 'OK',
        onPress: () => {
          navigate('Dashboard');
        }
      }
    ]);
    return null;
  }

  function handleSubmit() {
    const isValid = locationBarcode === currentTask?.location?.locationNumber;

    if (!isValid) {
      Alert.alert(
        'Invalid Barcode',
        `Incorrect location scanned. Expected: ${currentTask?.location?.locationNumber}. Try again.`
      );
      setLocationBarcode('');
      return;
    }

    // startReplenishment((response) => {
    //   if ('errorMessage' in response) {
    //     Alert.alert('Error', response.errorMessage);
    //     setLocationBarcode('');
    //     return;
    //   }

    //   navigate('ReplenishmentProduct');
    // });

    navigate('ReplenishmentProduct');
  }

  return (
    // @ts-ignore
    <ProductDetails.Provider product={DUMMY_REPLENISHMENT.product}>
      <ProductDetails.Root>
        <ProductDetails.Header>
          <ProductDetails.Badge icon="barcode" label="Product Code">
            {DUMMY_REPLENISHMENT.product.productCode}
          </ProductDetails.Badge>
          <ProductDetails.Badge icon="navigation" label="Task">
            {`${currentTaskIndex + 1} / ${tasksCount}`}
          </ProductDetails.Badge>
        </ProductDetails.Header>

        <ProductDetails.Separator />
        <ProductDetails.Title />

        <ProductDetails.List
          items={[
            {
              icon: 'package',
              label: 'Quantity Picked',
              value: `${currentTask.quantityPicked || 0} / ${currentTask.quantityRequired}`
            },
            { icon: 'pin', label: 'Pick Location', value: currentTask.location?.name || HYPHEN }
          ]}
        />
      </ProductDetails.Root>

      <Divider />

      <View style={styles.wrapperWithPadding}>
        <Subheading style={styles.subheading}>Scan Pick Location Barcode</Subheading>
        <Paragraph style={styles.paragraph}>
          Point your barcode scanner at the pick location barcode or type the code manually.
        </Paragraph>

        <PaperTextInput
          style={styles.marginTop}
          autoCompleteType="off"
          ref={inputRef}
          mode="outlined"
          label="Pick Location Barcode"
          value={locationBarcode}
          returnKeyType="done"
          onChangeText={setLocationBarcode}
          onSubmitEditing={handleSubmit}
        />
      </View>
    </ProductDetails.Provider>
  );
}
