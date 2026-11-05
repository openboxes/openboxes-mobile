import {
  getReplenishmentListsApi,
  getReplenishmentTasksApi,
  patchReplenishmentTaskApi,
  resetReplenishmentMocks
} from '../src/apis/replenishment';
import { ReplenishmentTaskStatus } from '../src/types/replenishment';

// The mocked API never reaches the HTTP client, whose module would pull the app's navigation
jest.mock('../src/utils/ApiClient', () => ({}));

const FACILITY_ID = 'facility-001';
const ORDER_ID = 'order-001';

async function openTaskIds() {
  const { data } = await getReplenishmentTasksApi(FACILITY_ID, ORDER_ID);
  return data.map((task) => task.id);
}

async function openTasksCount() {
  const { data } = await getReplenishmentListsApi(FACILITY_ID);
  return data.find((list) => list.id === ORDER_ID)?.tasksCount;
}

describe('mocked replenishment task API', () => {
  beforeEach(() => {
    resetReplenishmentMocks();
  });

  it('picks a task into a container, which then leaves the open tasks of the list', async () => {
    expect(await openTasksCount()).toBe(4);

    const { data: task } = await patchReplenishmentTaskApi(FACILITY_ID, 'task-001', {
      action: 'pick',
      outboundContainerId: 'OUT-0001',
      pickedById: 'user-1'
    });

    expect(task.status).toBe(ReplenishmentTaskStatus.PICKED);
    expect(task.quantityPicked).toBe(task.quantityRequired);
    expect(task.outboundContainer?.locationNumber).toBe('OUT-0001');
    expect(await openTaskIds()).not.toContain('task-001');
    expect(await openTasksCount()).toBe(3);
  });

  it('accepts several products in the same container, found by id or number', async () => {
    await patchReplenishmentTaskApi(FACILITY_ID, 'task-001', {
      action: 'pick',
      outboundContainerId: 'OUT-0001',
      pickedById: 'user-1'
    });
    const { data: task } = await patchReplenishmentTaskApi(FACILITY_ID, 'task-002', {
      action: 'short-pick',
      outboundContainerId: 'container-OUT-0001',
      quantityPicked: 10,
      pickedById: 'user-1',
      reasonCode: { name: 'DAMAGED' }
    });

    expect(task.outboundContainer?.locationNumber).toBe('OUT-0001');
    expect(task.quantityPicked).toBe(10);
    expect(task.reasonCode).toBe('DAMAGED');
    expect(await openTaskIds()).toEqual(['task-003', 'task-004']);
  });

  it('rejects a container that does not exist and keeps the task open', async () => {
    await expect(
      patchReplenishmentTaskApi(FACILITY_ID, 'task-001', {
        action: 'pick',
        outboundContainerId: 'XYZ',
        pickedById: 'user-1'
      })
    ).rejects.toEqual({ message: 'Outbound container XYZ does not exist' });

    expect(await openTaskIds()).toContain('task-001');
  });

  it('records a zero short pick without a container', async () => {
    const { data: task } = await patchReplenishmentTaskApi(FACILITY_ID, 'task-001', {
      action: 'short-pick',
      outboundContainerId: null,
      quantityPicked: 0,
      pickedById: 'user-1',
      reasonCode: { name: 'INSUFFICIENT_QUANTITY_AVAILABLE' }
    });

    expect(task.quantityPicked).toBe(0);
    expect(task.outboundContainer).toBeNull();
    expect(await openTaskIds()).not.toContain('task-001');
  });
});
