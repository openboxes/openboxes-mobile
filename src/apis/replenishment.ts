import {
  MOCK_REPLENISHMENT_CONTAINERS,
  MOCK_REPLENISHMENT_LISTS,
  MOCK_REPLENISHMENT_STAGING_LOCATIONS,
  MOCK_REPLENISHMENT_TASKS
} from '../screens/Replenishment/mock-data';
import { ReplenishmentList, ReplenishmentTask, ReplenishmentTaskStatus } from '../types/replenishment';
import apiClient from '../utils/ApiClient';

// TODO(API): the replenishment task API is still being built. Until then these functions resolve mock data shaped
//  like an ApiClient response body ({ data }), so the sagas and screens already run the real path.
//  Set this to false and fix the URLs below once the API is available.
const USE_REPLENISHMENT_MOCKS = true;

export const OPEN_TASK_STATUSES = [ReplenishmentTaskStatus.PENDING, ReplenishmentTaskStatus.PICKING];

export const ALL_TASK_STATUSES = Object.values(ReplenishmentTaskStatus);

/** Status of a list whose tasks are all picked, with picks waiting in containers to be staged */
export const LIST_STATUS_PICKED = 'PICKED';

// Picks are kept for the app session, so that leaving and re-entering a list shows the progress like the server would
let mockTasks: ReplenishmentTask[] = MOCK_REPLENISHMENT_TASKS.map((task) => ({ ...task }));

/** Forgets the picks made against the mocked API */
export function resetReplenishmentMocks() {
  mockTasks = MOCK_REPLENISHMENT_TASKS.map((task) => ({ ...task }));
}

function mockResponse<T>(data: T): Promise<{ data: T }> {
  return Promise.resolve({ data });
}

function getMockTasks(orderId: string, statuses: ReplenishmentTaskStatus[]) {
  return mockTasks.filter((task) => task.orderId === orderId && statuses.includes(task.status));
}

/** Picks in a container that are not staged yet */
function getMockTasksToStage(orderId: string) {
  return getMockTasks(orderId, [ReplenishmentTaskStatus.PICKED]).filter(
    (task) => task.outboundContainer && task.quantityPicked > 0
  );
}

/**
 * The lists still to work on: with tasks to pick, or with picks to stage (status PICKED). A list with neither is
 * staged and ready for putaway, so it is not returned.
 */
export function getReplenishmentListsApi(facilityId: string) {
  if (USE_REPLENISHMENT_MOCKS) {
    const lists = MOCK_REPLENISHMENT_LISTS.map((list) => {
      const openTasksCount = getMockTasks(list.id, OPEN_TASK_STATUSES).length;
      const status = openTasksCount === 0 && getMockTasksToStage(list.id).length > 0 ? LIST_STATUS_PICKED : list.status;
      return { ...list, status, tasksCount: openTasksCount };
    }).filter((list) => list.tasksCount > 0 || list.status === LIST_STATUS_PICKED);
    return mockResponse<ReplenishmentList[]>(lists);
  }
  return apiClient.get(`/facilities/${facilityId}/replenishments?status=PENDING&status=PICKING&status=PICKED`);
}

export function getReplenishmentTasksApi(
  facilityId: string,
  orderId: string,
  statuses: ReplenishmentTaskStatus[] = OPEN_TASK_STATUSES
) {
  if (USE_REPLENISHMENT_MOCKS) {
    return mockResponse<ReplenishmentTask[]>(getMockTasks(orderId, statuses));
  }
  const statusParams = statuses.map((status) => `&status=${status}`).join('');
  return apiClient.get(`/facilities/${facilityId}/replenishment-tasks?order=${orderId}${statusParams}`);
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

/** Mirrors PickTaskDropParams of the outbound pick-tasks API */
export type ReplenishmentContainerDropParams = {
  action: 'drop';
  stagingLocationId: string;
  stagedById: string;
};

/** Stages the picks of a container in a staging location */
export function dropReplenishmentContainerApi(
  facilityId: string,
  outboundContainerId: string,
  params: ReplenishmentContainerDropParams
) {
  if (USE_REPLENISHMENT_MOCKS) {
    // As on the server (PickTaskService.dropToStaging): the location must exist, the container must hold picks
    const stagingLocation = MOCK_REPLENISHMENT_STAGING_LOCATIONS.find(
      (location) => location.id === params.stagingLocationId || location.locationNumber === params.stagingLocationId
    );
    if (!stagingLocation) {
      return Promise.reject({ message: `Staging location ${params.stagingLocationId} does not exist` });
    }
    const isInContainer = (task: ReplenishmentTask) =>
      task.status === ReplenishmentTaskStatus.PICKED &&
      task.quantityPicked > 0 &&
      (task.outboundContainer?.id === outboundContainerId ||
        task.outboundContainer?.locationNumber === outboundContainerId);
    const tasksToStage = mockTasks.filter(isInContainer);
    if (tasksToStage.length === 0) {
      return Promise.reject({ message: `Outbound container ${outboundContainerId} is empty` });
    }

    const dateStaged = new Date().toISOString();
    mockTasks = mockTasks.map((task) =>
      isInContainer(task) ? { ...task, status: ReplenishmentTaskStatus.STAGED, stagingLocation, dateStaged } : task
    );
    return mockResponse<ReplenishmentTask[]>(mockTasks.filter((task) => tasksToStage.some((t) => t.id === task.id)));
  }
  return apiClient.patch(`/facilities/${facilityId}/replenishment-tasks/containers/${outboundContainerId}`, params);
}
