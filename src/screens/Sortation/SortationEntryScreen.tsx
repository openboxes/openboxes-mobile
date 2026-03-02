import React, { useCallback, useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { Title } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import IconProducts from '../../assets/images/icon_products.svg';
import { ScannerInput } from '../../components/ScannerInput';
import { EMPTY_STRING } from '../../constants';
import { navigate } from '../../NavigationService';
import { getSortationDetailsByBarcode } from '../../redux/actions/products';
import { SortationTask } from '../../types/sortation';
import styles from './styles';

export default function SortationEntryScreen() {
  const [barcode, setBarcode] = useState<string>(EMPTY_STRING);
  const dispatch = useDispatch();

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
          } else {
            Alert.alert('Sortation Failed', response?.errorMessage || 'Product not found.');
          }
          setBarcode(EMPTY_STRING);
        })
      );
    },
    [dispatch]
  );

  return (
    <ScrollView keyboardShouldPersistTaps="always" style={styles.screen}>
      <Title style={styles.title}>Scan or type the product's barcode</Title>

      <ScannerInput
        style={styles.topSpace}
        label="Product"
        placeholder="Scan or type the product's barcode"
        value={barcode}
        leftIcon={<IconProducts height={24} width={24} />}
        onChange={setBarcode}
        onSubmit={handleScan}
      />
    </ScrollView>
  );
}
