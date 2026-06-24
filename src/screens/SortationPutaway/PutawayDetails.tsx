import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Caption, Chip, Divider, Title } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { EMPTY_FALLBACK } from '../../constants';
import { SortationTask } from '../../types/sortation';
import Theme from '../../utils/Theme';
import styles from './styles';

type PutawayDetailsProps = {
  putawayDetails: SortationTask;
  taskIndex?: number;
  totalTasks?: number;
  showTaskCounter?: boolean;
  onOverrideDestination?: () => void;
};

export default function PutawayDetails({
  putawayDetails,
  taskIndex,
  totalTasks,
  showTaskCounter = true,
  onOverrideDestination
}: PutawayDetailsProps) {
  if (!putawayDetails) {
    return null;
  }

  const { inventoryItem, quantity, container, destination } = putawayDetails;
  const destinationName = destination?.name ?? EMPTY_FALLBACK;

  return (
    <View style={styles.productDetails}>
      {showTaskCounter && taskIndex !== undefined && totalTasks !== undefined && (
        <>
          <View style={styles.headerRow}>
            <Chip icon="navigation" style={styles.chipDefault} textStyle={styles.chipText}>
              Tasks:{' '}
              <Text style={styles.bold}>
                {taskIndex + 1} / {totalTasks}
              </Text>
            </Chip>
          </View>

          <Divider style={styles.contentDivider} />
        </>
      )}

      <Title style={styles.title}>{inventoryItem?.product?.productCode}</Title>
      <Caption style={styles.caption}>{inventoryItem?.product?.name}</Caption>

      <Chip icon="identifier" style={[styles.chipDefault, styles.topSpace]} textStyle={styles.chipText}>
        <Text>
          Putaway Container ID: <Text style={styles.bold}>{container?.locationNumber ?? EMPTY_FALLBACK}</Text>
        </Text>
      </Chip>

      {onOverrideDestination ? (
        <View style={[styles.chipDestination, styles.topSpace]}>
          <MaterialCommunityIcons
            name="map-marker"
            size={16}
            color={Theme.colors.text}
            style={styles.chipDestinationIcon}
          />
          <Text style={[styles.chipText, styles.chipDestinationLabel]} numberOfLines={1}>
            Destination: <Text style={styles.bold}>{destinationName}</Text>
          </Text>
          <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} onPress={onOverrideDestination}>
            <Text style={styles.overrideLink}>Override</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Chip icon="map-marker" style={[styles.chipDefault, styles.topSpace]} textStyle={styles.chipText}>
          <Text>
            Destination: <Text style={styles.bold}>{destinationName}</Text>
          </Text>
        </Chip>
      )}

      <Chip icon="cube" style={[styles.chipDefault, styles.topSpace]} textStyle={styles.chipText}>
        <Text>
          Putaway Quantity: <Text style={styles.bold}>{quantity ?? EMPTY_FALLBACK}</Text>
        </Text>
      </Chip>
    </View>
  );
}
