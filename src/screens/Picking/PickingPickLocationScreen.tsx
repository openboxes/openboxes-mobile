import * as React from 'react';
import { Alert, View } from 'react-native';
import { Button, Divider, Paragraph, Subheading } from 'react-native-paper';
import { useSelector } from 'react-redux';

import { ProductDetails } from '../../components/ProductDetails';
import { ScannerInput } from '../../components/ScannerInput';
import { EMPTY_STRING, HYPHEN } from '../../constants';
import { navigate } from '../../NavigationService';
import { RootState } from '../../redux/reducers';
import { parseFromISODateToLocaleString } from '../../utils/utils';
import { usePickingContext } from './PickingContext';
import { ReallocateModal } from './ReallocateModal';
import styles from './styles';

export default function PickingPickLocationScreen() {
  const { currentTask, currentTaskIndex, allTasksCount, startPickTask, revalidateCurrentTask, resetSession } =
    usePickingContext();
  const [pickLocationBarcode, setPickLocationBarcode] = React.useState<string>(EMPTY_STRING);
  const [isReallocateModalOpen, setIsReallocateModalOpen] = React.useState(false);
  const { allowReallocationDuringPicking } = useSelector((state: RootState) => state.settingsReducer);

  if (!currentTask) {
    return null;
  }

  function handleScan(locationBarcode: string) {
    const isValid = locationBarcode === currentTask?.location?.locationNumber;
    if (!isValid) {
      Alert.alert(
        'Invalid Barcode',
        `Incorrect location scanned. Expected: ${currentTask?.location?.locationNumber}. Try again.`,
        [{ text: 'OK', onPress: () => setPickLocationBarcode(EMPTY_STRING) }]
      );
      return;
    }

    startPickTask(({ errorMessage }) => {
      if (errorMessage) {
        Alert.alert('Error', errorMessage);
        return;
      }

      revalidateCurrentTask(() => {
        setPickLocationBarcode(EMPTY_STRING);

        navigate('PickingPickProduct');
      });
    });
  }

  return (
    <ProductDetails.Provider product={currentTask.product} status={currentTask.status}>
      <ProductDetails.Root>
        <ProductDetails.Header>
          <ProductDetails.Badge icon="barcode" label="Product Code">
            {currentTask.product.productCode}
          </ProductDetails.Badge>
          <ProductDetails.Badge icon="navigation" label="Pick Task">
            {`${currentTaskIndex + 1} / ${allTasksCount || 0}`}
          </ProductDetails.Badge>
        </ProductDetails.Header>

        <ProductDetails.Separator />
        <ProductDetails.Title />
        <ProductDetails.Caption
          title={currentTask.inventoryItem.lotNumber}
          subtitle={parseFromISODateToLocaleString(currentTask.inventoryItem.expirationDate)}
        />

        <ProductDetails.List
          items={[
            {
              icon: 'identifier',
              label: 'Order Number',
              value: currentTask.requisitionNumber || HYPHEN
            },
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

      <View style={[styles.wrapperWithPadding]}>
        <Subheading style={styles.subheading}>Scan Pick Location Barcode</Subheading>
        <Paragraph style={styles.paragraph}>
          Point your barcode scanner at the pick location barcode or type the code manually.
        </Paragraph>

        <ScannerInput
          style={styles.marginTop}
          label="Pick Location Barcode"
          value={pickLocationBarcode}
          onChange={setPickLocationBarcode}
          onSubmit={handleScan}
        />

        {allowReallocationDuringPicking && (
          <Button
            mode="contained"
            icon="swap-horizontal"
            style={styles.marginTop}
            onPress={() => setIsReallocateModalOpen(true)}
          >
            Reallocate
          </Button>
        )}
      </View>

      {allowReallocationDuringPicking && (
        <ReallocateModal
          visible={isReallocateModalOpen}
          currentTask={currentTask}
          onDismiss={() => setIsReallocateModalOpen(false)}
          onAllocated={() => {
            setIsReallocateModalOpen(false);
            resetSession();
            navigate('PickingPickType');
          }}
        />
      )}
    </ProductDetails.Provider>
  );
}
