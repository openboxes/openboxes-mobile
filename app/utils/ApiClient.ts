import axios, {AxiosError, AxiosResponse} from "axios";
import {logout} from "../redux/Dispatchers";

const apiClient = axios.create()

export interface ApiError {
  message: string,
  code: string
}

const handleApiSuccess = (response: AxiosResponse) => response;

const handleApiFailure = (error: AxiosError): Promise<ApiError> => {
  let message = error.response?.data?.errorMessage;
  const code = error.response?.status;
  switch(code) {
    case 401:
      logout("Unauthorized Access. User has been logged out.");
      message = message ?? "Unauthorized";
      break;
    case 403:
      message = message ?? "Access Denied";
      break;
    case 404:
      message = message ?? "Not found";
      break;
    case 500:
      message = message ?? "Internal Server Error";
      break;
    default:
      message = message ?? "Something went wrong";
      break;
  }

  return Promise.reject({
    message: message,
    code: code
  })
};

apiClient.interceptors.response.use(handleApiSuccess, handleApiFailure)
export default apiClient;
