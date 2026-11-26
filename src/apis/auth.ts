import { AxiosRequestConfig } from 'axios';

import apiClient from '../utils/ApiClient';

export function getSession() {
  return apiClient.get('/getAppContext');
}
export function login(data: any) {
  return apiClient.post('/login', data);
}
export function logout(data: any, config?: AxiosRequestConfig) {
  // An undefined config falls back to the client defaults
  return apiClient.post('/logout', data, config);
}
