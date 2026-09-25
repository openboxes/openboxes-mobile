import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Divider } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import Button from '../../components/Button';
import EmptyView from '../../components/EmptyView';
import { ContainerIcon, LocationIcon, QuantityIcon } from '../../components/Icons';
import { ScanErrorText } from '../../components/ScanErrorText';
import { ScannerInput } from '../../components/ScannerInput';
import { SearchButton } from '../../components/SearchButton';
import { useSearchButton } from '../../components/SearchButton/useSearchButton';
import { EMPTY_FALLBACK, EMPTY_STRING } from '../../constants';
import { useScanField } from '../../hooks/useScanField';
import { navigate } from '../../NavigationService';
import { patchPutawayTaskAction } from '../../redux/actions/putaways';
import { DetailChip, SortationProduct, SortationTask } from '../../types/sortation';
import SortationProductDetails from './SortationProductDetails';
import styles from './styles';

type ContainerRouteProp = RouteProp<
  { SortationQuantity: { product: SortationProduct; quantitySorted: number; task: SortationTask } },
  'SortationQuantity'
>;

export default function SortationContainerScreen() {
  const { params } = useRoute<ContainerRouteProp>();
  const { product, quantitySorted, task } = params;

  const containerScan = useScanField();
  const [mismatchedContainerCode, setMismatchedContainerCode] = useState<string>(EMPTY_STRING);

  const handleContainerChange = (next: string) => {
    containerScan.onChange(next);
    setMismatchedContainerCode(EMPTY_STRING);
  };

  const { isSearchOpen, searchButtonProps } = useSearchButton({ onSelect: handleContainerChange });
  const dispatch = useDispatch();

  if (!product) {
    return (
      <View style={styles.emptyContainer}>
        <EmptyView
          isRefresh
          title="Product Not Found"
          description="The product you are looking for does not exist or is not available."
          onPress={() => navigate('Sortation')}
        />
      </View>
    );
  }

  if (!quantitySorted || quantitySorted <= 0) {
    return (
      <View style={styles.emptyContainer}>
        <EmptyView
          isRefresh
          title="Invalid Quantity"
          description="Please enter a valid quantity greater than zero."
          onPress={() => navigate('SortationQuantity', { product })}
        />
      </View>
    );
  }

  function handleProcessing(code: string) {
    const expectedContainer = task?.container?.locationNumber;

    // We need to send `override` as true if the expected container is not defined, otherwise we will show the mismatch dialog.
    if (!expectedContainer) {
      confirmContainer(code, true);
      return;
    }

    if (code !== expectedContainer) {
      containerScan.fail(`Incorrect container scanned (${code}). Expected: ${expectedContainer}.`);
      setMismatchedContainerCode(code);
      return;
    }

    confirmContainer(code, false);
  }

  function handleContainerOverride() {
    setMismatchedContainerCode(EMPTY_STRING);
    confirmContainer(mismatchedContainerCode, true);
  }

  function confirmContainer(code: string, override: boolean) {
    const payload = {
      action: 'load',
      quantity: quantitySorted,
      container: code,
      override
    };

    dispatch(
      patchPutawayTaskAction(task.facility.id, task.id, payload, (response) => {
        if (response && !response.error) {
          containerScan.pass();
          navigate('Sortation', {
            sortedProduct: {
              name: product.name,
              productCode: product.productCode
            }
          });
        } else {
          containerScan.fail(response.errorMessage || 'An error occurred while sorting the product.');
        }
      })
    );
  }

  const productDetailsChips: DetailChip[] = [
    {
      icon: () => <QuantityIcon size={16} color="#000" />,
      label: 'Quantity',
      value: quantitySorted
    },
    {
      icon: () => <ContainerIcon size={16} color="#000" />,
      label: 'Container',
      value: task?.container?.locationNumber,
      isActive: true
    },
    {
      icon: () => <LocationIcon size={16} color="#000" />,
      label: 'Storage Location',
      value:
        task?.destination?.zoneName && task?.destination?.name
          ? `${task.destination.zoneName} \u2022 ${task.destination.name}`
          : task?.destination?.zoneName || task?.destination?.name
    }
  ];

  return (
    <ScrollView keyboardShouldPersistTaps="always" style={styles.contentContainer}>
      <SortationProductDetails product={product} detailsChips={productDetailsChips} task={task} />

      <Divider />

      <View style={styles.formContainer}>
        <View style={styles.scannerRow}>
          <ScannerInput
            style={styles.scannerInput}
            leftIcon={<ContainerIcon size={24} />}
            placeholder={task?.container?.locationNumber ?? EMPTY_FALLBACK}
            label="Container"
            value={containerScan.value}
            isEnabled={!isSearchOpen}
            danger={!!containerScan.error}
            onChange={handleContainerChange}
            onSubmit={handleProcessing}
          />
          <SearchButton searchType="container" {...searchButtonProps} />
        </View>
        <ScanErrorText message={containerScan.error} />
        {!!mismatchedContainerCode && (
          <Button
            style={styles.topSpace}
            icon="check"
            variant="danger"
            title={`Use ${mismatchedContainerCode} anyway`}
            mode="contained"
            size="100%"
            onPress={handleContainerOverride}
          />
        )}
      </View>
    </ScrollView>
  );
}
