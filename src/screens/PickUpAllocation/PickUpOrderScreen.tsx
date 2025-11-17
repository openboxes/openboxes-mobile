import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { Button, List, Paragraph, TextInput, Title } from 'react-native-paper';

import EmptyView from '../../components/EmptyView';
import styles from './styles';
import { AllocationOrder, AllocationOrderLine } from './types';

type QuantityRouteProp = RouteProp<{ PickUpOrderScreen: { order: AllocationOrder } }, 'PickUpOrderScreen'>;

export function PickUpOrderScreen() {
  const { params } = useRoute<QuantityRouteProp>();
  const { order } = params;

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
            <AllocationOrderItem key={`${line.product.productCode}-${index}`} orderLine={line} />
          ))}
        </List.Section>
      </ScrollView>
    </View>
  );
}

function AllocationOrderItem({ orderLine }: { orderLine: AllocationOrderLine }) {
  const [expanded, setExpanded] = React.useState(false);
  const toggleExpanded = () => setExpanded(!expanded);

  const { product, quantityRequired } = orderLine;

  return (
    <List.Accordion
      title={`${product.name} (${product.productCode})`}
      description={`Quantity Required: ${quantityRequired}`}
      left={(props) => <List.Icon {...props} icon="package-variant-closed" />}
      expanded={expanded}
      style={styles.accordion}
      titleStyle={styles.accordionTitle}
      descriptionStyle={styles.accordionDescription}
      onPress={toggleExpanded}
    >
      <View style={[styles.accordionContent, styles.paddingZero]}>
        <OrderLineController />
      </View>
    </List.Accordion>
  );
}

function OrderLineController() {
  const [partialQuantity, setPartialQuantity] = React.useState<number | null>(null);

  function handleConfirm() {
    // Placeholder for confirm action
  }

  function handleWarehousePick() {
    // Placeholder for full warehouse pick action
  }

  function handleDisplayPick() {
    // Placeholder for full display pick action
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
