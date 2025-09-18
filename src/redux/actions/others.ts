export const GET_REASON_CODES_REQUEST = 'GET_REASON_CODES_REQUEST';
export const GET_REASON_CODES_REQUEST_SUCCESS = 'GET_REASON_CODES_REQUEST_SUCCESS';

export function getReasonCodesAction(activityCode: string, callback: (data: any) => void) {
  return {
    type: GET_REASON_CODES_REQUEST,
    payload: { activityCode },
    callback
  };
}
