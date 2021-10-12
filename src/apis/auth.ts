import apiClient from '../utils/ApiClient';

export function getSession() {
  return apiClient.get('/getAppContext');
}
export function login(data: any) {
  return apiClient.post('/login', data);
}
