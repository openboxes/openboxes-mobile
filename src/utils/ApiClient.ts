/* eslint-disable complexity */
import axios, {AxiosError, AxiosResponse} from 'axios';
// import {logout} from '../redux/Dispatchers';
import {createLogger} from './Logger';
// import {environment} from './Environment';
import * as NavigationService from "../NavigationService";
import {store} from "../../App";
import {hideScreenLoading} from "../redux/actions/main";
const logger = createLogger('ApiClient.ts');

class _ApiClient {

  client:any;

  setBaseUrl =(url:string)=>{
      this.client = axios.create({
        baseURL: url,
        withCredentials: true
      });
      this.client.interceptors.response.use(this.handleApiSuccess, this.handleApiFailure);
  }

  async get(endpoint: string, config = this.client.defaults){
    return await this.client.get(endpoint, config);
  }

  async post(endpoint: string, data:any, config = this.client.defaults){
    return await this.client.post(endpoint, data, config);
  }

  async put(endpoint: string, data: any, config = this.client.defaults){
    return await this.client.put(endpoint, data, config);
  }

  async delete(endpoint: string, config = this.client.defaults){
    return await this.client.delete(endpoint, config);
  }

  handleApiSuccess = (response: AxiosResponse) => {
    const responseBody: string = JSON.stringify(response.data);
    return JSON.parse(responseBody);
  };
  handleApiFailure = async (error: AxiosError) => {
    let message = error.response?.data?.errorMessage;
    const code = error.response?.status;
    console.log('ERROR :: ', error);
    switch (code) {
      case 401:
        store.dispatch(hideScreenLoading());
        NavigationService.navigate('Login');
        message = message ?? 'Unauthorized';
        break;
      case 403:
        message = message ?? 'Access Denied';
        break;
      case 404:
        message = message ?? 'Not found';
        break;
      case 500:
        message = message ?? 'Internal Server Error';
        break;
      default:
        message = message ?? 'Something went wrong';
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