import { useIsFocused } from '@react-navigation/native';
import * as React from 'react';
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { Button, RadioButton, TextInput as PaperTextInput, Paragraph, Title } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import { navigate } from '../../NavigationService';
import { getPickTaskCountsAction } from '../../redux/actions/picking';
import { DeliveryType, DeliveryTypeCode, DeliveryTypeOrderCount } from '../../types/picking';
import Theme from '../../utils/Theme';
import { DELIVERY_TYPES, PRIORITY_LABELS } from './constants';
import { usePickingContext } from './PickingContext';
import styles from './styles';

const NUMBER_OF_ORDERS_THRESHOLD = 10;

export default function PickingPickTypeScreen() {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const { startSession, currentTaskIndex } = usePickingContext();
  const [deliveryType, setDeliveryType] = React.useState<DeliveryType | null>(DELIVERY_TYPES[0]);
  const [numberOfOrdersToGroup, setNumberOfOrdersToGroup] = React.useState<string>('');
  const [counts, setCounts] = React.useState<Record<string, DeliveryTypeOrderCount>>({});

  const fetchCounts = React.useCallback(() => {
    dispatch(
      getPickTaskCountsAction(({ response, errorMessage }) => {
        if (errorMessage || !response?.data) {
          Alert.alert('Error', 'Failed to load pick task counts. Please try again.');
          return;
        }
        const byCode = response.data.reduce<Record<string, DeliveryTypeOrderCount>>((acc, item) => {
          acc[item.deliveryTypeCode] = item;
          return acc;
        }, {});
        setCounts(byCode);
      })
    );
  }, [dispatch]);

  React.useEffect(() => {
    setDeliveryType(DELIVERY_TYPES[0]);
    setNumberOfOrdersToGroup('');
  }, [currentTaskIndex]);

  React.useEffect(() => {
    if (isFocused) {
      fetchCounts();
    }
  }, [isFocused, fetchCounts]);

  const isSelected = (type: DeliveryType) => deliveryType?.label === type.label;

  async function handleRetrievePickTasks() {
    const ordersCount = Number(numberOfOrdersToGroup);

    // Validate that input is numeric and an integer within range
    if (
      !numberOfOrdersToGroup ||
      isNaN(ordersCount) ||
      !Number.isInteger(ordersCount) ||
      ordersCount < 1 ||
      ordersCount > NUMBER_OF_ORDERS_THRESHOLD
    ) {
      Alert.alert('Invalid Number', `Please enter a whole number between 1 and ${NUMBER_OF_ORDERS_THRESHOLD}.`);
      return;
    }

    if (!deliveryType) {
      Alert.alert(
        'Missing Information',
        'Please select a pick type and specify the number of orders to group before proceeding.'
      );
      return;
    }

    // This function initializes the picking session with the selected parameters
    // and returns whether the session was started successfully.
    const isValid = await startSession(deliveryType, ordersCount);

    if (!isValid) {
      // Retrieval failed (e.g. no tasks found) — the screen stays focused, so
      // refresh the counts here to correct any stale numbers
      fetchCounts();
      return;
    }

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

      <View style={styles.optionsCard}>
        {DELIVERY_TYPES.map((item, index) => {
          const selected = isSelected(item);
          const count = counts[item.code];
          const isEmpty = !count || count.availableCount === 0;
          const priorityLabel = item.code === DeliveryTypeCode.DEFAULT ? undefined : PRIORITY_LABELS[item.priority];
          const isLast = index === DELIVERY_TYPES.length - 1;

          return (
            <TouchableOpacity
              key={item.label}
              activeOpacity={0.7}
              style={[styles.optionRow, isLast && styles.optionRowLast, selected && styles.optionRowSelected]}
              onPress={() => setDeliveryType(item)}
            >
              <RadioButton
                value={item.code}
                color={Theme.colors.primary}
                status={selected ? 'checked' : 'unchecked'}
                onPress={() => setDeliveryType(item)}
              />

              <View style={styles.optionRowContent}>
                <View>
                  <Paragraph style={styles.optionTitle}>{item.label}</Paragraph>
                  {priorityLabel ? <Paragraph style={styles.optionSubtitle}>{priorityLabel}</Paragraph> : null}
                </View>

                {/* Count is always rendered: shows 0 until counts load */}
                <View style={styles.countWrapper}>
                  <Paragraph style={[styles.countValue, isEmpty && styles.countValueEmpty]}>
                    {count ? count.availableCount : 0}
                  </Paragraph>
                  <Paragraph style={styles.countCaption}>Orders</Paragraph>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.formWrapper}>
        <PaperTextInput
          autoCompleteType="off"
          style={[styles.marginTopSmall, styles.whiteInput]}
          label="Orders to Group"
          mode="outlined"
          keyboardType="numeric"
          value={numberOfOrdersToGroup}
          onChangeText={setNumberOfOrdersToGroup}
          onSubmitEditing={handleRetrievePickTasks}
        />

        <Button
          mode="contained"
          style={styles.marginTop}
          contentStyle={styles.ctaContent}
          disabled={!deliveryType || !numberOfOrdersToGroup}
          onPress={handleRetrievePickTasks}
        >
          Retrieve Pick Tasks
        </Button>
      </View>
    </ScrollView>
  );
}
