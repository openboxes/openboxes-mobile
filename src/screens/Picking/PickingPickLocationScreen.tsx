import * as React from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { Button, Divider, Paragraph, Subheading } from 'react-native-paper';
import { useSelector } from 'react-redux';

import { ProductDetails } from '../../components/ProductDetails';
import { ScanErrorText } from '../../components/ScanErrorText';
import { ScannerInput } from '../../components/ScannerInput';
import { SearchButton } from '../../components/SearchButton';
import { useSearchButton } from '../../components/SearchButton/useSearchButton';
import { EMPTY_STRING, HYPHEN } from '../../constants';
import { useScanField } from '../../hooks/useScanField';
import { navigate, resetToRoutes } from '../../NavigationService';
import { RootState } from '../../redux/reducers';
import { parseFromISODateToLocaleString } from '../../utils/utils';
import { CustomerDetails } from './CustomerDetails';
import { usePickingContext } from './PickingContext';
import { ReallocateModal } from './ReallocateModal';
import styles from './styles';

export default function PickingPickLocationScreen() {
  const {
    currentTask,
    currentTaskIndex,
    allTasksCount,
    startPickTask,
    revalidateCurrentTask,
    resetSession,
    homeRoute
  } = usePickingContext();
  const locationScan = useScanField();
  const [isMissingBinLocation, setIsMissingBinLocation] = React.useState(false);
  const [isReallocateModalOpen, setIsReallocateModalOpen] = React.useState(false);
  const { allowReallocationDuringPicking } = useSelector((state: RootState) => state.settingsReducer);

  const handleLocationChange = (next: string) => {
    locationScan.onChange(next);
    setIsMissingBinLocation(false);
  };

  const { isSearchOpen, searchButtonProps } = useSearchButton({ onSelect: handleLocationChange });

  if (!currentTask) {
    return null;
  }

  function proceedToProduct() {
    setIsMissingBinLocation(false);
    startPickTask(({ errorMessage }) => {
      if (errorMessage) {
        locationScan.fail(errorMessage);
        return;
      }

      revalidateCurrentTask((_task, revalidateError) => {
        if (revalidateError) {
          Alert.alert('Error', revalidateError);
        }
        locationScan.setValue(EMPTY_STRING);
        locationScan.pass();
        navigate('PickingPickProduct');
      });
    });
  }

  function handleScan(locationBarcode: string) {
    if (!currentTask?.location?.locationNumber) {
      locationScan.fail('There is no bin location assigned to this task.');
      setIsMissingBinLocation(true);
      return;
    }

    if (locationBarcode !== currentTask.location.locationNumber) {
      locationScan.fail(
        `Incorrect location scanned (${locationBarcode}). Expected: ${currentTask.location.locationNumber}.`
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
              value={locationScan.value}
              isEnabled={!isReallocateModalOpen && !isSearchOpen}
              danger={!!locationScan.error}
              onChange={handleLocationChange}
              onSubmit={handleScan}
            />
            <SearchButton searchType="location" {...searchButtonProps} />
          </View>
          <ScanErrorText message={locationScan.error} />
          {isMissingBinLocation && (
            <Button mode="text" style={styles.marginTop} onPress={proceedToProduct}>
              Continue with default location
            </Button>
          )}

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
              // Reset so the finished task screens are not left behind the back arrow.
              resetToRoutes([{ name: 'Drawer', params: { screen: 'Dashboard' } }, { name: homeRoute }]);
            }}
          />
        )}
      </ProductDetails.Provider>
    </ScrollView>
  );
}
