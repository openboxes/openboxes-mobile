import {
  MOCK_REPLENISHMENT_CONTAINERS,
  MOCK_REPLENISHMENT_LISTS,
  MOCK_REPLENISHMENT_TASKS
} from '../screens/Replenishment/mock-data';
import { ReplenishmentList, ReplenishmentTask, ReplenishmentTaskStatus } from '../types/replenishment';
import apiClient from '../utils/ApiClient';

// TODO(API): the replenishment task API is still being built. Until then these functions resolve mock data shaped
//  like an ApiClient response body ({ data }), so the sagas and screens already run the real path.
//  Set this to false and fix the URLs below once the API is available.
const USE_REPLENISHMENT_MOCKS = true;

const OPEN_STATUSES = [ReplenishmentTaskStatus.PENDING, ReplenishmentTaskStatus.PICKING];

// Picks are kept for the app session, so that leaving and re-entering a list shows the progress like the server would
let mockTasks: ReplenishmentTask[] = MOCK_REPLENISHMENT_TASKS.map((task) => ({ ...task }));

/** Forgets the picks made against the mocked API */
export function resetReplenishmentMocks() {
  mockTasks = MOCK_REPLENISHMENT_TASKS.map((task) => ({ ...task }));
}

function mockResponse<T>(data: T): Promise<{ data: T }> {
  return Promise.resolve({ data });
}

function getOpenMockTasks(orderId: string) {
  return mockTasks.filter((task) => task.orderId === orderId && OPEN_STATUSES.includes(task.status));
}

export function getReplenishmentListsApi(facilityId: string) {
  if (USE_REPLENISHMENT_MOCKS) {
    return mockResponse<ReplenishmentList[]>(
      MOCK_REPLENISHMENT_LISTS.map((list) => ({ ...list, tasksCount: getOpenMockTasks(list.id).length }))
    );
  }
  return apiClient.get(`/facilities/${facilityId}/replenishments?status=PENDING&status=PICKING`);
}

export function getReplenishmentTasksApi(facilityId: string, orderId: string) {
  if (USE_REPLENISHMENT_MOCKS) {
    return mockResponse<ReplenishmentTask[]>(getOpenMockTasks(orderId));
  }
  return apiClient.get(`/facilities/${facilityId}/replenishment-tasks?order=${orderId}&status=PENDING&status=PICKING`);
}

export function getReplenishmentTaskByIdApi(facilityId: string, taskId: string) {
  if (USE_REPLENISHMENT_MOCKS) {
    return mockResponse<ReplenishmentTask | undefined>(mockTasks.find((task) => task.id === taskId));
  }
  return apiClient.get(`/facilities/${facilityId}/replenishment-tasks/${taskId}`);
}

/** Mirrors PickTaskActionParams of the outbound pick-tasks API */
export type ReplenishmentTaskActionParams =
  | {
      action: 'pick';
      outboundContainerId: string;
      pickedById: string;
    }
  | {
      action: 'short-pick';
      outboundContainerId: string | null;
      quantityPicked: number;
      pickedById: string;
      reasonCode?: { name: string };
    };

export function patchReplenishmentTaskApi(facilityId: string, taskId: string, params: ReplenishmentTaskActionParams) {
  if (USE_REPLENISHMENT_MOCKS) {
    const task = mockTasks.find((t) => t.id === taskId);
    if (!task) {
      return Promise.reject({ message: `Replenishment task ${taskId} not found` });
    }

    // A zero short pick has nothing to put in a container; otherwise the container must exist, as on the server
    // (PickTaskService.validateOutboundContainer, found by id or location number)
    const { outboundContainerId } = params;
    const outboundContainer = outboundContainerId
      ? MOCK_REPLENISHMENT_CONTAINERS.find(
          (container) => container.id === outboundContainerId || container.locationNumber === outboundContainerId
        )
      : null;
    if ((params.action === 'pick' || outboundContainerId !== null) && !outboundContainer) {
      return Promise.reject({ message: `Outbound container ${outboundContainerId} does not exist` });
    }

    const pickedTask: ReplenishmentTask = {
      ...task,
      quantityPicked:
        params.action === 'pick' ? task.quantityRequired : (task.quantityPicked || 0) + params.quantityPicked,
      reasonCode: params.action === 'short-pick' ? params.reasonCode?.name ?? null : null,
      outboundContainer: outboundContainer ?? task.outboundContainer,
      status: ReplenishmentTaskStatus.PICKED,
      datePicked: new Date().toISOString()
    };
    mockTasks = mockTasks.map((t) => (t.id === taskId ? pickedTask : t));
    return mockResponse<ReplenishmentTask>(pickedTask);
  }
  return apiClient.patch(`/facilities/${facilityId}/replenishment-tasks/${taskId}`, params);
}
