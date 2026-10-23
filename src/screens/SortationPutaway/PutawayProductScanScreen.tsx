import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { Divider, Subheading } from 'react-native-paper';
import { useSelector } from 'react-redux';

import EmptyView from '../../components/EmptyView';
import { ScanErrorText } from '../../components/ScanErrorText';
import { ScannerInput } from '../../components/ScannerInput';
import { SearchButton } from '../../components/SearchButton';
import { useSearchButton } from '../../components/SearchButton/useSearchButton';
import { EMPTY_STRING } from '../../constants';
import { useScanField } from '../../hooks/useScanField';
import { navigate } from '../../NavigationService';
import { RootState } from '../../redux/reducers';
import { SortationTask } from '../../types/sortation';
import { isProductBarcodeValid } from '../../utils/utils';
import PutawayDetails from './PutawayDetails';
import { SkipButton } from './SkipButton';
import styles from './styles';

type PutawayProductScanRouteProp = RouteProp<
  {
    SortationPutawayProductScan: {
      currentTaskIndex: number;
      isDirectPutaway?: boolean;
      isUserDirected?: boolean;
      containerId?: string;
      task?: SortationTask;
    };
  },
  'SortationPutawayProductScan'
>;

export default function PutawayProductScanScreen() {
  const { params } = useRoute<PutawayProductScanRouteProp>();
  const { currentTaskIndex, isDirectPutaway, isUserDirected, containerId, task } = params;
  const putawayTasks = useSelector((state: RootState) => state.putawayReducer.putawayTasks) as SortationTask[];
  const putawayDetails = task ?? putawayTasks?.[currentTaskIndex];
  const productScan = useScanField();
  const resetProductScan = productScan.setValue;
  const { isSearchOpen, searchButtonProps } = useSearchButton({ onSelect: productScan.onChange });

  useEffect(() => {
    resetProductScan(EMPTY_STRING);
  }, [currentTaskIndex, putawayDetails?.id, resetProductScan]);

  if (!putawayDetails) {
    return (
      <View style={styles.emptyContainer}>
        <EmptyView
          title="Putaway Details Not Found"
          description="The putaway details you are looking for do not exist or are not available."
        />
      </View>
    );
  }

  function handleProcessing(code: string) {
    const product = putawayDetails.inventoryItem?.product;
    const isValid = isProductBarcodeValid(code, product);

    if (!isValid) {
      productScan.fail(`Incorrect product scanned (${code}). Expected: ${product?.productCode}.`);
      return;
    }

    productScan.pass();
    navigate('SortationPutawayQuantity', {
      currentTaskIndex,
      isDirectPutaway,
      isUserDirected,
      containerId,
      task
    });
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      style={styles.contentWrapper}
      contentContainerStyle={styles.contentContainer}
    >
      <PutawayDetails
        putawayDetails={putawayDetails}
        taskIndex={currentTaskIndex}
        totalTasks={putawayTasks.length}
        showTaskCounter={!isUserDirected}
      />

      <Divider />

      <View style={styles.formContainer}>
        <Subheading style={styles.subheading}>Scan putaway product or use search to find it</Subheading>

        <View style={styles.scannerRow}>
          <ScannerInput
            style={styles.scannerInput}
            label="Putaway Product Entry Field"
            value={productScan.value}
            isEnabled={!isSearchOpen}
            danger={!!productScan.error}
            onChange={productScan.onChange}
            onSubmit={handleProcessing}
          />
          <SearchButton searchType="product" {...searchButtonProps} />
        </View>
        <ScanErrorText message={productScan.error} />

        {!isUserDirected && (
          <SkipButton
            taskList={putawayTasks}
            currentTaskIndex={currentTaskIndex}
            isDirectPutaway={isDirectPutaway}
            containerId={containerId}
          />
        )}
      </View>
    </ScrollView>
  );
}
