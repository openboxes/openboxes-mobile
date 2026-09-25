import axios, { AxiosError, AxiosResponse } from 'axios';
// import {logout} from '../redux/Dispatchers';
import { createLogger } from './Logger';
import * as NavigationService from '../NavigationService';
import { store } from '../../App';
import { hideScreenLoading } from '../redux/actions/main';
import { formatServerErrorMessage } from './serverErrorMessage';
const logger = createLogger('ApiClient.ts');

function readServerMessage(data: any): string {
  return typeof data?.errorMessage === 'string' ? formatServerErrorMessage(data.errorMessage) : '';
}

function readTextBody(data: any): string {
  return typeof data === 'string' ? data : '';
}

class _ApiClient {
  client: any;

  setBaseUrl = (url: string) => {
    this.client = axios.create({
      baseURL: url,
      withCredentials: true
    });
    this.client.interceptors.response.use(this.handleApiSuccess, this.handleApiFailure);
  };

  async get(endpoint: string, config = this.client.defaults) {
    return await this.client.get(endpoint, config);
  }

  async post(endpoint: string, data: any, config = this.client.defaults) {
    return await this.client.post(endpoint, data, config);
  }

  async put(endpoint: string, data: any, config = this.client.defaults) {
    return await this.client.put(endpoint, data, config);
  }

  async delete(endpoint: string, config = this.client.defaults) {
    return await this.client.delete(endpoint, config);
  }

  async patch(endpoint: string, data: any, config = this.client.defaults) {
    return await this.client.patch(endpoint, data, config);
  }

  handleApiSuccess = (response: AxiosResponse) => {
    const responseBody: string = JSON.stringify(response.data);
    return JSON.parse(responseBody);
  };
  handleApiFailure = async (error: AxiosError) => {
    const data = error.response?.data;
    const serverMessage = readServerMessage(data);
    let message: string;
    const code = error.response?.status;
    switch (code) {
      case 401:
        store.dispatch(hideScreenLoading());
        NavigationService.navigate('Login');
        message = serverMessage || 'Unauthorized';
        break;
      case 403:
        message = serverMessage || 'Access Denied';
        break;
      case 404:
        message = serverMessage || 'Not found';
        break;
      case 409:
        message = serverMessage || readTextBody(data) || 'Conflict: Resource Already Exists';
        break;
      case 500:
        message = serverMessage || 'Internal Server Error';
        break;
      default:
        message = serverMessage || 'Something went wrong';
        break;
    }
    return Promise.reject({
      message: message,
      code: code
    });
  };
}

const ApiClient = new _ApiClient();

export default ApiClient;
