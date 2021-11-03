import {FETCH_CONTAINER_DETAIL_RESPONSE_SUCCESS} from "../actions/lpn";

export interface State {
    container: any
}

const initialState: State = {
    container: null
}

function reducer(state = initialState, action: any) {
    switch (action.type) {
        case FETCH_CONTAINER_DETAIL_RESPONSE_SUCCESS: {
            return {
                ...state,
                container: action.payload.data,
            };
        }
        default: {
            return state;
        }
    }
}
