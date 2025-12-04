import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { Button, List, Paragraph, TextInput, Title } from 'react-native-paper';

import EmptyView from '../../components/EmptyView';
import Theme from '../../utils/Theme';
import styles from './styles';
import { AllocationOrder, AllocationOrderLine } from './types';

type QuantityRouteProp = RouteProp<{ PickUpOrderScreen: { order: AllocationOrder } }, 'PickUpOrderScreen'>;

export function PickUpOrderScreen() {
  const { params } = useRoute<QuantityRouteProp>();
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

  return (
    <View>
      <View style={styles.buttonRow}>
        <Button mode="contained" labelStyle={styles.buttonText} style={styles.button} onPress={handleWarehousePick}>
          Full Warehouse Pick
        </Button>
        <Button mode="contained" labelStyle={styles.buttonText} style={styles.button} onPress={handleDisplayPick}>
          Full Display Pick
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
              onChangeText={(text) => setPartialQuantity(text ? parseInt(text, 10) : null)}
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
    </View>
  );
}
