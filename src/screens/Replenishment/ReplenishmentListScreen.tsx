import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useRef, useState } from 'react';
import { FlatList, View } from 'react-native';
import { Button, Card, Chip, Divider, Paragraph, Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import { LIST_STATUS_PICKED } from '../../apis/replenishment';
import { LayoutStyle } from '../../assets/styles';
import EmptyView from '../../components/EmptyView';
import ListLoadingSkeleton from '../../components/ListLoadingSkeleton';
import PullToRefreshControl from '../../components/PullToRefreshControl';
import { HYPHEN } from '../../constants';
import { navigate } from '../../NavigationService';
import { getReplenishmentListsAction } from '../../redux/actions/replenishment';
import { ReplenishmentList, ReplenishmentTaskStatus } from '../../types/replenishment';
import Theme from '../../utils/Theme';
import { parseFromISODateToLocaleString } from '../../utils/utils';
import { ToggleRow } from '../Dashboard/ToggleRow';
import { countOpenTasks, tasksCountLabel } from './lib';
import { useReplenishmentContext } from './ReplenishmentContext';
import styles from './styles';

/** Like the discrete picking order card: "Ready" before picking starts, "In progress" while picking */
function ListStatusChip({ status }: { status: string }) {
  if (status === LIST_STATUS_PICKED) {
    return (
      <Chip icon="tray-arrow-down" style={[styles.chipDefault, styles.statusChip]}>
        <Text style={[styles.chipText, styles.fontBold]}>Ready to stage</Text>
      </Chip>
    );
  }
  const inProgress = status === ReplenishmentTaskStatus.PICKING;
  return (
    <Chip
      icon={inProgress ? 'progress-clock' : 'check-circle-outline'}
      selectedColor={inProgress ? Theme.colors.infoForeground : Theme.colors.successForeground}
      style={[styles.chipDefault, styles.statusChip, inProgress ? styles.statusChipInProgress : styles.statusChipReady]}
    >
      <Text
        style={[
          styles.chipText,
          styles.fontBold,
          inProgress ? styles.statusChipTextInProgress : styles.statusChipTextReady
        ]}
      >
        {inProgress ? 'In progress' : 'Ready'}
      </Text>
    </Chip>
  );
}

type ReplenishmentListCardProps = {
  list: ReplenishmentList;
  onPress: (list: ReplenishmentList) => void;
};

function ReplenishmentListCard({ list, onPress }: ReplenishmentListCardProps) {
  return (
    <Card style={LayoutStyle.listItemContainer} onPress={() => onPress(list)}>
      <Card.Content>
        <View style={styles.headerRow}>
          <Chip icon="identifier" style={[styles.chipDefault, styles.orderNumberChip]}>
            <Text style={[styles.orderNumberText, styles.fontBold]}>{list.orderNumber ?? HYPHEN}</Text>
          </Chip>
          <ListStatusChip status={list.status} />
        </View>

        <Divider style={styles.divider} />

        <View style={styles.additionalInfoRow}>
          <Chip icon="package-variant-closed" style={styles.chipDefault}>
            <Text style={styles.chipText}>
              {list.tasksCount === 1 ? 'Task' : 'Tasks'}:{' '}
              <Text style={[styles.chipText, styles.fontBold]}>{tasksCountLabel(list)}</Text>
            </Text>
          </Chip>
          <Chip icon="calendar" style={styles.chipDefault}>
            <Text style={styles.chipText}>
              Created:{' '}
              <Text style={[styles.chipText, styles.fontBold]}>
                {list.dateCreated ? parseFromISODateToLocaleString(list.dateCreated) : HYPHEN}
              </Text>
            </Text>
          </Chip>
        </View>
      </Card.Content>
    </Card>
  );
}

type SequentialStartCardProps = {
  lists: ReplenishmentList[];
  onStart: () => void;
};

/** Sequential mode: one card to go through the open tasks of all the lists, in location sequence */
function SequentialStartCard({ lists, onStart }: SequentialStartCardProps) {
  const openTasks = countOpenTasks(lists);
  return (
    <Card style={LayoutStyle.listItemContainer}>
      <Card.Content>
        <View style={styles.headerRow}>
          <Chip icon="format-list-numbered" style={[styles.chipDefault, styles.orderNumberChip]}>
            <Text style={[styles.orderNumberText, styles.fontBold]}>All Replenishments</Text>
          </Chip>
        </View>

        <Divider style={styles.divider} />

        <Paragraph style={styles.paragraph}>
          {openTasks.tasks > 0
            ? `${openTasks.tasks} ${openTasks.tasks === 1 ? 'task' : 'tasks'} to pick across ${openTasks.lists} ${
                openTasks.lists === 1 ? 'list' : 'lists'
              }, in location sequence.`
            : 'No open replenishment tasks.'}
        </Paragraph>
        <Button mode="contained" style={styles.marginTop} disabled={openTasks.tasks === 0} onPress={onStart}>
          Start Picking
        </Button>
      </Card.Content>
    </Card>
  );
}

export default function ReplenishmentListScreen() {
  const dispatch = useDispatch();
  const { startSession, startSequentialSession, sequentialMode, setSequentialMode } = useReplenishmentContext();
  const [lists, setLists] = useState<ReplenishmentList[]>([]);
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);
  // takeLatest cancels a superseded pull without its callback, so any completion settles it
  const pendingPullDone = useRef<() => void>();

  const fetchLists = useCallback(
    (done?: () => void) => {
      if (done) {
        pendingPullDone.current = done;
      }
      dispatch(
        getReplenishmentListsAction(({ response, errorMessage }) => {
          if (!errorMessage && response?.data) {
            setLists(response.data);
          }
          setHasLoaded(true);
          pendingPullDone.current?.();
          pendingPullDone.current = undefined;
        }, !!done)
      );
    },
    [dispatch]
  );

  useFocusEffect(
    useCallback(() => {
      fetchLists();
    }, [fetchLists])
  );

  const handleListPress = (list: ReplenishmentList) => {
    startSession(list).then((sessionStart) => {
      if (sessionStart === 'PICK') {
        navigate('ReplenishmentPickingLocation');
      } else if (sessionStart === 'STAGE') {
        navigate('ReplenishmentSummary');
      }
    });
  };

  const handleSequentialStart = () => {
    startSequentialSession().then((started) => {
      if (started) {
        navigate('ReplenishmentPickingLocation');
      }
    });
  };

  // In sequential mode the lists are only shown to stage what was picked: staging stays per list
  const visibleLists = sequentialMode ? lists.filter((list) => list.status === LIST_STATUS_PICKED) : lists;

  return (
    <View style={styles.screenContainer}>
      <View style={styles.sequentialToggle}>
        <ToggleRow
          title="Pick By List"
          description="Choose a replenishment list instead of picking all open tasks in location sequence"
          value={!sequentialMode}
          onValueChange={(byList) => setSequentialMode(!byList)}
        />
      </View>
      {hasLoaded ? (
        <FlatList
          data={visibleLists}
          keyExtractor={(list) => list.id}
          renderItem={({ item }) => <ReplenishmentListCard list={item} onPress={handleListPress} />}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            sequentialMode ? <SequentialStartCard lists={lists} onStart={handleSequentialStart} /> : null
          }
          ListEmptyComponent={
            sequentialMode ? null : <EmptyView title="Replenishment" description="No open replenishment lists" />
          }
          refreshControl={<PullToRefreshControl onRefresh={fetchLists} />}
        />
      ) : (
        <ListLoadingSkeleton visible count={5} />
      )}
    </View>
  );
}
