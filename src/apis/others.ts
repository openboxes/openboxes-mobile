import apiClient from '../utils/ApiClient';

export function getReasonCodesByActivity(activityCode: string) {
  return apiClient.get('/reason-codes', {
    params: {
      activityCode: activityCode
    }
  });
}
