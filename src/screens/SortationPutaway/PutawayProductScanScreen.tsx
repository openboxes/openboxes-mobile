import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { Divider, Subheading } from 'react-native-paper';
import { useSelector } from 'react-redux';

import Button from '../../components/Button';
import EmptyView from '../../components/EmptyView';
import { ScannerInput } from '../../components/ScannerInput';
import { SearchButton } from '../../components/SearchButton';
import { useSearchButton } from '../../components/SearchButton/useSearchButton';
import { EMPTY_STRING } from '../../constants';
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
  const [putawayProductBarcode, setPutawayProductBarcode] = useState<string>(EMPTY_STRING);
  const { isSearchOpen, searchButtonProps } = useSearchButton({ onSelect: setPutawayProductBarcode });

  useEffect(() => {
    setPutawayProductBarcode(EMPTY_STRING);
  }, [currentTaskIndex, putawayDetails?.id]);

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
      Alert.alert(
        'Wrong Product',
        `The scanned barcode does not match the expected putaway product (${product?.productCode}).`,
        [{ text: 'OK', onPress: () => setPutawayProductBarcode(EMPTY_STRING) }]
      );
      return;
    }

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
            value={putawayProductBarcode}
            isEnabled={!isSearchOpen}
            onChange={setPutawayProductBarcode}
            onSubmit={handleProcessing}
          />
          <SearchButton searchType="product" {...searchButtonProps} />
        </View>

        <Button
          style={styles.topSpace}
          title="Submit"
          mode="contained"
          size="100%"
          onPress={() => handleProcessing(putawayProductBarcode)}
        />

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
