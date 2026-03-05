import { SortationTask } from '../../types/sortation';
import {
  FETCH_PUTAWAY_FROM_ORDER_REQUEST_SUCCESS,
  GET_PUTAWAY_CANDIDATES_REQUEST_SUCCESS,
  GET_PUTAWAY_DETAILS_BY_CONTAINER_ID_REQUEST_SUCCESS,
  SUBMIT_PUTAWAY_ITEM_BIN_LOCATION_SUCCESS
} from '../actions/putaways';

export interface State {
  putAway: any;
  putAwayItem: any;
  candidates: any;
  putawayTasks: SortationTask[];
}

const initialState: State = {
  putAway: null,
  putAwayItem: null,
  candidates: [],
  putawayTasks: []
};

function reducer(state = initialState, action: any) {
  switch (action.type) {
    case FETCH_PUTAWAY_FROM_ORDER_REQUEST_SUCCESS: {
      return {
        ...state,
        putAway: action.payload.data
      };
    }
    case GET_PUTAWAY_CANDIDATES_REQUEST_SUCCESS: {
      return {
        ...state,
        candidates: action.payload
      };
    }
    case SUBMIT_PUTAWAY_ITEM_BIN_LOCATION_SUCCESS: {
      return {
        ...state,
        putAwayItem: action.payload
      };
    }
    case GET_PUTAWAY_DETAILS_BY_CONTAINER_ID_REQUEST_SUCCESS: {
      const allTasks = action.payload || [];
      const filteredTasks = allTasks.filter(
        (task: SortationTask) => task.status === 'IN_PROGRESS' || task.status === 'PENDING'
      );
      return {
        ...state,
        putawayTasks: filteredTasks
      };
    }
    default: {
      return state;
    }
  }
}

export default reducer;
