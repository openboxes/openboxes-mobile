import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { Divider, Paragraph, Text, Title } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import IconProducts from '../../assets/images/icon_products.svg';
import { ScannerInput } from '../../components/ScannerInput';
import { SearchButton } from '../../components/SearchButton';
import { useSearchButton } from '../../components/SearchButton/useSearchButton';
import { EMPTY_STRING } from '../../constants';
import { navigate, replace } from '../../NavigationService';
import { getSortationDetailsByBarcode } from '../../redux/actions/products';
import { SortationTask } from '../../types/sortation';
import { BarcodeUnrecognizedDialog } from './BarcodeUnrecognizedDialog';
import styles from './styles';

type SortedProduct = {
  name: string;
  productCode: string;
};

type SortationEntryRouteProp = RouteProp<{ Sortation: { sortedProduct?: SortedProduct } }, 'Sortation'>;

export default function SortationEntryScreen() {
  const [barcode, setBarcode] = useState<string>(EMPTY_STRING);
  const [unrecognizedBarcode, setUnrecognizedBarcode] = useState<string | null>(null);
  const dispatch = useDispatch();
  const { isSearchOpen, searchButtonProps } = useSearchButton({ onSelect: setBarcode });
  const { params } = useRoute<SortationEntryRouteProp>();
  const sortedProduct = params?.sortedProduct;

  const handleScan = useCallback(
    (code: string) => {
      dispatch(
        getSortationDetailsByBarcode(code, (response) => {
          if (response && !response.error) {
            const { product, tasks } = response;
            const allowedStatuses = ['PENDING', 'STARTED'];
            const filteredTasks = (tasks || []).filter((task: SortationTask) => allowedStatuses.includes(task.status));

            if (filteredTasks.length === 0) {
              Alert.alert('No Valid Tasks', 'No pending tasks found.');
            } else if (filteredTasks.length === 1) {
              navigate('SortationQuantity', { product, task: filteredTasks[0] });
            } else {
              navigate('SortationTaskList', { product, tasks: filteredTasks });
            }
          } else if (response?.productNotFound) {
            setUnrecognizedBarcode(code);
          } else {
            Alert.alert('Sortation Failed', response?.errorMessage || 'Something went wrong.');
          }
          setBarcode(EMPTY_STRING);
        })
      );
    },
    [dispatch]
  );

  const handleFindProduct = () => {
    setUnrecognizedBarcode(null);
    navigate('Products', { fromSortation: true });
  };

  const handleReturnToDashboard = () => {
    replace('Sortation');
    navigate('Dashboard');
  };

  return (
    <ScrollView keyboardShouldPersistTaps="always" style={styles.screen}>
      <BarcodeUnrecognizedDialog
        visible={unrecognizedBarcode !== null}
        barcode={unrecognizedBarcode ?? EMPTY_STRING}
        onFindProduct={handleFindProduct}
        onClose={() => setUnrecognizedBarcode(null)}
      />
      {sortedProduct && (
        <View style={styles.successBanner}>
          <Paragraph style={styles.successHeader}>{sortedProduct.productCode} was sorted </Paragraph>
          <Paragraph style={styles.successText}>
            <Text style={styles.link} onPress={handleReturnToDashboard}>
              Return to dashboard
            </Text>{' '}
            or scan the next product to be sorted
          </Paragraph>

          <Divider style={styles.contentDivider} />
        </View>
      )}

      <Title style={styles.title}>Scan product barcode or use search to find it</Title>

      <View style={styles.scannerRow}>
        <ScannerInput
          style={styles.scannerInput}
          label="Product"
          placeholder="Scan product barcode"
          value={barcode}
          leftIcon={<IconProducts height={24} width={24} />}
          isEnabled={!isSearchOpen && unrecognizedBarcode === null}
          onChange={setBarcode}
          onSubmit={handleScan}
        />
        <SearchButton searchType="product" {...searchButtonProps} />
      </View>
    </ScrollView>
  );
}
