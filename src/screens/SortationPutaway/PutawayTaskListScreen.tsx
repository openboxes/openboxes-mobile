import React from 'react';
import { ScrollView } from 'react-native';
import { Paragraph, Title } from 'react-native-paper';

import { SortationTask } from '../../types/sortation';
import styles from './styles';

type PutawayTaskListScreenProps = {
  route: {
    params: {
      containerId: string;
      taskList: SortationTask[];
    };
  };
};

export default function PutawayTaskListScreen({ route }: PutawayTaskListScreenProps) {
  const { containerId, taskList } = route.params;

  return (
    <ScrollView keyboardShouldPersistTaps="always" style={styles.screen}>
      <Title style={styles.topSpace}>Container: {containerId}</Title>
      <Paragraph style={styles.paragraph}>
        {taskList.length} task{taskList.length !== 1 ? 's' : ''} available
      </Paragraph>
    </ScrollView>
  );
}
