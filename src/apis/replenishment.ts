import { MOCK_REPLENISHMENT_LISTS, MOCK_REPLENISHMENT_TASKS } from '../screens/Replenishment/mock-data';
import { ReplenishmentList, ReplenishmentTask } from '../types/replenishment';
import apiClient from '../utils/ApiClient';

// TODO(API): the replenishment task API is still being built. Until then these functions resolve mock data shaped
//  like an ApiClient response body ({ data }), so the sagas and screens already run the real path.
//  Set this to false and fix the URLs below once the API is available.
const USE_REPLENISHMENT_MOCKS = true;

function mockResponse<T>(data: T): Promise<{ data: T }> {
  return Promise.resolve({ data });
}

export function getReplenishmentListsApi(facilityId: string) {
  if (USE_REPLENISHMENT_MOCKS) {
    return mockResponse<ReplenishmentList[]>(MOCK_REPLENISHMENT_LISTS);
  }
  return apiClient.get(`/facilities/${facilityId}/replenishments?status=PENDING&status=PICKING`);
}

export function getReplenishmentTasksApi(facilityId: string, orderId: string) {
  if (USE_REPLENISHMENT_MOCKS) {
    return mockResponse<ReplenishmentTask[]>(MOCK_REPLENISHMENT_TASKS.filter((task) => task.orderId === orderId));
  }
  return apiClient.get(`/facilities/${facilityId}/replenishment-tasks?order=${orderId}&status=PENDING&status=PICKING`);
}

export function getReplenishmentTaskByIdApi(facilityId: string, taskId: string) {
  if (USE_REPLENISHMENT_MOCKS) {
    return mockResponse<ReplenishmentTask | undefined>(MOCK_REPLENISHMENT_TASKS.find((task) => task.id === taskId));
  }
  return apiClient.get(`/facilities/${facilityId}/replenishment-tasks/${taskId}`);
}
