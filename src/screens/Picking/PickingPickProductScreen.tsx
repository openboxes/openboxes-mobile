import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Divider, Paragraph, Subheading } from 'react-native-paper';

import { ProductDetails } from '../../components/ProductDetails';
import { ScanErrorText } from '../../components/ScanErrorText';
import { ScannerInput } from '../../components/ScannerInput';
import { SearchButton } from '../../components/SearchButton';
import { useSearchButton } from '../../components/SearchButton/useSearchButton';
import { EMPTY_STRING, HYPHEN } from '../../constants';
import { useScanField } from '../../hooks/useScanField';
import { navigate } from '../../NavigationService';
import { isProductBarcodeValid, parseFromISODateToLocaleString } from '../../utils/utils';
import { CustomerDetails } from './CustomerDetails';
import { usePickingContext } from './PickingContext';
import styles from './styles';

export default function PickingPickProductScreen() {
  const { currentTask, currentTaskIndex, allTasksCount } = usePickingContext();
  const productScan = useScanField();
  const { isSearchOpen, searchButtonProps } = useSearchButton({ onSelect: productScan.onChange });

  if (!currentTask) {
    return null;
  }

  function handleScan(scannedBarcode: string) {
    const isValid = isProductBarcodeValid(scannedBarcode, currentTask?.product);

    if (!isValid) {
      productScan.fail(`Incorrect product scanned (${scannedBarcode}). Expected: ${currentTask?.product.productCode}.`);
      return;
    }

    productScan.pass();
    navigate('PickingPickQuantity');

    productScan.setValue(EMPTY_STRING);
  }

  return (
    <ScrollView style={styles.flex1} keyboardShouldPersistTaps="handled">
      <ProductDetails.Provider product={currentTask.product} status={currentTask.status}>
        <ProductDetails.Root>
          <ProductDetails.Header>
            <ProductDetails.Badge icon="navigation" label="Pick Task">
              {`${currentTaskIndex + 1} / ${allTasksCount}`}
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
                icon: 'account',
                label: 'Assignee',
                value: currentTask?.assignee
                  ? `${currentTask?.assignee?.firstName} ${currentTask?.assignee?.lastName}`.trim()
                  : HYPHEN
              },
              {
                icon: 'package',
                label: 'Quantity Picked',
                value: `${currentTask.quantityPicked || 0} / ${currentTask.quantityRequired}`
              },
              { icon: 'pin', label: 'Pick Location', value: currentTask.location?.name || 'Default' }
            ]}
          />
        </ProductDetails.Root>

        <Divider />

        <View style={[styles.wrapperWithPadding]}>
          <Subheading style={styles.subheading}>Scan Product Barcode</Subheading>
          <Paragraph style={styles.paragraph}>
            Point your barcode scanner at the product barcode or use search to find it.
          </Paragraph>

          <View style={styles.scannerRow}>
            <ScannerInput
              style={styles.scannerInput}
              label="Product Barcode"
              value={productScan.value}
              isEnabled={!isSearchOpen}
              danger={!!productScan.error}
              onChange={productScan.onChange}
              onSubmit={handleScan}
            />
            <SearchButton searchType="product" {...searchButtonProps} />
          </View>
          <ScanErrorText message={productScan.error} />
        </View>
      </ProductDetails.Provider>
    </ScrollView>
  );
}
