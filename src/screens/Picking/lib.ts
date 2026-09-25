import { ToastAndroid } from 'react-native';
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

function completeWithShortPickWithoutReasonCode(homeRoute: string) {
  ToastAndroid.show(
    'You have completed all picks with a short pick without a reason code. This task will remain available to pick.',
    ToastAndroid.LONG
  );
  returnHome(homeRoute);
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
    completeWithShortPickWithoutReasonCode(homeRoute);
    return;
  }

  ToastAndroid.show('You have completed all picks. Proceeding to staging location drop.', ToastAndroid.LONG);
  resetToRoutes([
    { name: 'Drawer', params: { screen: 'Dashboard' } },
    { name: homeRoute },
    { name: 'PickingPickStagingLocation' }
  ]);
}

export function revalidateTaskAndProceed({
  revalidateCurrentTask,
  currentTaskIndex,
  allTasksCount,
  goToNextTask,
  homeRoute,
  omitStagingLocationStep,
  onError
}: PickingFlowNavigation & {
  revalidateCurrentTask: (callback: (revalidatedTask: PickTask | undefined, errorMessage?: string) => void) => void;
  onError: (errorMessage: string) => void;
}) {
  revalidateCurrentTask((revalidatedTask, errorMessage) => {
    if (!revalidatedTask) {
      onError(errorMessage ?? 'Failed to revalidate the current pick task after picking.');
      return;
    }

    const isLastTask = currentTaskIndex + 1 >= allTasksCount;

    if (isLastTask && omitStagingLocationStep) {
      completeWithShortPickWithoutReasonCode(homeRoute);
      return;
    }

    proceedToNextOrComplete({ currentTaskIndex, allTasksCount, goToNextTask, homeRoute });
  });
}
