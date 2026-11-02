import * as React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { resetToRoutes } from '../../NavigationService';
import Theme from '../../utils/Theme';
import { PickSession } from '../MoveToStaging/MoveToStagingListScreen';
import { containerLabelOf, countLabel } from '../MoveToStaging/moveToStagingLib';
import styles from '../MoveToStaging/moveToStagingStyles';
import { ActionButton, ListRow, PanelCard, StatusPill } from '../MoveToStaging/ui';
import { usePickingContext } from './PickingContext';

export default function PickCompleteScreen() {
  const { tasks, resetSession } = usePickingContext();

  const pickedTasks = tasks.filter((task) => task.outboundContainer?.id);
  const containerIds = Array.from(new Set(pickedTasks.map((task) => task.outboundContainer?.id as string)));
  const singleContainerTask = containerIds.length === 1 ? pickedTasks[0] : undefined;
  const containerLabels = Array.from(new Set(pickedTasks.map(containerLabelOf)));
  const orderNumbers = Array.from(
    new Set(pickedTasks.map((task) => task.requisitionNumber).filter(Boolean) as string[])
  );

  const goToStaging = () => {
    const container = singleContainerTask?.outboundContainer;
    const pickSession: PickSession = container
      ? { containerFilter: container.locationNumber || container.id, containerFilterLabel: containerLabels[0] }
      : { containerIds };
    resetSession();
    resetToRoutes([
      { name: 'Drawer', params: { screen: 'Dashboard' } },
      { name: 'MoveToStagingList', params: { pickSession } }
    ]);
  };

  const backToDashboard = () => {
    resetSession();
    resetToRoutes([{ name: 'Drawer', params: { screen: 'Dashboard' } }]);
  };

  const containers = containerIds.map((containerId) => {
    const containerTasks = pickedTasks.filter((task) => task.outboundContainer?.id === containerId);
    const orders = Array.from(
      new Set(containerTasks.map((task) => task.requisitionNumber).filter(Boolean) as string[])
    ).map((orderNumber) => ({
      orderNumber,
      itemCount: containerTasks.filter((task) => task.requisitionNumber === orderNumber).length
    }));
    return {
      containerId,
      label: containerLabelOf(containerTasks[0]),
      isEmployeeLocation: Boolean(containerTasks[0].employeeLocation),
      itemCount: containerTasks.length,
      orders
    };
  });

  return (
    <ScrollView style={styles.screenContainer} contentContainerStyle={styles.listContent}>
      <View style={styles.successBlock}>
        <View style={styles.successIcon}>
          <MaterialCommunityIcons name="check" size={34} color={Theme.colors.successForeground} />
        </View>
        <Text style={styles.successTitle}>Pick Complete</Text>
        <Text style={styles.successText}>
          You picked {countLabel(pickedTasks.length, 'item')} for {countLabel(orderNumbers.length, 'order')} into{' '}
          <Text style={styles.successTextStrong}>{containerLabels.join(', ') || 'no container'}</Text>.
        </Text>
      </View>

      <View style={styles.noteBox}>
        <Text style={styles.noteText}>
          You don&apos;t have to stage now. This cart stays on the Move to Staging list until someone drops it.
        </Text>
        {containerIds.length > 1 ? (
          <Text style={[styles.noteText, styles.buttonSpacing]}>
            This session filled {countLabel(containerIds.length, 'container')}, so Move to Staging opens on all of them
            rather than on one.
          </Text>
        ) : null}
      </View>

      {containers.map((container) => (
        <PanelCard
          key={container.containerId}
          title={container.label}
          icon={container.isEmployeeLocation ? 'account-outline' : 'cart-outline'}
          right={<StatusPill label={countLabel(container.itemCount, 'item')} tone="outline" />}
        >
          {container.orders.map((order) => (
            <ListRow key={order.orderNumber} title={order.orderNumber} meta={countLabel(order.itemCount, 'item')} />
          ))}
        </PanelCard>
      ))}

      <View style={styles.actionBar}>
        <ActionButton label="Move to staging" disabled={pickedTasks.length === 0} onPress={goToStaging} />
        <TouchableOpacity style={styles.cardActionRow} accessibilityRole="button" onPress={backToDashboard}>
          <Text style={styles.sectionAction}>Back to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
