import produce from "immer";
import { GET_ALL_PRODUCT_SUCCESS, GET_ALL_DELIVERY_DASHBOARD_SUCCESS } from "./constants";

const INITIAL_STATE = {
  deliveryList: []
};

const delivery = produce((draft, action) => {
  switch (action.type) {
    case GET_ALL_PRODUCT_SUCCESS:
      draft.productList = action.payload;
      break;
    case GET_ALL_DELIVERY_DASHBOARD_SUCCESS:
      draft.deliveryList = action.payload;
      break;

    default:
  }
}, INITIAL_STATE);

export default delivery;
