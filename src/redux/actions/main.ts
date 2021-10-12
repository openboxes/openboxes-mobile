export const SHOW_SCREEN_LOADING = 'SHOW_SCREEN_LOADING';
export const HIDE_SCREEN_LOADING = 'HIDE_SCREEN_LOADING';
export const GET_SESSION_REQUEST = 'GET_SESSION_REQUEST';
export const GET_SESSION_REQUEST_SUCCESS = 'GET_SESSION_REQUEST_SUCCESS';

export function showScreenLoading(message?: string) {
  return {
    type: SHOW_SCREEN_LOADING,
    payload: {message},
  };
}

export function hideScreenLoading() {
  return {
    type: HIDE_SCREEN_LOADING,
  };
}

export function getSessionAction(callback: (data: any) => void) {
  return {
    type: GET_SESSION_REQUEST,
    callback,
  };
}
