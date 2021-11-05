import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';
// import {logout} from '../redux/Dispatchers';
import {createLogger} from './Logger';
import {environment} from './Environment';
import * as NavigationService from "../NavigationService"
import {store} from "../../App";
import {hideScreenLoading} from "../redux/actions/main";
import AsyncStorage from "@react-native-async-storage/async-storage";
const logger = createLogger('ApiClient.ts');


// const setUrl = async() =>{
//   const url =  await AsyncStorage.getItem('API_URL')
//   if(!url){
//     url = environment.API_BASE_URL
//   }
//   return url
// }
//
// class ApiClient {
//   constructor() {
//     setUrl().then((url)=>{
//       this.client = axios.create({
//         baseURL: url,
//         withCredentials: true,
//       })
//       this.client.interceptors.response.use(this.handleApiSuccess, this.handleApiFailure);
//     });
//   }
//   handleApiSuccess = (response: AxiosResponse) => {
//     const responseBody: string = JSON.stringify(response.data);
//     return JSON.parse(responseBody);
//   };
//
//   handleApiFailure = async (error: AxiosError) => {
//     let message = error.response?.data?.errorMessage;
//     const code = error.response?.status;
//     switch (code) {
//       case 401:
//         store.dispatch(hideScreenLoading())
//         NavigationService.navigate('Login')
//         message = message ?? 'Unauthorized';
//         break;
//       case 403:
//         message = message ?? 'Access Denied';
//         break;
//       case 404:
//         message = message ?? 'Not found';
//         break;
//       case 500:
//         message = message ?? 'Internal Server Error';
//         break;
//       default:
//         message = message ?? 'Something went wrong';
//         break;
//     }
//     return Promise.reject({
//       message: message,
//       code: code,
//     });
//   };
// }

const apiClient = axios.create({
  baseURL: environment.API_BASE_URL,
  withCredentials: true,
});

// export interface ApiError {
//   message: string;
//   code: string;
// }

// const handleApiRequest = (request: AxiosRequestConfig) => {
//   const url = request.url;
//   const headers = request.headers;
//   const params = request.params;
//   const data = request.data;
//   logger.d(`handleApiRequest: url = ${JSON.stringify(
//     url,
//   )}, method = ${JSON.stringify(request.method)},
//   headers = ${JSON.stringify(headers)}, params = ${JSON.stringify(
//     params,
//   )}, data = ${JSON.stringify(data)}`);
//   return request;
// };

const handleApiSuccess = (response: AxiosResponse) => {
  // const url = response.config.url;
  // const headers = response.config.headers;
  // const params = response.config.params;
  // const responseHeaders = response.headers;
  const responseBody: string = JSON.stringify(response.data);
  // logger.d(`handleApiSuccess: url = ${JSON.stringify(
  //   url,
  // )}, headers = ${JSON.stringify(headers)},
  // params = ${JSON.stringify(params)}, responseHeaders = ${JSON.stringify(
  //   responseHeaders,
  // )},
  // responseBody = ${responseBody}`);
  // console.debug("responseBody::"+responseBody)
  return JSON.parse(responseBody);
};

const handleApiFailure = async (error: AxiosError) => {
  let message = error.response?.data?.errorMessage;
  const code = error.response?.status;
  switch (code) {
    case 401:
        store.dispatch(hideScreenLoading())
        NavigationService.navigate('Login')
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
    code: code,
  });
};

// apiClient.interceptors.request.use(handleApiRequest);
// apiClient.interceptors.response.use(handleApiSuccess, handleApiFailure);
apiClient.interceptors.response.use(handleApiSuccess,handleApiFailure);
export default apiClient;

