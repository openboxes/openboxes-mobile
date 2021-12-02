import {EnvironmentActual} from './EnvironmentActual';

export interface Environment {
  API_BASE_URL: string;
  PUBLIC_KEY: string;
  SECRET_KEY: string;
  PROJECT_ID: string;
}

export const environment = EnvironmentActual;
