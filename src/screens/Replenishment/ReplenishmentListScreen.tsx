import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useRef, useState } from 'react';
import { FlatList, View } from 'react-native';
import { Card, Chip, Divider, Text } from 'react-native-paper';
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
import { tasksCountLabel } from './lib';
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

export default function ReplenishmentListScreen() {
  const dispatch = useDispatch();
  const { startSession } = useReplenishmentContext();
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

  return (
    <View style={styles.screenContainer}>
      {hasLoaded ? (
        <FlatList
          data={lists}
          keyExtractor={(list) => list.id}
          renderItem={({ item }) => <ReplenishmentListCard list={item} onPress={handleListPress} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<EmptyView title="Replenishment" description="No open replenishment lists" />}
          refreshControl={<PullToRefreshControl onRefresh={fetchLists} />}
        />
      ) : (
        <ListLoadingSkeleton visible count={5} />
      )}
    </View>
  );
}
