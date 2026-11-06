import {
  ALL_TASK_STATUSES,
  dropReplenishmentContainerApi,
  getReplenishmentListsApi,
  getReplenishmentTasksApi,
  LIST_STATUS_PICKED,
  patchReplenishmentTaskApi,
  resetReplenishmentMocks
} from '../src/apis/replenishment';
import { ReplenishmentTaskStatus } from '../src/types/replenishment';

// The mocked API never reaches the HTTP client, whose module would pull the app's navigation
jest.mock('../src/utils/ApiClient', () => ({}));

const FACILITY_ID = 'facility-001';
const ORDER_ID = 'order-002';
const DROP = { action: 'drop' as const, stagingLocationId: 'REP-PUT0001', stagedById: 'user-1' };

async function getList() {
  const { data } = await getReplenishmentListsApi(FACILITY_ID);
  return data.find((list) => list.id === ORDER_ID);
}

/** Picks all three tasks of R-1002: two into OUT-0001, one shorted to zero */
async function pickList() {
  await patchReplenishmentTaskApi(FACILITY_ID, 'task-005', {
    action: 'pick',
    outboundContainerId: 'OUT-0001',
    pickedById: 'user-1'
  });
  await patchReplenishmentTaskApi(FACILITY_ID, 'task-006', {
    action: 'short-pick',
    outboundContainerId: 'OUT-0001',
    quantityPicked: 5,
    pickedById: 'user-1',
    reasonCode: { name: 'DAMAGED' }
  });
  await patchReplenishmentTaskApi(FACILITY_ID, 'task-007', {
    action: 'short-pick',
    outboundContainerId: null,
    quantityPicked: 0,
    pickedById: 'user-1',
    reasonCode: { name: 'INSUFFICIENT_QUANTITY_AVAILABLE' }
  });
}

describe('mocked replenishment staging', () => {
  beforeEach(() => {
    resetReplenishmentMocks();
  });

  it('keeps a fully picked list, as ready to stage, until its containers are staged', async () => {
    await pickList();

    expect(await getList()).toMatchObject({ status: LIST_STATUS_PICKED, tasksCount: 0 });

    const { data: stagedTasks } = await dropReplenishmentContainerApi(FACILITY_ID, 'OUT-0001', DROP);

    expect(stagedTasks.map((task) => task.id)).toEqual(['task-005', 'task-006']);
    expect(stagedTasks.every((task) => task.status === ReplenishmentTaskStatus.STAGED)).toBe(true);
    expect(stagedTasks[0].stagingLocation?.name).toBe('Replen Putaway');
    expect(await getList()).toBeUndefined();
  });

  it('returns all the tasks of a list when asked for every status', async () => {
    await pickList();

    const { data: openTasks } = await getReplenishmentTasksApi(FACILITY_ID, ORDER_ID);
    const { data: allTasks } = await getReplenishmentTasksApi(FACILITY_ID, ORDER_ID, ALL_TASK_STATUSES);

    expect(openTasks).toEqual([]);
    expect(allTasks).toHaveLength(3);
  });

  it('rejects a staging location that does not exist', async () => {
    await pickList();

    await expect(
      dropReplenishmentContainerApi(FACILITY_ID, 'OUT-0001', { ...DROP, stagingLocationId: 'XYZ' })
    ).rejects.toEqual({ message: 'Staging location XYZ does not exist' });
    expect((await getList())?.status).toBe(LIST_STATUS_PICKED);
  });

  it('rejects a container without picks to stage', async () => {
    await expect(dropReplenishmentContainerApi(FACILITY_ID, 'OUT-0002', DROP)).rejects.toEqual({
      message: 'Outbound container OUT-0002 is empty'
    });
  });
});
