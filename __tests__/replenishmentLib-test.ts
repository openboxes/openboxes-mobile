import Location from '../src/data/location/Location';
import { moveTaskToEnd, sortTasksByLocation } from '../src/screens/Replenishment/lib';
import { ReplenishmentTask } from '../src/types/replenishment';

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
