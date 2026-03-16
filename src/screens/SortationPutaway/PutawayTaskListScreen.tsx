import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Button, Chip, Divider, Paragraph } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import Icon, { Name } from '../../components/Icon';
import { ScannerInput } from '../../components/ScannerInput';
import { getPutawayDetailsByContainerId } from '../../redux/actions/putaways';
import { RootState } from '../../redux/reducers';
import { SortationTask } from '../../types/sortation';
import styles from './styles';

type RootStackParamList = {
  SortationPutawayLocationScan: {
    currentTaskIndex: number;
    isUserDirected?: boolean;
    containerId?: string;
  };
  SortationPutawayTaskList: {
    containerId: string;
  };
};

type NavigationProp = StackNavigationProp<RootStackParamList, any>;

type TaskRowProps = {
  task: SortationTask;
  onPress: () => void;
};

function TaskRow({ task, onPress }: TaskRowProps) {
  const productCode = task.inventoryItem?.product?.productCode || '-';
  const location = task.destination?.locationNumber || '-';
  const quantity = task.quantity || 0;

  return (
    <TouchableOpacity style={styles.taskRow} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.taskRowContent}>
        <Text style={styles.taskRowProduct} numberOfLines={1}>
          {productCode}
        </Text>
        <Text style={styles.taskRowLocation} numberOfLines={1}>
          {location}
        </Text>
        <Text style={styles.taskRowQuantity}>{quantity}</Text>
      </View>
    </TouchableOpacity>
  );
}

type ZoneSectionProps = {
  zoneName: string;
  tasks: SortationTask[];
  onTaskPress: (index: number) => void;
  isExpanded: boolean;
  onToggle: () => void;
  taskCount: number;
};

function ZoneSection({ zoneName, tasks, onTaskPress, isExpanded, onToggle, taskCount }: ZoneSectionProps) {
  return (
    <View style={styles.zoneSection}>
      <TouchableOpacity style={styles.zoneHeader} activeOpacity={0.7} onPress={onToggle}>
        <View style={styles.zoneHeaderContent}>
          <Text style={styles.zoneHeaderLabel}>Zone</Text>
          <Text style={styles.zoneHeaderText}>
            {zoneName || 'Not Defined'} ({taskCount} Task{taskCount !== 1 ? 's' : ''})
          </Text>
        </View>
        <Icon name={isExpanded ? Name.ChevronUp : Name.ChevronDown} size={18} style={styles.zoneHeaderIcon} />
      </TouchableOpacity>
      {isExpanded &&
        tasks.map((task, index) => <TaskRow key={task.id} task={task} onPress={() => onTaskPress(index)} />)}
    </View>
  );
}

type PutawayTaskListScreenProps = {
  route: {
    params: {
      containerId: string;
    };
  };
};

export default function PutawayTaskListScreen({ route }: PutawayTaskListScreenProps) {
  const { containerId } = route.params;
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();
  const putawayTasks = useSelector((state: RootState) => state.putawayReducer.putawayTasks) as SortationTask[];
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedZones, setExpandedZones] = useState<{ [key: string]: boolean }>({});

  const fetchTasks = useCallback(() => {
    dispatch(getPutawayDetailsByContainerId(containerId));
  }, [dispatch, containerId]);

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [fetchTasks])
  );

  const filteredTasks = useMemo(() => {
    if (!putawayTasks) {
      return [];
    }
    if (!searchTerm.trim()) {
      return putawayTasks;
    }
    const term = searchTerm.toLowerCase().trim();
    return putawayTasks.filter((task) => {
      const productCode = task.inventoryItem?.product?.productCode?.toLowerCase() || '';
      return productCode.includes(term);
    });
  }, [searchTerm, putawayTasks]);

  const groupedTasks = useMemo(() => {
    if (!filteredTasks) {
      return [];
    }
    const groups: { [key: string]: SortationTask[] } = {};

    filteredTasks.forEach((task) => {
      const zoneName = task.destination?.zoneName || 'Not Defined';
      if (!groups[zoneName]) {
        groups[zoneName] = [];
      }
      groups[zoneName].push(task);
    });

    return Object.entries(groups).map(([zoneName, tasks]) => ({
      zoneName,
      tasks
    }));
  }, [filteredTasks]);

  useEffect(() => {
    if (searchTerm.trim() && filteredTasks.length === 1) {
      const matchedTask = filteredTasks[0];
      const globalIndex = putawayTasks.findIndex((t) => t.id === matchedTask.id);
      setSearchTerm('');
      navigation.navigate('SortationPutawayLocationScan', {
        currentTaskIndex: globalIndex >= 0 ? globalIndex : 0,
        isUserDirected: true,
        containerId
      });
    }
  }, [searchTerm, filteredTasks, putawayTasks, navigation, containerId]);

  const isSearching = searchTerm.trim().length > 0;

  const isZoneExpanded = (zoneName: string) => {
    if (isSearching) {
      return true;
    }
    return expandedZones[zoneName] ?? true;
  };

  const toggleZone = (zoneName: string) => {
    setExpandedZones((prev) => ({
      ...prev,
      [zoneName]: !(prev[zoneName] ?? true)
    }));
  };

  const handleTaskPress = (zoneName: string, taskIndex: number) => {
    const zoneTasks = groupedTasks.find((g) => g.zoneName === zoneName);
    if (!zoneTasks) {
      return;
    }

    const selectedTask = zoneTasks.tasks[taskIndex];
    const globalIndex = putawayTasks.findIndex((t) => t.id === selectedTask.id);

    setSearchTerm('');

    navigation.navigate('SortationPutawayLocationScan', {
      currentTaskIndex: globalIndex >= 0 ? globalIndex : 0,
      isUserDirected: true,
      containerId
    });
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      style={styles.contentWrapper}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.productDetails}>
        <View style={styles.headerRow}>
          <Chip icon="identifier" style={styles.chipDefault} textStyle={styles.chipText}>
            Container: <Text style={styles.bold}>{containerId}</Text>
          </Chip>
        </View>
        <ScannerInput
          value={searchTerm}
          label="Product"
          style={styles.topSpace}
          onChange={setSearchTerm}
          onSubmit={setSearchTerm}
        />
        {searchTerm.length > 0 && (
          <Button mode="contained" style={styles.clearButton} onPress={handleClearSearch}>
            Clear
          </Button>
        )}
      </View>

      <Divider />

      <View style={styles.formContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.tableHeaderProduct]}>Product</Text>
          <Text style={[styles.tableHeaderText, styles.tableHeaderLocation]}>Putaway Location</Text>
          <Text style={[styles.tableHeaderText, styles.tableHeaderQty]}>Quantity</Text>
        </View>
        {groupedTasks.length === 0 ? (
          <View style={styles.emptyTableContent}>
            <Paragraph style={styles.emptyText}>No tasks found</Paragraph>
          </View>
        ) : (
          groupedTasks.map((group) => (
            <ZoneSection
              key={group.zoneName}
              zoneName={group.zoneName}
              tasks={group.tasks}
              taskCount={group.tasks.length}
              isExpanded={isZoneExpanded(group.zoneName)}
              onToggle={() => toggleZone(group.zoneName)}
              onTaskPress={(taskIndex) => handleTaskPress(group.zoneName, taskIndex)}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}
