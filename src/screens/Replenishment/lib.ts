import { Alert } from 'react-native';

import { navigate } from '../../NavigationService';
import { ReplenishmentTask } from '../../types/replenishment';

/**
 * Orders the tasks by pick location, so the picker walks the locations in sequence.
 *
 * Natural order on the location number (A-2-1 before A-10-1), tasks without a location last, and the original order
 * kept for ties (Array.prototype.sort is stable).
 *
 * TODO(API): the server is expected to return the pick sequence. Revisit once the replenishment task API is available.
 */
export function sortTasksByLocation(tasks: ReplenishmentTask[]): ReplenishmentTask[] {
  return [...tasks].sort((a, b) => {
    const aLocation = a.location?.locationNumber;
    const bLocation = b.location?.locationNumber;
    if (!aLocation || !bLocation) {
      return (aLocation ? 0 : 1) - (bLocation ? 0 : 1);
    }
    return compareNatural(aLocation, bLocation);
  });
}

const CHUNKS = /\d+|\D+/g;

/**
 * Case-insensitive comparison treating digit runs as numbers (A-2-1 before A-10-1). Done by hand rather than with
 * localeCompare's numeric option, whose support depends on the Intl build of the JS engine on the device.
 */
export function compareNatural(a: string, b: string): number {
  const aChunks = a.toLowerCase().match(CHUNKS) ?? [];
  const bChunks = b.toLowerCase().match(CHUNKS) ?? [];
  for (let i = 0; i < Math.min(aChunks.length, bChunks.length); i += 1) {
    const aChunk = aChunks[i];
    const bChunk = bChunks[i];
    if (aChunk !== bChunk) {
      const aIsNumber = /^\d/.test(aChunk);
      const bIsNumber = /^\d/.test(bChunk);
      if (aIsNumber && bIsNumber) {
        const difference = Number(aChunk) - Number(bChunk);
        if (difference !== 0) {
          return difference;
        }
        // Same number written differently (20 and 020), compare what follows
        continue;
      }
      return aChunk < bChunk ? -1 : 1;
    }
  }
  return aChunks.length - bChunks.length;
}

/** Moves the task at the given index to the end, keeping the order of the others */
export function moveTaskToEnd(tasks: ReplenishmentTask[], index: number): ReplenishmentTask[] {
  if (index < 0 || index >= tasks.length) {
    return tasks;
  }
  return [...tasks.slice(0, index), ...tasks.slice(index + 1), tasks[index]];
}

type ProceedToNextTaskParams = {
  currentTaskIndex: number;
  tasksCount: number;
  goToNextTask: () => void;
};

/** After a task is picked (or shorted), shows the next task, or ends the picks of the list after the last one */
export function proceedToNextTask({ currentTaskIndex, tasksCount, goToNextTask }: ProceedToNextTaskParams) {
  if (currentTaskIndex + 1 < tasksCount) {
    goToNextTask();
    navigate('ReplenishmentPickingLocation');
    return;
  }

  // TODO(OBLS-413): staging and the completion summary
  Alert.alert('All Picks Complete', 'You have completed all picks. Proceeding to staging location drop.', [
    { text: 'OK', onPress: () => navigate('ReplenishmentStagingLocation') }
  ]);
}
