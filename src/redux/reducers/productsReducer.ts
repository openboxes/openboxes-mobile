import {GET_PRODUCTS_REQUEST_SUCCESS} from '../actions/products';

const initialState = {
  products: [],
};

function reducer(state = initialState, action: any) {
  switch (action.type) {
    case GET_PRODUCTS_REQUEST_SUCCESS: {
      return {
        ...state,
        // products: [...action.payload.data],
      };
    }

    default: {
      return state;
    }
  }
}

export default reducer;
