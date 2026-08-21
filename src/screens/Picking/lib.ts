import { Alert } from 'react-native';
import { navigate, resetToRoutes } from '../../NavigationService';
import { PickTask } from '../../types/picking';

type PickingFlowNavigation = {
  currentTaskIndex: number;
  allTasksCount: number;
  goToNextTask: () => void;
  /** Screen the session started from, reset to when it ends so finished screens are unreachable */
  homeRoute: string;
  omitStagingLocationStep?: boolean;
};

function returnHome(homeRoute: string) {
  resetToRoutes([{ name: 'Drawer', params: { screen: 'Dashboard' } }, { name: homeRoute }]);
}

function alertShortPickWithoutReasonCode(homeRoute: string) {
  Alert.alert(
    'Short Pick Without Reason Code',
    'You have completed all picks with a short pick without a reason code. This task will remain available to pick.',
    [
      {
        text: 'OK',
        onPress: () => returnHome(homeRoute)
      }
    ]
  );
}

export function proceedToNextOrComplete({
  currentTaskIndex,
  allTasksCount,
  goToNextTask,
  homeRoute,
  omitStagingLocationStep
}: PickingFlowNavigation) {
  if (currentTaskIndex + 1 < allTasksCount) {
    goToNextTask();
    navigate('PickingPickLocation');
    return;
  }

  if (omitStagingLocationStep) {
    alertShortPickWithoutReasonCode(homeRoute);
    return;
  }

  Alert.alert('All Picks Complete', 'You have completed all picks. Proceeding to staging location drop.', [
    {
      text: 'OK',
      onPress: () =>
        resetToRoutes([
          { name: 'Drawer', params: { screen: 'Dashboard' } },
          { name: homeRoute },
          { name: 'PickingPickStagingLocation' }
        ])
    }
  ]);
}

export function revalidateTaskAndProceed({
  revalidateCurrentTask,
  currentTaskIndex,
  allTasksCount,
  goToNextTask,
  homeRoute,
  omitStagingLocationStep
}: PickingFlowNavigation & {
  revalidateCurrentTask: (callback: (revalidatedTask: PickTask | undefined) => void) => void;
}) {
  revalidateCurrentTask((revalidatedTask) => {
    if (!revalidatedTask) {
      Alert.alert('Error', 'Failed to revalidate the current pick task after picking.');
      return;
    }

    const isLastTask = currentTaskIndex + 1 >= allTasksCount;

    if (isLastTask && omitStagingLocationStep) {
      alertShortPickWithoutReasonCode(homeRoute);
      return;
    }

    proceedToNextOrComplete({ currentTaskIndex, allTasksCount, goToNextTask, homeRoute });
  });
}
