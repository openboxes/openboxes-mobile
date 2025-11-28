import * as React from 'react';
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { Badge, Button, TextInput as PaperTextInput, Paragraph, Subheading, Title } from 'react-native-paper';

import Icon, { Name } from '../../components/Icon';
import { navigate } from '../../NavigationService';
import { DeliveryType } from '../../types/picking';
import Theme from '../../utils/Theme';
import { DELIVERY_TYPES } from './constants';
import { usePickingContext } from './PickingContext';
import styles from './styles';

const NUMBER_OF_ORDERS_THRESHOLD = 10;

export default function PickingPickTypeScreen() {
  const { startSession, currentTaskIndex } = usePickingContext();
  const [deliveryType, setDeliveryType] = React.useState<DeliveryType | null>(DELIVERY_TYPES[0]);
  const [numberOfOrdersToGroup, setNumberOfOrdersToGroup] = React.useState<string>('');

  React.useEffect(() => {
    setDeliveryType(DELIVERY_TYPES[0]);
    setNumberOfOrdersToGroup('');
  }, [currentTaskIndex]);

  const isSelected = (type: DeliveryType) => deliveryType?.label === type.label;

  async function handleConfirmQuantity() {
    const ordersCount = Number(numberOfOrdersToGroup);

    if (ordersCount > NUMBER_OF_ORDERS_THRESHOLD) {
      Alert.alert(
        'Max Number Exceeded',
        `The maximum number of orders to group is ${NUMBER_OF_ORDERS_THRESHOLD}. Please adjust your input.`
      );
      return;
    }

    if (!deliveryType || !numberOfOrdersToGroup) {
      Alert.alert(
        'Missing Information',
        'Please select a pick type and specify the number of orders to group before proceeding.'
      );
      return;
    }

    // This function initializes the picking session with the selected parameters
    // and returns whether the session was started successfully.
    const isValid = await startSession(deliveryType, ordersCount);

    isValid && navigate('PickingPickLocation');
  }

  return (
    <ScrollView
      style={styles.mainWrapper}
      contentContainerStyle={{ paddingBottom: Theme.spacing.large }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.wrapperWithPadding}>
        <Title>Select Pick Type and Grouping</Title>
        <Paragraph>Please select the appropriate pick type and specify the number of orders to group.</Paragraph>
      </View>

      <View>
        {DELIVERY_TYPES.map((item) => (
          <View key={item.label} style={styles.cardWrapper}>
            <TouchableOpacity onPress={() => setDeliveryType(item)}>
              <View style={[styles.typeCard, isSelected(item) && styles.selectedCard]}>
                <View style={styles.contentWrapper}>
                  <Subheading style={styles.cardLabel}>{item.label}</Subheading>
                  <Badge visible={!!item.priority} style={styles.priorityBadge}>
                    {item.priority ? `P${item.priority}` : ''}
                  </Badge>
                </View>

                {isSelected(item) && <Icon name={Name.Check} size={20} color={Theme.colors.primary} />}
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.formWrapper}>
        <PaperTextInput
          autoCompleteType="off"
          style={styles.marginTopSmall}
          label="Number of Orders to Group"
          mode="outlined"
          keyboardType="numeric"
          value={numberOfOrdersToGroup}
          onChangeText={setNumberOfOrdersToGroup}
        />

        <Button
          mode="contained"
          style={styles.marginTop}
          disabled={!deliveryType || !numberOfOrdersToGroup}
          onPress={handleConfirmQuantity}
        >
          Confirm Quantity
        </Button>
      </View>
    </ScrollView>
  );
}
