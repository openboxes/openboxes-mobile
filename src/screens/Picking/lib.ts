import { Alert } from 'react-native';
import { navigate, resetToRoutes } from '../../NavigationService';
import { PickTask } from '../../types/picking';

export function revalidateTaskAndProceed(
  revalidateCurrentTask: (callback: (revalidatedTask: PickTask) => void) => void,
  currentTaskIndex: number,
  allTasksCount: number,
  goToNextTask: () => void,
  omitStagingLocationStep?: boolean
) {
  revalidateCurrentTask((revalidatedTask) => {
    if (!revalidatedTask) {
      Alert.alert('Error', 'Failed to revalidate the current pick task after picking.');
      return;
    }

    // If it's not the last task, go to the next one
    if (!(currentTaskIndex + 1 >= allTasksCount)) {
      goToNextTask();
      navigate('PickingPickLocation');
      return;
    }

    if (omitStagingLocationStep) {
      Alert.alert(
        'Short Pick Without Reason Code',
        'You have completed all picks with a short pick without a reason code. This task will remain available to pick. You will be redirected to the Pick Type screen.',
        [
          {
            text: 'OK',
            onPress: () => navigate('PickingPickType')
          }
        ]
      );
      return;
    }

    Alert.alert('All Picks Complete', 'You have completed all picks. Proceeding to staging location drop.', [
      {
        text: 'OK',
        onPress: () =>
          resetToRoutes([{ name: 'Dashboard' }, { name: 'PickingPickType' }, { name: 'PickingPickStagingLocation' }])
      }
    ]);
  });
}
