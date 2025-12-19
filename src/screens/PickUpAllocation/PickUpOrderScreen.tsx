import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
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

  const [pickedLines, setPickedLines] = useState<number>(0);
  const [allPickedAlertShown, setAllPickedAlertShown] = useState(false);

  const [fullOrder, setFullOrder] = useState<any>(null);

  const handleLinePicked = React.useCallback(() => {
    setPickedLines((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await getOutboundOrderDetails(orderId);
        setFullOrder(response.data || []);
      } catch (error) {
        Alert.alert('Error', 'Failed to load order details.');
      }
    };

    fetchDetails();
  }, [orderId]);

  const totalLines = fullOrder?.lineItems?.length ?? 0;

  useEffect(() => {
    if (totalLines > 0 && pickedLines === totalLines && !allPickedAlertShown) {
      setAllPickedAlertShown(true);
      showAllPickedDialog();
    }
  }, [allPickedAlertShown, pickedLines, totalLines]);

  const handleFinishAllocation = async (navigateToPicking: boolean) => {
    try {
      await updateOrderStatus(orderId, 'PICKING');

      // 2. Przekierowanie w zależności od wyboru
      if (navigateToPicking) {
        navigate('PickingPickType');
      } else {
        navigate('PickUpEntryScreen');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update order status.');
    }
  };

  const showAllPickedDialog = () => {
    Alert.alert(
      'All Lines Picked',
      'All lines for this order have been allocated.Would you like to self-pick this order?',
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
  };

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
              onPicked={handleLinePicked}
            />
          ))}
        </List.Section>
      </ScrollView>
    </View>
  );
}

function AllocationOrderItem({
  orderLine,
  onPicked,
  orderId
}: {
  orderLine: AllocationOrderLine;
  onPicked: () => void;
  orderId: string;
}) {
  const [expanded, setExpanded] = useState(true);
  const [isPicked, setIsPicked] = useState(false);

  const toggleExpanded = () => {
    if (!isPicked) {
      setExpanded(!expanded);
    }
  };

  const { product, quantityRequired } = orderLine;

  function handleMarkPicked() {
    setIsPicked(true);
    setExpanded(false);
    onPicked?.();
  }

  return (
    <List.Accordion
      title={`${product.name} (${product.productCode})`}
      description={isPicked ? `Quantity Picked: ${quantityRequired}` : `Quantity Required: ${quantityRequired}`}
      left={(props) => (
        <List.Icon
          {...props}
          icon={isPicked ? 'check-circle' : 'package-variant-closed'}
          color={isPicked ? Theme.colors.success : undefined}
        />
      )}
      expanded={expanded}
      // eslint-disable-next-line react-native/no-inline-styles
      style={[styles.accordion, isPicked && { opacity: 0.5 }]}
      titleStyle={styles.accordionTitle}
      descriptionStyle={styles.accordionDescription}
      onPress={toggleExpanded}
    >
      {!isPicked && (
        <View style={[styles.accordionContent, styles.paddingZero]}>
          <OrderLineController orderLine={orderLine} orderId={orderId} onPicked={handleMarkPicked} />
        </View>
      )}
    </List.Accordion>
  );
}

function OrderLineController({
  onPicked,
  orderLine,
  orderId
}: {
  onPicked: () => void;
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

      Alert.alert('Success', 'Item allocated successfully', [{ text: 'OK', onPress: onPicked }]);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Allocation failed');
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
          onPress: onPicked
        }
      ]
    );
  }

  function handleWarehousePick() {
    Alert.alert('Full Warehouse Pick', 'Confirm full warehouse pick?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', onPress: () => handleAutoPick('WAREHOUSE_PICK') }
    ]);
  }

  function handleDisplayPick() {
    Alert.alert('Full Display Pick', 'Confirm full display pick?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', onPress: () => handleAutoPick('DISPLAY_PICK') }
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
          Full Warehouse Pick
        </Button>
        <Button
          mode="contained"
          labelStyle={styles.buttonText}
          style={styles.button}
          disabled={isSubmitting}
          onPress={handleDisplayPick}
        >
          Full Display Pick
        </Button>
        <Button mode="contained" labelStyle={styles.buttonText} style={styles.button} onPress={handleStockPick}>
          Stock Pick
        </Button>
      </View>

      <View style={styles.partialInputContainer}>
        {/* Label + Input */}
        <View style={styles.inputRow}>
          <Paragraph style={styles.inputLabel}>Enter Partial Quantity From Display:</Paragraph>

          <View style={styles.inputWrapper}>
            <TextInput
              autoCompleteType="off"
              mode="outlined"
              value={partialQuantity !== null ? partialQuantity.toString() : ''}
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

      <StockPickModal
        visible={isStockPickOpen}
        orderLine={orderLine}
        onDismiss={() => setIsStockPickOpen(false)}
        onConfirm={onPicked}
      />
    </View>
  );
}

type StockPickModalProps = {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
  orderLine: AllocationOrderLine;
};

function StockPickModal({ visible, onDismiss: onClose, onConfirm: onSave, orderLine }: StockPickModalProps) {
  const [rows, setRows] = useState<AvailableItem[]>([]);

  useEffect(() => {
    if (visible && orderLine?.availableItems) {
      const preparedData = orderLine.availableItems.map((item, index) => ({
        ...item,
        _localId: `loc-${item.binLocation?.id || 'null'}-idx-${index}`,
        quantityPicked: item.quantityPicked ? String(item.quantityPicked) : '0'
      }));
      setRows(preparedData);
    }
  }, [visible, orderLine]);

  const totalPicked = rows.reduce((sum, row) => {
    const qty = parseInt(row.quantityPicked, 10);
    return sum + (isNaN(qty) ? 0 : qty);
  }, 0);

  const isQuantityRequiredExceeded = totalPicked > orderLine.quantityRequired;

  function updateQty(localId: string, text: string) {
    if (text === '') {
      setRows((prev) => prev.map((row) => (row._localId === localId ? { ...row, quantityPicked: '' } : row)));
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

          return { ...row, quantityPicked: String(cappedValue) };
        }
        return row;
      })
    );
  }

  return (
    <Modal transparent animationType="slide" visible={visible} onDismiss={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Headline>Stock Pick</Headline>

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
            Quantity Picked: {totalPicked} / {orderLine.quantityRequired}
          </Paragraph>

          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Bin Location</DataTable.Title>
              <DataTable.Title numeric>Available</DataTable.Title>
              <DataTable.Title numeric>Picked</DataTable.Title>
            </DataTable.Header>

            <ScrollView style={styles.scrollableContent}>
              {rows.map((row) => (
                <DataTable.Row key={row.binLocation?.id}>
                  <DataTable.Cell>{row.binLocation?.locationNumber ?? 'Default'}</DataTable.Cell>
                  <DataTable.Cell numeric>{row.quantityAvailable}</DataTable.Cell>
                  <DataTable.Cell numeric>
                    <TextInput
                      autoCompleteType="off"
                      mode="outlined"
                      keyboardType="numeric"
                      value={row.quantityPicked}
                      style={styles.cellInput}
                      onChangeText={(v) => updateQty(row._localId, v)}
                    />
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </ScrollView>
          </DataTable>

          <View style={styles.actionButtons}>
            <Button onPress={onClose}>Cancel</Button>
            <Button mode="contained" style={styles.leftMargin} disabled={isQuantityRequiredExceeded} onPress={onSave}>
              Save
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
