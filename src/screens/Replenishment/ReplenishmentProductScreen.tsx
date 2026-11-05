import React, { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Divider, Paragraph, Subheading } from 'react-native-paper';

import EmptyView from '../../components/EmptyView';
import { ScanErrorText } from '../../components/ScanErrorText';
import { ScannerInput } from '../../components/ScannerInput';
import { SearchButton } from '../../components/SearchButton';
import { useSearchButton } from '../../components/SearchButton/useSearchButton';
import { EMPTY_STRING } from '../../constants';
import { useScanField } from '../../hooks/useScanField';
import { navigate } from '../../NavigationService';
import { isProductBarcodeValid } from '../../utils/utils';
import { useReplenishmentContext } from './ReplenishmentContext';
import { ReplenishmentTaskDetails } from './ReplenishmentTaskDetails';
import { useReplenishmentScanLog } from './scanLog';
import styles from './styles';

export function ReplenishmentProductScreen() {
  const { currentList, currentTask, currentTaskIndex, tasksCount } = useReplenishmentContext();
  const productScan = useScanField();
  const resetProductScan = productScan.setValue;
  const { isSearchOpen, searchButtonProps } = useSearchButton({ onSelect: productScan.onChange });
  const logScan = useReplenishmentScanLog();

  useEffect(() => {
    resetProductScan(EMPTY_STRING);
  }, [currentTask?.id, resetProductScan]);

  if (!currentTask) {
    return (
      <View style={styles.flex1}>
        <EmptyView
          title="No Replenishment Task"
          description="There is no replenishment task to work on. Choose a replenishment list to start."
        />
        <Button mode="text" style={styles.marginBottom} onPress={() => navigate('ReplenishmentList')}>
          Back To List
        </Button>
      </View>
    );
  }

  const expectedProductCode = currentTask.product?.productCode;

  function handleScan(productBarcode: string) {
    if (!isProductBarcodeValid(productBarcode, currentTask?.product)) {
      logScan('PRODUCT', 'FAIL', productBarcode, expectedProductCode);
      productScan.fail(
        `Incorrect Product Scanned. Please Scan Again (scanned ${productBarcode}, expected ${expectedProductCode}).`
      );
      return;
    }

    logScan('PRODUCT', 'PASS', productBarcode, expectedProductCode);
    productScan.setValue(EMPTY_STRING);
    productScan.pass();
    navigate('ReplenishmentPickQuantity');
  }

  return (
    <ScrollView style={styles.flex1} keyboardShouldPersistTaps="handled">
      <ReplenishmentTaskDetails
        task={currentTask}
        list={currentList}
        taskIndex={currentTaskIndex}
        tasksCount={tasksCount}
      />

      <Divider />

      <View style={styles.wrapperWithPadding}>
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
    </ScrollView>
  );
}
