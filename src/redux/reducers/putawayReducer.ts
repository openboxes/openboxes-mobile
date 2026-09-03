import { SortationTask } from '../../types/sortation';
import { putawayCandidateKey } from '../../utils/putawayCandidate';
import {
  FETCH_PUTAWAY_FROM_ORDER_REQUEST_SUCCESS,
  GET_PUTAWAY_CANDIDATES_REQUEST_SUCCESS,
  GET_PUTAWAY_DETAILS_BY_CONTAINER_ID_REQUEST_SUCCESS,
  PUTAWAY_CANDIDATE_PUTAWAY,
  SUBMIT_PUTAWAY_ITEM_BIN_LOCATION_SUCCESS
} from '../actions/putaways';

export interface State {
  putAway: any;
  putAwayItem: any;
  candidates: any;
  putawayTasks: SortationTask[];
  putawayOverrides: { [key: string]: number };
}

const initialState: State = {
  putAway: null,
  putAwayItem: null,
  candidates: [],
  putawayTasks: [],
  putawayOverrides: {}
};

function reducer(state = initialState, action: any) {
  switch (action.type) {
    case FETCH_PUTAWAY_FROM_ORDER_REQUEST_SUCCESS: {
      return {
        ...state,
        putAway: action.payload.data
      };
    }
    case PUTAWAY_CANDIDATE_PUTAWAY: {
      const { key, remainingQuantity } = action.payload;
      return {
        ...state,
        putawayOverrides: { ...state.putawayOverrides, [key]: remainingQuantity }
      };
    }
    case GET_PUTAWAY_CANDIDATES_REQUEST_SUCCESS: {
      const candidates = action.payload || [];
      // Drop overrides the server has caught up with, so they cannot go stale
      const putawayOverrides = { ...state.putawayOverrides };
      Object.keys(putawayOverrides).forEach((key) => {
        const match = candidates.find((candidate: any) => putawayCandidateKey(candidate) === key);
        if (!match || Number(match.quantity) <= putawayOverrides[key]) {
          delete putawayOverrides[key];
        }
      });
      return {
        ...state,
        candidates,
        putawayOverrides
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
