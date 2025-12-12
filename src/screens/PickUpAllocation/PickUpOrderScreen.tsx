import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { Alert, Modal, ScrollView, View } from 'react-native';
import { Button, DataTable, Headline, List, Paragraph, TextInput, Title } from 'react-native-paper';

import EmptyView from '../../components/EmptyView';
import Theme from '../../utils/Theme';
import styles from './styles';
import { AllocationOrder, AllocationOrderLine } from './types';

type PickUpOrderRouteProp = RouteProp<{ PickUpOrderScreen: { order: AllocationOrder } }, 'PickUpOrderScreen'>;

export function PickUpOrderScreen() {
  const { params } = useRoute<PickUpOrderRouteProp>();
  const { order } = params;

  const totalLines = order?.orderLines?.length ?? 0;
  const [pickedLines, setPickedLines] = React.useState<number>(0);
  const [allPickedAlertShown, setAllPickedAlertShown] = React.useState(false);

  const handleLinePicked = React.useCallback(() => {
    setPickedLines((prev) => prev + 1);
  }, []);

  React.useEffect(() => {
    if (totalLines > 0 && pickedLines === totalLines && !allPickedAlertShown) {
      setAllPickedAlertShown(true);
      showAllPickedDialog();
    }
  }, [allPickedAlertShown, pickedLines, totalLines]);

  const showAllPickedDialog = () => {
    Alert.alert(
      'All Lines Picked',
      'All lines for this order have been allocated.Would you like to self-pick this order?',
      [
        {
          text: 'No',
          style: 'cancel',
          onPress: () => {}
        },
        {
          text: 'Yes',
          onPress: () => {}
        }
      ]
    );
  };

  if (!order || !order.orderLines) {
    return (
      <EmptyView
        title="No Order Data Available"
        description="It looks like there are no order lines available for this order."
      />
    );
  }

  return (
    <View style={styles.screenContainer}>
      <Title style={styles.titleText}>Order Line Allocation ({order.orderLines.length})</Title>

      <ScrollView>
        <List.Section>
          {order.orderLines.map((line, index) => (
            <AllocationOrderItem
              key={`${line.product.productCode}-${index}`}
              orderLine={line}
              onPicked={handleLinePicked}
            />
          ))}
        </List.Section>
      </ScrollView>
    </View>
  );
}

function AllocationOrderItem({ orderLine, onPicked }: { orderLine: AllocationOrderLine; onPicked: () => void }) {
  const [expanded, setExpanded] = React.useState(true);
  const [isPicked, setIsPicked] = React.useState(false);

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
          <OrderLineController orderLine={orderLine} onPicked={handleMarkPicked} />
        </View>
      )}
    </List.Accordion>
  );
}

function OrderLineController({ onPicked, orderLine }: { onPicked: () => void; orderLine: AllocationOrderLine }) {
  const [partialQuantity, setPartialQuantity] = React.useState<number | null>(null);
  const [isStockPickOpen, setIsStockPickOpen] = React.useState(false);

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
      { text: 'Confirm', onPress: onPicked }
    ]);
  }

  function handleDisplayPick() {
    Alert.alert('Full Display Pick', 'Confirm full display pick?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', onPress: onPicked }
    ]);
  }

  function handleStockPick() {
    setIsStockPickOpen(true);
  }

  return (
    <View>
      <View style={styles.buttonRow}>
        <Button mode="contained" labelStyle={styles.buttonText} style={styles.button} onPress={handleWarehousePick}>
          Full Warehouse Pick
        </Button>
        <Button mode="contained" labelStyle={styles.buttonText} style={styles.button} onPress={handleDisplayPick}>
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

type StockRow = {
  id: string;
  binLocation: string;
  availableQty: number;
  onHandQty?: number;
  pickedQty: string;
};

const MOCK_STOCK_ROWS: StockRow[] = [
  { id: 'A1', binLocation: 'WH-A1-01', availableQty: 12, pickedQty: '0' },
  { id: 'A2', binLocation: 'WH-A1-02', availableQty: 8, pickedQty: '0' },
  { id: 'B1', binLocation: 'DP-B1-01', availableQty: 5, pickedQty: '0' },
  { id: 'B2', binLocation: 'DP-B1-02', availableQty: 3, pickedQty: '0' },
  { id: 'C1', binLocation: 'BACK-C1', availableQty: 20, pickedQty: '0' },
  { id: 'C2', binLocation: 'BACK-C2', availableQty: 15, pickedQty: '0' },
  { id: 'D1', binLocation: 'FRONT-D1', availableQty: 6, pickedQty: '0' }
];

type StockPickModalProps = {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
  orderLine: AllocationOrderLine;
};

function StockPickModal({ visible, onDismiss: onClose, onConfirm: onSave, orderLine }: StockPickModalProps) {
  const [rows, setRows] = React.useState<StockRow[]>([]);

  /**
   * Fetch available stock for the current order line item.
   * For now, we are using mocked data until backend integration is ready.
   */
  function fetchAvailableStock() {
    // TODO: Replace with real API call
    // eslint-disable-next-line no-restricted-syntax
    console.log(orderLine);
    setRows(MOCK_STOCK_ROWS);
  }

  const fetchAvailableStockMemo = React.useCallback(fetchAvailableStock, [orderLine]);

  React.useEffect(() => {
    if (visible) {
      fetchAvailableStockMemo();
    }
  }, [fetchAvailableStockMemo, visible]);

  function updateQty(id: string, value: string) {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, pickedQty: value } : row)));
  }

  return (
    <Modal transparent animationType="slide" visible={visible} onDismiss={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Headline>Stock Pick</Headline>

          <Paragraph>
            Product: {orderLine.product.productCode} | {orderLine.product.name}
          </Paragraph>
          <Paragraph>Quantity Picked: 0 / {orderLine.quantityRequired}</Paragraph>

          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Bin Location</DataTable.Title>
              <DataTable.Title numeric>Available</DataTable.Title>
              <DataTable.Title numeric>Picked</DataTable.Title>
            </DataTable.Header>

            <ScrollView style={styles.scrollableContent}>
              {rows.map((row) => (
                <DataTable.Row key={row.id}>
                  <DataTable.Cell>{row.binLocation}</DataTable.Cell>
                  <DataTable.Cell numeric>{row.availableQty}</DataTable.Cell>
                  <DataTable.Cell numeric>
                    <TextInput
                      autoCompleteType="off"
                      mode="outlined"
                      keyboardType="numeric"
                      value={row.pickedQty}
                      style={styles.cellInput}
                      onChangeText={(v) => updateQty(row.id, v)}
                    />
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </ScrollView>
          </DataTable>

          <View style={styles.actionButtons}>
            <Button onPress={onClose}>Cancel</Button>
            <Button mode="contained" style={styles.leftMargin} onPress={onSave}>
              Save
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
