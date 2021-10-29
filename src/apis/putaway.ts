import apiClient from '../utils/ApiClient';

export function fetchPutAwayFromOrder(q: string) {
    if(q!=null && q!=""){
        return apiClient.get(`/putaways?q=${q}`);
    }else{
        return apiClient.get(`/putaways`);
    }
}


export function submitPutawayItem(id: string, requestBody: any) {
    console.debug(requestBody)
    return apiClient.post(`/putaways/`+id, requestBody);
}
