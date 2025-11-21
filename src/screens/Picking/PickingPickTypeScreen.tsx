import * as React from 'react';
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { Badge, Button, TextInput as PaperTextInput, Paragraph, Subheading, Title } from 'react-native-paper';

import Icon, { Name } from '../../components/Icon';
import { navigate } from '../../NavigationService';
import Theme from '../../utils/Theme';
import { usePickingContext } from './PickingContext';
import styles from './styles';
import { PickType } from './types';

const PICK_TYPES: PickType[] = [
  { priority: 1, label: 'Pick Up' },
  { priority: 2, label: 'Local Delivery' },
  { priority: 2, label: 'Service' },
  { priority: 3, label: 'Will Call' },
  { priority: 4, label: 'Ship To' },
  { priority: undefined, label: 'System Directed' }
];

const NUMBER_OF_ORDERS_THRESHOLD = 10;

export default function PickingPickTypeScreen() {
  const { startSession, currentTaskIndex } = usePickingContext();
  const [selectedType, setSelectedType] = React.useState<PickType | null>(PICK_TYPES[0]);
  const [numberOfOrdersToGroup, setNumberOfOrdersToGroup] = React.useState<string>('');

  React.useEffect(() => {
    setSelectedType(PICK_TYPES[0]);
    setNumberOfOrdersToGroup('');
  }, [currentTaskIndex]);

  const isSelected = (type: PickType) => selectedType?.label === type.label;

  async function handleConfirmQuantity() {
    const quantity = Number(numberOfOrdersToGroup);

    if (quantity > NUMBER_OF_ORDERS_THRESHOLD) {
      Alert.alert(
        'Max Number Exceeded',
        `The maximum number of orders to group is ${NUMBER_OF_ORDERS_THRESHOLD}. Please adjust your input.`
      );
      return;
    }

    if (!selectedType || !numberOfOrdersToGroup) {
      Alert.alert(
        'Missing Information',
        'Please select a pick type and specify the number of orders to group before proceeding.'
      );
      return;
    }

    // This will load the tasks (mocked or API) and reset the index to 0
    await startSession(selectedType, quantity);

    navigate('PickingPickLocation');
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
        {PICK_TYPES.map((item) => (
          <View key={item.label} style={styles.cardWrapper}>
            <TouchableOpacity onPress={() => setSelectedType(item)}>
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
          disabled
          autoCompleteType="off"
          label="Selected Pick Type"
          mode="outlined"
          value={
            selectedType
              ? selectedType.priority
                ? `P${selectedType.priority} - ${selectedType.label}`
                : selectedType.label
              : ''
          }
        />

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
          disabled={!selectedType || !numberOfOrdersToGroup}
          onPress={handleConfirmQuantity}
        >
          Confirm Quantity
        </Button>
      </View>
    </ScrollView>
  );
}
