import Location from '../src/data/location/Location';
import { navigate, resetToRoutes } from '../src/NavigationService';
import {
  findNextOpenTaskIndex,
  moveTaskToEnd,
  proceedToNextTask,
  sortTasksByLocation,
  summarizeListTasks
} from '../src/screens/Replenishment/lib';
import { ReplenishmentTask, ReplenishmentTaskStatus } from '../src/types/replenishment';

jest.mock('../src/NavigationService', () => ({ navigate: jest.fn(), resetToRoutes: jest.fn() }));

function task(id: string, locationNumber?: string): ReplenishmentTask {
  return {
    id,
    location: locationNumber ? ({ id: `loc-${id}`, locationNumber, name: locationNumber } as Location) : undefined
  } as ReplenishmentTask;
}

const ids = (tasks: ReplenishmentTask[]) => tasks.map((t) => t.id);

describe('sortTasksByLocation', () => {
  it('orders tasks by location number in natural order', () => {
    const tasks = [task('1', 'A-10-1'), task('2', 'B-1-1'), task('3', 'A-2-1'), task('4', 'a-3-2')];

    expect(ids(sortTasksByLocation(tasks))).toEqual(['3', '4', '1', '2']);
  });

  it('puts tasks without a location last', () => {
    const tasks = [task('1'), task('2', 'B-1-1'), task('3'), task('4', 'A-1-1')];

    expect(ids(sortTasksByLocation(tasks))).toEqual(['4', '2', '1', '3']);
  });

  it('keeps the original order of tasks in the same location', () => {
    const tasks = [task('1', 'A-1-1'), task('2', 'A-0-1'), task('3', 'A-1-1'), task('4', 'A-1-1')];

    expect(ids(sortTasksByLocation(tasks))).toEqual(['2', '1', '3', '4']);
  });

  it('compares digit runs as numbers and ignores case', () => {
    const tasks = [task('1', 'BIN-100'), task('2', 'bin-20'), task('3', 'BIN-3'), task('4', 'BIN-020A')];

    expect(ids(sortTasksByLocation(tasks))).toEqual(['3', '2', '4', '1']);
  });

  it('does not modify the given array', () => {
    const tasks = [task('1', 'B-1-1'), task('2', 'A-1-1')];

    sortTasksByLocation(tasks);

    expect(ids(tasks)).toEqual(['1', '2']);
  });
});

describe('moveTaskToEnd', () => {
  it('moves the task to the end, keeping the order of the others', () => {
    const tasks = [task('1'), task('2'), task('3'), task('4')];

    expect(ids(moveTaskToEnd(tasks, 1))).toEqual(['1', '3', '4', '2']);
  });

  it('leaves the tasks unchanged for the last task or an index out of range', () => {
    const tasks = [task('1'), task('2')];

    expect(ids(moveTaskToEnd(tasks, 1))).toEqual(['1', '2']);
    expect(moveTaskToEnd(tasks, 5)).toBe(tasks);
    expect(moveTaskToEnd(tasks, -1)).toBe(tasks);
  });
});

function taskWith(
  id: string,
  status: ReplenishmentTaskStatus,
  quantityPicked = 0,
  quantityRequired = 10,
  containerNumber?: string
): ReplenishmentTask {
  return {
    id,
    status,
    quantityPicked,
    quantityRequired,
    product: { productCode: `P-${id}` },
    outboundContainer: containerNumber ? { id: `c-${containerNumber}`, locationNumber: containerNumber } : null,
    stagingLocation: { id: 'staging-001', locationNumber: 'REP-PUT0001', name: 'Replen Putaway' }
  } as ReplenishmentTask;
}

const { PENDING, PICKED, STAGED } = ReplenishmentTaskStatus;

describe('findNextOpenTaskIndex', () => {
  it('finds the next task to pick after the given one, wrapping around', () => {
    const tasks = [taskWith('1', PENDING), taskWith('2', PICKED), taskWith('3', PENDING)];

    expect(findNextOpenTaskIndex(tasks, 0)).toBe(2);
    expect(findNextOpenTaskIndex(tasks, 2)).toBe(0);
  });

  it('treats the task just picked as done, its new status not being in the tasks yet', () => {
    const tasks = [taskWith('1', PENDING), taskWith('2', STAGED), taskWith('3', PENDING)];

    expect(findNextOpenTaskIndex(tasks, 2, '3')).toBe(0);
    expect(findNextOpenTaskIndex([taskWith('1', PICKED), taskWith('2', PENDING)], 1, '2')).toBe(-1);
  });

  it('starts from the first task when given -1', () => {
    expect(findNextOpenTaskIndex([taskWith('1', PENDING), taskWith('2', PENDING)], -1)).toBe(0);
  });
});

describe('proceedToNextTask', () => {
  beforeEach(() => {
    (navigate as jest.Mock).mockClear();
    (resetToRoutes as jest.Mock).mockClear();
  });

  it('shows the next task to pick on the details screen', () => {
    const goToTask = jest.fn();
    const tasks = [taskWith('1', PICKED), taskWith('2', PENDING), taskWith('3', PENDING)];

    proceedToNextTask({ tasks, currentTaskIndex: 1, goToTask });

    expect(goToTask).toHaveBeenCalledWith(2);
    expect(navigate).toHaveBeenCalledWith('ReplenishmentPickingLocation');
    expect(resetToRoutes).not.toHaveBeenCalled();
  });

  it('goes back to a skipped task before completing', () => {
    const goToTask = jest.fn();
    const tasks = [taskWith('1', PENDING), taskWith('2', PICKED), taskWith('3', PENDING)];

    proceedToNextTask({ tasks, currentTaskIndex: 2, goToTask });

    expect(goToTask).toHaveBeenCalledWith(0);
  });

  it('shows the completion summary once all picks are done', () => {
    const goToTask = jest.fn();
    const tasks = [taskWith('1', PICKED), taskWith('2', PENDING)];

    proceedToNextTask({ tasks, currentTaskIndex: 1, goToTask });

    expect(goToTask).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
    expect(resetToRoutes).toHaveBeenCalledWith([
      { name: 'Drawer', params: { screen: 'Dashboard' } },
      { name: 'ReplenishmentList' },
      { name: 'ReplenishmentSummary' }
    ]);
  });
});

describe('summarizeListTasks', () => {
  it('counts the tasks by outcome and groups the picks to stage by container', () => {
    const summary = summarizeListTasks([
      taskWith('1', PICKED, 10, 10, 'OUT-0001'),
      taskWith('2', PICKED, 4, 10, 'OUT-0002'),
      taskWith('3', PICKED, 0, 10),
      taskWith('4', PICKED, 10, 10, 'OUT-0001'),
      taskWith('5', PENDING),
      taskWith('6', STAGED, 10, 10, 'OUT-0003')
    ]);

    expect(summary).toMatchObject({ total: 6, completed: 3, partial: 1, notPicked: 1, open: 1 });
    expect(summary.containersToStage.map(({ container }) => container.locationNumber)).toEqual([
      'OUT-0001',
      'OUT-0002'
    ]);
    expect(summary.containersToStage[0].tasks.map((t) => t.id)).toEqual(['1', '4']);
    expect(summary.containersToStage[0].stagingLocation?.name).toBe('Replen Putaway');
  });

  it('has nothing to stage when nothing was put in a container', () => {
    expect(summarizeListTasks([taskWith('1', PICKED, 0, 10)]).containersToStage).toEqual([]);
  });
});
