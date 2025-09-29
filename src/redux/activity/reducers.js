import produce from "immer";
import { GET_ALL_ACTIVITY_SUCCESS, GET_ORDER_DETAIL_SUCCESS } from "./constants";

const INITIAL_STATE = {
  allActivity: [],
  orderDetail: []
};

const allActivityReducer = produce((draft, action) => {
  switch (action.type) {
    case GET_ALL_ACTIVITY_SUCCESS:
      draft.allActivity = action.payload;
      break;
    case GET_ORDER_DETAIL_SUCCESS:
      draft.orderDetail = action.payload;
      break;
    default:
  }
}, INITIAL_STATE);

export default allActivityReducer;
