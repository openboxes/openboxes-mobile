import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, View } from 'react-native';
import { Button, DataTable, Headline, List, Paragraph, TextInput, Title } from 'react-native-paper';

import EmptyView from '../../components/EmptyView';
import Theme from '../../utils/Theme';
import styles from './styles';
import { AllocationOrderLine, AllocationStrategy, AvailableItem } from './types';
import { allocate, getOutboundOrderDetails, updateOrderStatus } from '../../apis';
import { navigate } from '../../NavigationService';

type PickUpOrderRouteProp = RouteProp<{ PickUpOrderScreen: { orderId: string } }, 'PickUpOrderScreen'>;

export function PickUpOrderScreen() {
  const { params } = useRoute<PickUpOrderRouteProp>();
  const { orderId } = params;

  const [allAllocatedAlertShown, setAllAllocatedAlertShown] = useState(false);
  const [fullOrder, setFullOrder] = useState<any>(null);

  const fetchDetails = useCallback(async () => {
    try {
      const response = await getOutboundOrderDetails(orderId);
      setFullOrder(response.data || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to load order details.');
    }
  }, [orderId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const handleFinishAllocation = useCallback(
    async (navigateToPicking: boolean) => {
      try {
        await updateOrderStatus(orderId, 'PICKING');

        if (navigateToPicking) {
          navigate('PickingPickType');
        } else {
          navigate('PickUpEntryScreen');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to update order status.');
      }
    },
    [orderId]
  );

  const showAllPickedDialog = useCallback(() => {
    Alert.alert(
      'All Lines Allocated',
      'All lines for this order have been allocated. Would you like to self-pick this order?',
      [
        {
          text: 'No',
          style: 'cancel',
          onPress: () => handleFinishAllocation(false)
        },
        {
          text: 'Yes',
          onPress: () => handleFinishAllocation(true)
        }
      ]
    );
  }, [handleFinishAllocation]);

  const handleLineAllocated = useCallback(() => {
    fetchDetails();
  }, [fetchDetails]);

  useEffect(() => {
    if (!fullOrder || !fullOrder.lineItems || fullOrder.lineItems.length === 0) {
      return;
    }

    const areAllLinesFullyAllocated = fullOrder.lineItems.every((line: any) => {
      const allocated = line.quantityAllocated || 0;
      const required = line.quantityRequired || 0;
      return allocated >= required;
    });

    if (areAllLinesFullyAllocated && !allAllocatedAlertShown) {
      setAllAllocatedAlertShown(true);
      showAllPickedDialog();
    }

    if (!areAllLinesFullyAllocated && allAllocatedAlertShown) {
      setAllAllocatedAlertShown(false);
    }
  }, [fullOrder, allAllocatedAlertShown, showAllPickedDialog]);

  if (!fullOrder || !fullOrder.lineItems) {
    return (
      <EmptyView
        title="No Order Data Available"
        description="It looks like there are no order lines available for this order."
      />
    );
  }

  return (
    <View style={styles.screenContainer}>
      <Title style={styles.titleText}>Order Line Allocation ({fullOrder.lineItems.length})</Title>

      <ScrollView>
        <List.Section>
          {fullOrder.lineItems.map((line, index) => (
            <AllocationOrderItem
              key={`${line.product.productCode}-${index}`}
              orderLine={line}
              orderId={orderId}
              onAllocated={handleLineAllocated}
            />
          ))}
        </List.Section>
      </ScrollView>
    </View>
  );
}

function AllocationOrderItem({
  orderLine,
  onAllocated,
  orderId
}: {
  orderLine: AllocationOrderLine;
  onAllocated: () => void;
  orderId: string;
}) {
  const { product, quantityRequired, quantityAllocated } = orderLine;

  const isFullyAllocated = (quantityAllocated || 0) >= (quantityRequired || 0);
  const isPartiallyAllocated = (quantityAllocated || 0) > 0 && (quantityAllocated || 0) < (quantityRequired || 0);

  const [expanded, setExpanded] = useState(!isFullyAllocated);

  useEffect(() => {
    if (isFullyAllocated) {
      setExpanded(false);
    }
  }, [isFullyAllocated]);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  function handleMarkAllocated() {
    setExpanded(false);
    onAllocated?.();
  }

  return (
    <List.Accordion
      title={`${product.name} (${product.productCode})`}
      description={
        isFullyAllocated || isPartiallyAllocated
          ? `Quantity Allocated: ${quantityAllocated} / ${quantityRequired}`
          : `Quantity Required: ${quantityRequired}`
      }
      left={(props) => (
        <List.Icon
          {...props}
          icon={isFullyAllocated ? 'check-circle' : isPartiallyAllocated ? 'progress-alert' : 'package-variant-closed'}
          color={isFullyAllocated ? Theme.colors.success : isPartiallyAllocated ? Theme.colors.warning : undefined}
        />
      )}
      expanded={expanded}
      // eslint-disable-next-line react-native/no-inline-styles
      style={[styles.accordion, isFullyAllocated && { opacity: 0.5 }]}
      titleStyle={styles.accordionTitle}
      descriptionStyle={styles.accordionDescription}
      onPress={toggleExpanded}
    >
      {!isFullyAllocated && (
        <View style={[styles.accordionContent, styles.paddingZero]}>
          <OrderLineController orderLine={orderLine} orderId={orderId} onAllocated={handleMarkAllocated} />
        </View>
      )}
    </List.Accordion>
  );
}

function OrderLineController({
  onAllocated,
  orderLine,
  orderId
}: {
  onAllocated: () => void;
  orderId: string;
  orderLine: AllocationOrderLine;
}) {
  const [partialQuantity, setPartialQuantity] = useState<number | null>(null);
  const [isStockPickOpen, setIsStockPickOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAutoPick = async (strategy: AllocationStrategy) => {
    try {
      setIsSubmitting(true);

      const payload = {
        mode: 'AUTO',
        strategies: [strategy]
      };

      await allocate(orderId, orderLine.id, payload);

      Alert.alert('Success', 'Item allocated successfully', [{ text: 'OK', onPress: onAllocated }]);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualAllocation = async (rows: AvailableItem[]) => {
    try {
      setIsStockPickOpen(false);
      setIsSubmitting(true);

      const itemsToAllocate = rows.filter((row) => {
        const qty = parseInt(row.quantityAllocated, 10);
        return !isNaN(qty) && qty > 0;
      });

      if (itemsToAllocate.length === 0) {
        Alert.alert('No items selected', 'Please enter a quantity to allocate.');
        setIsSubmitting(false);
        setIsStockPickOpen(true);
        return;
      }

      const allocationsPayload = itemsToAllocate.map((row) => ({
        id: row.id,
        inventoryItemId: row['inventoryItem.id'],
        binLocationId: row.binLocation.id,
        quantity: parseInt(row.quantityAllocated, 10)
      }));

      const payload = {
        mode: 'MANUAL',
        allocations: allocationsPayload
      };

      await allocate(orderId, orderLine.id, payload);

      Alert.alert('Success', 'Manual allocation saved', [{ text: 'OK', onPress: onAllocated }]);
    } catch (error) {
      Alert.alert('Error', 'Manual allocation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  function handleConfirm() {
    if (
      !partialQuantity ||
      partialQuantity > orderLine.quantityRequired ||
      partialQuantity === null ||
      partialQuantity <= 0
    ) {
      Alert.alert('Invalid Quantity', `Please enter a valid partial quantity (1 - ${orderLine.quantityRequired}).`);
      return;
    }

    Alert.alert(
      'Confirm Partial Quantity',
      `Are you sure you want to confirm a partial quantity of ${partialQuantity ?? 0}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: onAllocated
        }
      ]
    );
  }

  function handleWarehousePick() {
    Alert.alert('Allocate from warehouse', 'Confirm allocation from warehouse?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', onPress: () => handleAutoPick('WAREHOUSE_FIRST') }
    ]);
  }

  function handleDisplayPick() {
    Alert.alert('Allocate from display', 'Confirm allocation from display?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', onPress: () => handleAutoPick('DISPLAY_FIRST') }
    ]);
  }

  function handleStockPick() {
    setIsStockPickOpen(true);
  }

  return (
    <View>
      <View style={styles.buttonRow}>
        <Button
          mode="contained"
          labelStyle={styles.buttonText}
          style={styles.button}
          loading={isSubmitting}
          disabled={isSubmitting}
          onPress={handleWarehousePick}
        >
          Allocate from warehouse
        </Button>
        <Button
          mode="contained"
          labelStyle={styles.buttonText}
          style={styles.button}
          disabled={isSubmitting}
          onPress={handleDisplayPick}
        >
          Allocate from display
        </Button>
        <Button mode="contained" labelStyle={styles.buttonText} style={styles.button} onPress={handleStockPick}>
          Allocate manually
        </Button>
      </View>

      {/* Temporarily hidden because it probably won't be needed. To be removed/shown later. */}
      {false && (
        <View style={styles.partialInputContainer}>
          {/* Label + Input */}
          <View style={styles.inputRow}>
            <Paragraph style={styles.inputLabel}>Enter Partial Quantity From Display:</Paragraph>

            <View style={styles.inputWrapper}>
              <TextInput
                autoCompleteType="off"
                mode="outlined"
                value={partialQuantity !== null ? partialQuantity?.toString() : ''}
                placeholder="Enter Partial Qty"
                keyboardType="numeric"
                style={styles.input}
                onChangeText={(text) => {
                  const parsed = parseInt(text, 10);
                  setPartialQuantity(text && !isNaN(parsed) ? parsed : null);
                }}
              />
            </View>
          </View>

          {/* Confirm button */}
          <Button
            mode="contained"
            icon="check"
            labelStyle={styles.buttonText}
            style={styles.confirmButton}
            onPress={handleConfirm}
          >
            Confirm Quantity
          </Button>
        </View>
      )}

      <StockPickModal
        visible={isStockPickOpen}
        orderLine={orderLine}
        onDismiss={() => setIsStockPickOpen(false)}
        onConfirm={handleManualAllocation}
      />
    </View>
  );
}

type StockPickModalProps = {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: (rows: AvailableItem[]) => void;
  orderLine: AllocationOrderLine;
};

function StockPickModal({ visible, onDismiss: onClose, onConfirm: onSave, orderLine }: StockPickModalProps) {
  const [rows, setRows] = useState<AvailableItem[]>([]);

  useEffect(() => {
    if (visible && orderLine?.availableItems) {
      const allocationsMap = new Map();

      if (orderLine.allocations) {
        orderLine.allocations.forEach((allocation: any) => {
          const invId = allocation.inventoryItemId || '';
          const binId = allocation.binLocationId || '';
          const key = `${invId}-${binId}`;
          allocationsMap.set(key, allocation);
        });
      }

      const filteredItems = orderLine.availableItems.filter((item) => {
        const invId = item['inventoryItem.id'] || '';
        const binId = item.binLocation?.id || '';
        const key = `${invId}-${binId}`;

        const hasAllocation = allocationsMap.has(key) && allocationsMap.get(key) > 0;
        const hasAvailability = item.quantityAvailable > 0;
        return hasAvailability || hasAllocation;
      });

      const preparedData = filteredItems.map((item, index) => {
        const invId = item['inventoryItem.id'] || '';
        const binId = item.binLocation?.id || '';
        const key = `${invId}-${binId}`;

        const existingAllocation = allocationsMap.get(key);
        const savedQuantity = existingAllocation ? existingAllocation.quantity : 0;
        const allocationId = existingAllocation ? existingAllocation.id : undefined;

        return {
          ...item,
          _localId: `loc-${item.binLocation?.id || 'null'}-idx-${index}`,
          id: allocationId,
          quantityAllocated: savedQuantity ? String(savedQuantity) : ''
        };
      });

      setRows(preparedData);
    }
  }, [visible, orderLine]);

  const totalAllocated = rows.reduce((sum, row) => {
    const qty = parseInt(row.quantityAllocated, 10);
    return sum + (isNaN(qty) ? 0 : qty);
  }, 0);

  const isQuantityRequiredExceeded = totalAllocated > orderLine.quantityRequired;

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

  const displayLocations = rows.filter((row) => row.binLocation?.isDisplay);
  const warehouseLocations = rows.filter((row) => !row.binLocation?.isDisplay);

  const renderRowsGroup = (items: AvailableItem[]) => {
    return items.map((row) => (
      <DataTable.Row key={row._localId} style={{ borderBottomWidth: 0 }}>
        <DataTable.Cell style={{ paddingLeft: 16 }}>{row.binLocation?.locationNumber ?? 'Default'}</DataTable.Cell>

        <DataTable.Cell numeric>{row.quantityAvailable}</DataTable.Cell>

        <DataTable.Cell numeric>
          <TextInput
            autoCompleteType="off"
            mode="outlined"
            keyboardType="numeric"
            value={row.quantityAllocated}
            style={styles.cellInput}
            onChangeText={(v) => updateQty(row._localId, v)}
          />
        </DataTable.Cell>
      </DataTable.Row>
    ));
  };

  return (
    <Modal transparent animationType="slide" visible={visible} onDismiss={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Headline>Allocate manually</Headline>

          <Paragraph>
            Product: {orderLine.product.productCode} | {orderLine.product.name}
          </Paragraph>
          <Paragraph
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              fontWeight: 'bold',
              color: isQuantityRequiredExceeded ? Theme.colors.error : Theme.colors.text
            }}
          >
            Quantity Allocated: {totalAllocated} / {orderLine.quantityRequired}
          </Paragraph>

          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Bin Location</DataTable.Title>
              <DataTable.Title numeric>Available</DataTable.Title>
              <DataTable.Title numeric>Allocated</DataTable.Title>
            </DataTable.Header>

            <ScrollView style={styles.scrollableContent}>
              {displayLocations.length > 0 && (
                <>
                  <View style={{ backgroundColor: '#f0f0f0', paddingVertical: 8, paddingHorizontal: 4 }}>
                    <Paragraph style={{ fontWeight: 'bold', color: Theme.colors.primary }}>Display</Paragraph>
                  </View>
                  {renderRowsGroup(displayLocations)}
                </>
              )}

              {warehouseLocations.length > 0 && (
                <>
                  <View
                    style={{
                      backgroundColor: '#f0f0f0',
                      paddingVertical: 8,
                      paddingHorizontal: 4,
                      marginTop: displayLocations.length > 0 ? 8 : 0
                    }}
                  >
                    <Paragraph style={{ fontWeight: 'bold', color: Theme.colors.text }}>Warehouse</Paragraph>
                  </View>
                  {renderRowsGroup(warehouseLocations)}
                </>
              )}

              {rows.length === 0 && (
                // eslint-disable-next-line react-native/no-inline-styles
                <Paragraph style={{ textAlign: 'center', marginTop: 20 }}>No available stock found.</Paragraph>
              )}
            </ScrollView>
          </DataTable>

          <View style={styles.actionButtons}>
            <Button onPress={onClose}>Cancel</Button>
            <Button
              mode="contained"
              style={styles.leftMargin}
              disabled={isQuantityRequiredExceeded}
              onPress={() => onSave(rows)}
            >
              Save
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
