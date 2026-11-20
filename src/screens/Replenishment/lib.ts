import { Container } from '../../data/container/Shipment';
import { navigate, resetToRoutes } from '../../NavigationService';
import { ReplenishmentList, ReplenishmentTask, ReplenishmentTaskStatus } from '../../types/replenishment';

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

/** Whether the task still has to be picked */
export function isOpenTask(task: ReplenishmentTask): boolean {
  return task.status !== ReplenishmentTaskStatus.PICKED && task.status !== ReplenishmentTaskStatus.STAGED;
}

/**
 * The index of the next task to pick after the given index, wrapping around, or -1 when none is left.
 *
 * @param doneTaskId a task to treat as done, e.g. the one just picked whose new status is not in the tasks yet
 */
export function findNextOpenTaskIndex(tasks: ReplenishmentTask[], fromIndex: number, doneTaskId?: string): number {
  const count = tasks.length;
  for (let step = 1; step <= count; step += 1) {
    const index = (((fromIndex + step) % count) + count) % count;
    const task = tasks[index];
    if (task.id !== doneTaskId && isOpenTask(task)) {
      return index;
    }
  }
  return -1;
}

type ProceedToNextTaskParams = {
  tasks: ReplenishmentTask[];
  currentTaskIndex: number;
  goToTask: (index: number) => void;
};

/**
 * After the current task is picked (or shorted), shows the next task to pick, or the completion summary of the list
 * when all its picks are done.
 */
export function proceedToNextTask({ tasks, currentTaskIndex, goToTask }: ProceedToNextTaskParams) {
  const nextIndex = findNextOpenTaskIndex(tasks, currentTaskIndex, tasks[currentTaskIndex]?.id);
  if (nextIndex >= 0) {
    goToTask(nextIndex);
    navigate('ReplenishmentPickingLocation');
    return;
  }

  // The pick screens are done with, so Back from the summary goes to the list
  resetToRoutes([
    { name: 'Drawer', params: { screen: 'Dashboard' } },
    { name: 'ReplenishmentList' },
    { name: 'ReplenishmentSummary' }
  ]);
}

/**
 * The session's tasks followed by the loaded ones it does not have yet (tasks created on the server while picking,
 * e.g. to pick a shortage from another bin), those in location sequence.
 */
export function appendNewTasks(tasks: ReplenishmentTask[], loadedTasks: ReplenishmentTask[]): ReplenishmentTask[] {
  const knownIds = new Set(tasks.map((task) => task.id));
  return [...tasks, ...sortTasksByLocation(loadedTasks.filter((task) => !knownIds.has(task.id)))];
}

/** "3 more to pick from A-11-1 and 2 from B-2-1" */
export function describeReallocatedTasks(tasks: ReplenishmentTask[]): string {
  const parts = tasks.map(
    (task, index) =>
      `${task.quantityRequired}${index === 0 ? ' more to pick' : ''} from ${
        task.location?.name ?? task.location?.locationNumber ?? 'another location'
      }`
  );
  return parts.length > 1 ? `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}` : parts[0] ?? '';
}

export type ContainerToStage = {
  container: Container;
  tasks: ReplenishmentTask[];
};

export type ListSummary = {
  total: number;
  /** Picked in full */
  completed: number;
  /** Picked, but less than required */
  partial: number;
  /** Shorted with nothing picked */
  notPicked: number;
  /** Still to pick */
  open: number;
  /** Containers holding picks that are not staged yet, in the order they were first used */
  containersToStage: ContainerToStage[];
};

/** Summarizes all the tasks of a replenishment list, for the completion summary and staging */
export function summarizeListTasks(tasks: ReplenishmentTask[]): ListSummary {
  const summary: ListSummary = {
    total: tasks.length,
    completed: 0,
    partial: 0,
    notPicked: 0,
    open: 0,
    containersToStage: []
  };
  const containers = new Map<string, ContainerToStage>();

  tasks.forEach((task) => {
    const quantityPicked = task.quantityPicked || 0;
    if (isOpenTask(task)) {
      summary.open += 1;
    } else if (quantityPicked >= task.quantityRequired) {
      summary.completed += 1;
    } else if (quantityPicked > 0) {
      summary.partial += 1;
    } else {
      summary.notPicked += 1;
    }

    const container = task.outboundContainer;
    if (task.status === ReplenishmentTaskStatus.PICKED && container?.id && quantityPicked > 0) {
      const containerToStage = containers.get(container.id) ?? { container, tasks: [] };
      containerToStage.tasks.push(task);
      containers.set(container.id, containerToStage);
    }
  });

  summary.containersToStage = Array.from(containers.values());
  return summary;
}

/** "2 / 5 Left" once some tasks are done but others are still to pick, otherwise all the tasks */
export function tasksCountLabel({
  tasksCount,
  openTasksCount
}: Pick<ReplenishmentList, 'tasksCount' | 'openTasksCount'>) {
  return openTasksCount > 0 && openTasksCount < tasksCount ? `${openTasksCount} / ${tasksCount} Left` : `${tasksCount}`;
}
