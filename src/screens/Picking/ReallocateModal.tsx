import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, View } from 'react-native';
import { Button, DataTable, Headline, Paragraph, TextInput } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import { getStockMovementItemDetailsAction, reallocatePickTaskAction } from '../../redux/actions/picking';
import { AvailableItem, PicklistItem, PickTask, ReallocationItem } from '../../types/picking';
import styles from './styles';

type ReallocateModalProps = {
  visible: boolean;
  onDismiss: () => void;
  onAllocated: () => void;
  currentTask: PickTask;
};

export function ReallocateModal({ visible, onDismiss, onAllocated, currentTask }: ReallocateModalProps) {
  const dispatch = useDispatch();
  const [rows, setRows] = useState<ReallocationItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!visible || !currentTask.requisitionItemId) {
      return;
    }

    dispatch(
      getStockMovementItemDetailsAction(currentTask.requisitionItemId, ({ response, errorMessage }) => {
        if (errorMessage || !response?.data) {
          Alert.alert('Error', errorMessage || 'Failed to load available items.');
          return;
        }

        const pickPageItem = response.data;
        const availableItems: AvailableItem[] = pickPageItem.availableItems || [];
        const picklistItems: PicklistItem[] = (pickPageItem.picklistItems || []).filter(
          (pi: PicklistItem) => pi.id === currentTask.id
        );

        const preparedData = availableItems
          .filter((item) => item.quantityAvailable > 0)
          .map((item, index) => {
            const picklistItem = picklistItems.find(
              (pi) =>
                pi['inventoryItem.id'] === item['inventoryItem.id'] && pi['binLocation.id'] === item['binLocation.id']
            );

            return {
              ...item,
              _localId: `loc-${item['binLocation.id'] || 'null'}-idx-${index}`,
              id: picklistItem?.id,
              quantityAllocated: picklistItem ? String(picklistItem.quantity || 0) : '',
              quantityPicked: picklistItem ? String(picklistItem.quantityPicked || 0) : ''
            };
          });

        setRows(preparedData);
      })
    );
  }, [visible, currentTask, dispatch]);

  const totalAllocated = rows.reduce((sum, row) => {
    const qty = parseInt(row.quantityAllocated, 10);
    return sum + (isNaN(qty) ? 0 : qty);
  }, 0);

  const isExactMatch = totalAllocated === currentTask.quantityRequired;
  const isQuantityRequiredExceeded = totalAllocated > currentTask.quantityRequired;

  function updateQty(localId: string, text: string) {
    if (text === '') {
      setRows((prev) => prev.map((row) => (row._localId === localId ? { ...row, quantityAllocated: '' } : row)));
      return;
    }

    const newValue = parseInt(text, 10);
    if (isNaN(newValue)) {
      return;
    }

    setRows((prev) =>
      prev.map((row) => {
        if (row._localId === localId) {
          const cappedValue = newValue > row.quantityAvailable ? row.quantityAvailable : newValue;
          return { ...row, quantityAllocated: String(cappedValue) };
        }
        return row;
      })
    );
  }

  function handleSave() {
    const itemsToSave = rows.filter((row) => {
      const qty = parseInt(row.quantityAllocated, 10);
      return !isNaN(qty) && qty > 0;
    });

    const binCount = itemsToSave.length;

    Alert.alert(
      'Confirm Reallocation',
      `You are about to reallocate from ${binCount} bin${
        binCount !== 1 ? 's' : ''
      }. This will remove the current pick task and create ${binCount} new pick task${
        binCount !== 1 ? 's' : ''
      }. Do you want to continue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => submitReallocation(itemsToSave) }
      ]
    );
  }

  function submitReallocation(itemsToSave: ReallocationItem[]) {
    setIsSubmitting(true);

    const picklistItems = itemsToSave.map((row) => ({
      inventoryItem: { id: row['inventoryItem.id']! },
      binLocation: { id: row['binLocation.id'] || '' },
      quantity: parseInt(row.quantityAllocated, 10)
    }));

    dispatch(
      reallocatePickTaskAction(currentTask.id, picklistItems, ({ response, errorMessage }) => {
        setIsSubmitting(false);

        if (errorMessage || !response?.data) {
          Alert.alert('Error', errorMessage || 'Reallocation failed');
          return;
        }

        Alert.alert('Reallocation Complete', 'Pick tasks have been updated successfully.', [
          { text: 'OK', onPress: onAllocated }
        ]);
      })
    );
  }

  const displayLocations = rows.filter((row) => row.binLocation?.isDisplay);
  const warehouseLocations = rows.filter((row) => !row.binLocation?.isDisplay);

  const renderRowsGroup = (items: ReallocationItem[]) => {
    return items.map((row) => (
      <DataTable.Row key={row._localId} style={styles.modalRowNoBorder}>
        <DataTable.Cell style={styles.modalCellBinLocation}>
          {row['binLocation.name'] ?? row.binLocation?.locationNumber ?? 'Default'}
        </DataTable.Cell>

        <DataTable.Cell numeric>{row.quantityAvailable}</DataTable.Cell>

        <DataTable.Cell numeric>
          <TextInput
            dense
            mode="flat"
            autoCompleteType="off"
            keyboardType="numeric"
            value={row.quantityAllocated}
            style={styles.modalCellInput}
            underlineColor="transparent"
            onChangeText={(v) => updateQty(row._localId, v)}
          />
        </DataTable.Cell>
      </DataTable.Row>
    ));
  };

  return (
    <Modal transparent animationType="slide" visible={visible} onDismiss={onDismiss}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Headline>Reallocate</Headline>

          <Paragraph>
            Product: {currentTask.product.productCode} | {currentTask.product.name}
          </Paragraph>
          <Paragraph
            style={!isExactMatch && totalAllocated > 0 ? styles.modalQuantityTextDanger : styles.modalQuantityText}
          >
            Quantity Allocated: {totalAllocated} / {currentTask.quantityRequired}
          </Paragraph>
          {isQuantityRequiredExceeded && (
            <Paragraph style={styles.modalQuantityTextDanger}>
              Total allocated quantity exceeds the required quantity.
            </Paragraph>
          )}

          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Bin Location</DataTable.Title>
              <DataTable.Title numeric>Available</DataTable.Title>
              <DataTable.Title numeric>Allocated</DataTable.Title>
            </DataTable.Header>

            <ScrollView style={styles.modalScrollableContent}>
              {displayLocations.length > 0 && (
                <>
                  <View style={styles.modalSectionHeader}>
                    <Paragraph style={styles.modalSectionHeaderTextPrimary}>Display</Paragraph>
                  </View>
                  {renderRowsGroup(displayLocations)}
                </>
              )}

              {warehouseLocations.length > 0 && (
                <>
                  <View
                    style={[
                      styles.modalSectionHeader,
                      displayLocations.length > 0 ? styles.modalSectionHeaderSpacing : undefined
                    ]}
                  >
                    <Paragraph style={styles.modalSectionHeaderTextDefault}>
                      {warehouseLocations.length} Result{warehouseLocations.length > 1 ? 's' : ''}
                    </Paragraph>
                  </View>
                  {renderRowsGroup(warehouseLocations)}
                </>
              )}

              {rows.length === 0 && <Paragraph style={styles.modalEmptyText}>No available stock found.</Paragraph>}
            </ScrollView>
          </DataTable>

          <View style={styles.modalActionButtons}>
            <Button onPress={onDismiss}>Cancel</Button>
            <Button
              mode="contained"
              style={styles.modalLeftMargin}
              loading={isSubmitting}
              disabled={!isExactMatch || isSubmitting}
              onPress={handleSave}
            >
              Save
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
