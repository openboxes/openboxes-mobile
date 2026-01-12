import { Alert } from 'react-native';
import { navigate } from '../../NavigationService';
import { PickTask } from '../../types/picking';

export function revalidateTaskAndProceed(
  revalidateCurrentTask: (callback: (revalidatedTask: PickTask) => void) => void,
  currentTaskIndex: number,
  allTasksCount: number,
  goToNextTask: () => void
) {
  revalidateCurrentTask((revalidatedTask) => {
    if (!revalidatedTask) {
      Alert.alert('Error', 'Failed to revalidate the current pick task after picking.');
      return;
    }

    if (currentTaskIndex + 1 >= allTasksCount) {
      // Last Task -> Navigate to staging location drop
      Alert.alert('All Picks Complete', 'You have completed all picks. Proceeding to staging location drop.', [
        {
          text: 'OK',
          onPress: () => navigate('PickingPickStagingLocation')
        }
      ]);
    } else {
      // More Tasks -> Start over with next pick task
      goToNextTask();
      navigate('PickingPickLocation');
    }
  });
}
