import apiClient from '../utils/ApiClient';

export function getReasonCodesByActivity(activityCode: string) {
  return apiClient.get('/reasonCodes', {
    params: {
      activityCode: activityCode
    }
  });
}
