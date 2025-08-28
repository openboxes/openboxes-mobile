import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, FlatList, View } from 'react-native';
import { Button, Caption, Card, Chip, Divider, Paragraph, Text, Title } from 'react-native-paper';

import { HYPHEN } from '../../constants';
import styles from './styles';
import { SortationProduct, SortationTask } from './types';
import { navigate } from '../../NavigationService';

type TaskSelectionRouteProp = RouteProp<
  { SortationQuantity: { product: SortationProduct; tasks: SortationTask[] } },
  'SortationQuantity'
>;

export default function SortationTaskSelectionListScreen() {
  const { params } = useRoute<TaskSelectionRouteProp>();
  const { product, tasks } = params;

  const [selectedTask, setSelectedTask] = useState<SortationTask | null>(null);

  const onContinue = () => {
    if (!selectedTask) {
      Alert.alert('Validation Error', 'Please select a task to continue.');
      return;
    }

    if (!selectedTask.destination?.id) {
      Alert.alert('Validation Error', 'Selected task does not have a valid destination location.');
      return;
    }

    navigate('SortationQuantity', { product, task: selectedTask });
  };

  return (
    <View style={styles.screen}>
      <Title>{`Multiple Putaways (${tasks.length})`}</Title>
      <Paragraph>
        This{' '}
        <Text style={styles.bold}>
          {product.productCode} - {product.name}
        </Text>{' '}
        product is linked to more than one putaway. Choose the one you’d like to work with from the list below.
      </Paragraph>

      <Divider style={styles.topSpace} />

      {/* Task List */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isSelected = selectedTask?.id === item.id;
          return (
            <Card style={[styles.card, isSelected && styles.cardSelected]} onPress={() => setSelectedTask(item)}>
              <Card.Content style={styles.cardContent}>
                <View style={styles.headerRow}>
                  <Chip icon="barcode" style={styles.chipDefault} textStyle={styles.chipText}>
                    {`${item.putaway?.putawayNumber ?? HYPHEN}`}
                  </Chip>

                  <Chip style={[styles.chipDefault]} textStyle={styles.chipText}>
                    {`${item.status ?? HYPHEN}`}
                  </Chip>
                </View>

                <Divider style={styles.contentDivider} />

                <Title style={styles.title}>{`Location Name: ${item.location.name}`}</Title>
                <Caption style={styles.caption}> {`Location Number: ${item.location.locationNumber}`} </Caption>
                <Chip icon="package" style={[styles.chipDefault, styles.topSpace]} textStyle={styles.chipText}>
                  {`Quantity: ${item.quantity ?? HYPHEN}`}
                </Chip>
                <Chip icon="map-marker" style={[styles.chipDefault, styles.topSpace]} textStyle={styles.chipText}>
                  {`Final Storage Location: ${item.destination?.name ?? HYPHEN}`}
                </Chip>
              </Card.Content>
            </Card>
          );
        }}
      />

      <Divider style={styles.bottomSpace} />

      <View style={styles.topSpace}>
        <Button mode="contained" disabled={!selectedTask} onPress={onContinue}>
          Continue
        </Button>
      </View>
    </View>
  );
}
