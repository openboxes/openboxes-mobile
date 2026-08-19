import * as React from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { Button, Divider, Paragraph, Subheading } from 'react-native-paper';
import { useSelector } from 'react-redux';

import { ProductDetails } from '../../components/ProductDetails';
import { ScannerInput } from '../../components/ScannerInput';
import { SearchButton } from '../../components/SearchButton';
import { useSearchButton } from '../../components/SearchButton/useSearchButton';
import { EMPTY_STRING, HYPHEN } from '../../constants';
import { navigate } from '../../NavigationService';
import { RootState } from '../../redux/reducers';
import { parseFromISODateToLocaleString } from '../../utils/utils';
import { CustomerDetails } from './CustomerDetails';
import { usePickingContext } from './PickingContext';
import { ReallocateModal } from './ReallocateModal';
import styles from './styles';

export default function PickingPickLocationScreen() {
  const { currentTask, currentTaskIndex, allTasksCount, startPickTask, revalidateCurrentTask, resetSession } =
    usePickingContext();
  const [pickLocationBarcode, setPickLocationBarcode] = React.useState<string>(EMPTY_STRING);
  const [isReallocateModalOpen, setIsReallocateModalOpen] = React.useState(false);
  const { allowReallocationDuringPicking } = useSelector((state: RootState) => state.settingsReducer);
  const { isSearchOpen, searchButtonProps } = useSearchButton({ onSelect: setPickLocationBarcode });

  if (!currentTask) {
    return null;
  }

  function proceedToProduct() {
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

  function handleScan(locationBarcode: string) {
    if (!currentTask?.location?.locationNumber) {
      Alert.alert(
        'No Bin Location',
        'There is no bin location assigned to this task. Do you want to continue and fallback to default?',
        [
          { text: 'Cancel', style: 'cancel', onPress: () => setPickLocationBarcode(EMPTY_STRING) },
          { text: 'Continue', onPress: proceedToProduct }
        ]
      );
      return;
    }

    if (locationBarcode !== currentTask.location.locationNumber) {
      Alert.alert(
        'Invalid Barcode',
        `Incorrect location scanned. Expected: ${currentTask.location.locationNumber}. Try again.`,
        [{ text: 'OK', onPress: () => setPickLocationBarcode(EMPTY_STRING) }]
      );
      return;
    }

    proceedToProduct();
  }

  return (
    <ScrollView style={styles.flex1} keyboardShouldPersistTaps="handled">
      <ProductDetails.Provider product={currentTask.product} status={currentTask.status}>
        <ProductDetails.Root>
          <ProductDetails.Header>
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
              }
            ]}
          />
          <CustomerDetails
            name={currentTask.destination}
            locationType={currentTask.destinationLocationType}
            address={currentTask.destinationAddress}
          />
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

        <View style={[styles.wrapperWithPadding]}>
          <Subheading style={styles.subheading}>Scan Pick Location Barcode</Subheading>
          <Paragraph style={styles.paragraph}>
            Point your barcode scanner at the pick location barcode or use search to find it.
          </Paragraph>

          <View style={styles.scannerRow}>
            <ScannerInput
              style={styles.scannerInput}
              label="Pick Location Barcode"
              value={pickLocationBarcode}
              isEnabled={!isReallocateModalOpen && !isSearchOpen}
              onChange={setPickLocationBarcode}
              onSubmit={handleScan}
            />
            <SearchButton searchType="location" {...searchButtonProps} />
          </View>

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
    </ScrollView>
  );
}
