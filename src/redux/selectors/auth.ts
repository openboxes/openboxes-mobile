import { RootState } from '../reducers';

export const userLocation = (state: RootState) => state.mainReducer.currentLocation;

export const userSession = (state: RootState) => state.mainReducer.session;
