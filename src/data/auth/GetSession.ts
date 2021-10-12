import {Session} from './Session';
import apiClient from '../../utils/ApiClient';
import {AppDispatch} from '../../redux/Store';
import {setSessionAction} from '../../redux/Actions';
import {
  getHideProgressBarAction,
  getShowProgressBarAction,
} from '../../redux/Dispatchers';

const url = '/getAppContext';

interface GetSessionApiResponse {
  data: Session;
}

export default function getSession() {
  return (dispatch: AppDispatch) => {
    dispatch(getShowProgressBarAction('Fetching session details'));
    apiClient
      .get(url)
      .then((response: GetSessionApiResponse) => {
        dispatch(getHideProgressBarAction());
        dispatch({
          type: setSessionAction.type,
          payload: response.data,
        });
        return response.data;
      })
      .catch(() => dispatch(getHideProgressBarAction()));
  };
}
