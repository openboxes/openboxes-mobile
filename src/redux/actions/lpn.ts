export const SAVE_OR_UPDATE_LPN = 'SAVE_OR_UPDATE_LPN';

export function saveAndUpdateLpn(
    requestBody: any,
    callback: (data: any) => void,
) {
    console.log('action OK saveAndUpdateLpn');
    return {
        type: SAVE_OR_UPDATE_LPN,
        payload: {requestBody},
        callback,
    };
}
