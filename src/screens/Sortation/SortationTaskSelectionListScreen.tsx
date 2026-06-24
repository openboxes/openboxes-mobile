import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, FlatList, View } from 'react-native';
import { Button, Card, Chip, Divider, Paragraph, Text, Title } from 'react-native-paper';

import { ContainerIcon, LocationIcon, QuantityIcon } from '../../components/Icons';
import { EMPTY_FALLBACK } from '../../constants';
import { navigate } from '../../NavigationService';
import { SortationProduct, SortationTask } from '../../types/sortation';
import styles from './styles';

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
                    <Text style={[styles.bold, styles.chipText]}>{`${item.identifier ?? EMPTY_FALLBACK}`}</Text>
                  </Chip>

                  <Chip style={styles.chipDefault} textStyle={styles.chipText}>
                    {`${item.status ?? EMPTY_FALLBACK}`}
                  </Chip>
                </View>

                <Divider style={styles.contentDivider} />

                <Chip icon="receipt" style={[styles.chipDefault]} textStyle={styles.chipText}>
                  ASN: <Text style={[styles.bold, styles.chipText]}>{`${item.shipmentNumber ?? EMPTY_FALLBACK}`}</Text>
                </Chip>
                <Chip icon="origin" style={[styles.chipDefault, styles.topSpace]} textStyle={styles.chipText}>
                  Origin:{' '}
                  <Text style={[styles.bold, styles.chipText]}>{`${item.location.name ?? EMPTY_FALLBACK}`}</Text>
                </Chip>
                <Chip
                  icon={() => <LocationIcon size={16} color="#000" />}
                  style={[styles.chipDefault, styles.topSpace]}
                  textStyle={styles.chipText}
                >
                  Destination:{' '}
                  <Text style={[styles.bold, styles.chipText]}>{`${item.destination?.name ?? EMPTY_FALLBACK}`}</Text>
                </Chip>
                <Chip
                  icon={() => <QuantityIcon size={16} color="#000" />}
                  style={[styles.chipDefault, styles.topSpace]}
                  textStyle={styles.chipText}
                >
                  Quantity: <Text style={[styles.bold, styles.chipText]}>{`${item.quantity ?? EMPTY_FALLBACK}`}</Text>
                </Chip>
                <Chip
                  icon={() => <ContainerIcon size={16} color="#000" />}
                  style={[styles.chipDefault, styles.topSpace]}
                  textStyle={styles.chipText}
                >
                  Container:{' '}
                  <Text style={[styles.bold, styles.chipText]}>{`${item.container?.name ?? EMPTY_FALLBACK}`}</Text>
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
