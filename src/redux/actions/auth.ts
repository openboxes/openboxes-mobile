export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_REQUEST_SUCCESS = 'LOGIN_REQUEST_SUCCESS';
export const LOGIN_REQUEST_FAIL = 'LOGIN_REQUEST_FAIL';
export const LOGOUT_REQUEST='LOGOUT_REQUEST'
export const LOGOUT_REQUEST_SUCCESS ="LOGOUT_REQUEST_SUCCESS"
export function login(data: any) {
  return {
    type: LOGIN_REQUEST,
    payload: {data},
  };
}
export function logout(data?: any) {
  return {
    type: LOGOUT_REQUEST,
    payload: {data},
  };
}