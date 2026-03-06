import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useMemo } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Avatar, Chip, Divider, Paragraph, Subheading } from 'react-native-paper';
import { useSelector } from 'react-redux';

import Icon, { Name } from '../../components/Icon';
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

type PutawayModeScreenProps = {
  route: {
    params: {
      containerId: string;
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
      <View style={styles.modeCardLeft} focusable={false}>
        <Avatar.Icon size={40} icon={icon} style={styles.modeCardAvatar} />
      </View>
      <View style={styles.modeCardContent}>
        <Text style={styles.modeCardTitle}>{title}</Text>
        <Text style={styles.modeCardDescription}>{description}</Text>
      </View>
      <View style={styles.modeCardRight} focusable={false}>
        <Icon name={Name.ChevronRight} />
      </View>
    </TouchableOpacity>
  );
}

export default function PutawayModeScreen({ route }: PutawayModeScreenProps) {
  const { containerId } = route.params;
  const navigation = useNavigation<NavigationProp>();
  const putawayTasks = useSelector((state: RootState) => state.putawayReducer.putawayTasks) as SortationTask[];

  const taskSummary = useMemo(() => {
    const zones = new Set(putawayTasks?.map((task) => task.destination?.zoneName).filter(Boolean) || []);
    return {
      totalItems: putawayTasks?.length || 0,
      totalZones: zones.size
    };
  }, [putawayTasks]);

  const handleSystemDirected = () => {
    navigation.navigate('SortationPutawayLocationScan', {
      currentTaskIndex: 0,
      isUserDirected: false,
      containerId
    });
  };

  const handleUserDirected = () => {
    navigation.navigate('SortationPutawayTaskList', {
      containerId
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
          <Chip icon="identifier" style={styles.chipDefault} textStyle={styles.chipText}>
            Container Id: <Text style={styles.bold}>{containerId}</Text>
          </Chip>
          <Chip icon="package" style={styles.chipDefault} textStyle={styles.chipText}>
            Tasks: <Text style={styles.bold}>{taskSummary.totalItems}</Text>
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
