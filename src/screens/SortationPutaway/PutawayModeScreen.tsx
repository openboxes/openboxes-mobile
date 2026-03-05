import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useMemo } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Avatar, Chip, Divider, Paragraph, Subheading } from 'react-native-paper';

import { SortationTask } from '../../types/sortation';
import styles from './styles';
import Icon from '../../components/Icon';

type RootStackParamList = {
  SortationPutawayLocationScan: {
    taskList: SortationTask[];
    currentTaskIndex: number;
  };
  SortationPutawayTaskList: {
    containerId: string;
    taskList: SortationTask[];
  };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

type PutawayModeScreenProps = {
  route: {
    params: {
      containerId: string;
      taskList: SortationTask[];
    };
  };
};

function ModeCard({
  title,
  description,
  icon,
  onPress
}: {
  title: string;
  description: string;
  icon: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.modeCardContainer} activeOpacity={0.8} onPress={onPress}>
      <View style={styles.modeCardLeft}>
        <Avatar.Icon size={40} icon={icon} style={styles.modeCardAvatar} />
      </View>
      <View style={styles.modeCardContent}>
        <Text style={styles.modeCardTitle}>{title}</Text>
        <Text style={styles.modeCardDescription}>{description}</Text>
      </View>
      <View style={styles.modeCardRight} focusable={false}>
        <Icon name={7} focusable={false} />
      </View>
    </TouchableOpacity>
  );
}

export default function PutawayModeScreen({ route }: PutawayModeScreenProps) {
  const { containerId, taskList } = route.params;
  const navigation = useNavigation<NavigationProp>();

  const taskSummary = useMemo(() => {
    const zones = new Set(taskList.map((task) => task.destination?.zoneName).filter(Boolean));
    return {
      totalItems: taskList.length,
      totalZones: zones.size
    };
  }, [taskList]);

  const handleSystemDirected = () => {
    navigation.navigate('SortationPutawayLocationScan', {
      taskList,
      currentTaskIndex: 0
    });
  };

  const handleUserDirected = () => {
    navigation.navigate('SortationPutawayTaskList', {
      containerId,
      taskList
    });
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      style={styles.contentWrapper}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.productDetails}>
        <View style={styles.headerRow}>
          <Chip icon="identifier" style={styles.chipDefault} textStyle={styles.chipText} focusable={false}>
            Container Id: {containerId}
          </Chip>
          <Chip icon="package" style={styles.chipDefault} textStyle={styles.chipText} focusable={false}>
            Tasks: {taskSummary.totalItems}
          </Chip>
        </View>
      </View>

      <Divider />

      <View style={styles.formContainer}>
        <Subheading style={styles.subheading}>Choose a Putaway Mode</Subheading>
        <Paragraph style={styles.paragraph}>Select how you want to manage your putaway tasks.</Paragraph>

        <ModeCard
          title="System Directed"
          description="Follow the recommended putaway sequence"
          icon="map-marker-path"
          onPress={handleSystemDirected}
        />

        <ModeCard
          title="User Directed"
          description="Select tasks in any order and putaway as you go"
          icon="account-group"
          onPress={handleUserDirected}
        />
      </View>
    </ScrollView>
  );
}
