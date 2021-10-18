import {
  GET_PRODUCT_BY_ID_REQUEST_SUCCESS,
  GET_PRODUCTS_REQUEST_SUCCESS,
  PRINT_LABEL_REQUEST_SUCCESS
} from '../actions/products';
import Location from "../../data/location/Location";
import {Session} from "../../data/auth/Session";

export interface State {
  products: any;
  currentBarcodeLabel: any,
  printModalVisible: boolean
}

const initialState: State = {
  products: [],
  currentBarcodeLabel: null,
  printModalVisible: false
};

function reducer(state = initialState, action: any) {
  switch (action.type) {
    case GET_PRODUCTS_REQUEST_SUCCESS: {
      return {
        ...state,
        // products: [...action.payload.data],
      };
    }
    case GET_PRODUCT_BY_ID_REQUEST_SUCCESS: {
      return {
        ...state,
        printModalVisible: true,
        currentBarcodeLabel: {...action.payload.barcodeLabels[0]},
      };
    }
    case PRINT_LABEL_REQUEST_SUCCESS: {
      return {
        ...state,
        printModalVisible: false,
      };
    }

    default: {
      return state;
    }
  }
}

export default reducer;
