import produce from "immer";
import {
  GET_ALL_ADDRESSES_SUCCESS,
  GET_ALL_CATEGORY_ADDRESSES_SUCCESS,
  GET_SUPPORTED_CARRIERS_SUCCESS
} from "./constants";

const INITIAL_STATE = {
  addressesList: [],
  supportedCarriers: [],
  categoryAddressesList: []
};

const addressesReducer = produce((draft, action) => {
  switch (action.type) {
    case GET_ALL_ADDRESSES_SUCCESS:
      draft.addressesList = action.payload;
      break;

    case GET_ALL_CATEGORY_ADDRESSES_SUCCESS:
      draft.categoryAddressesList = action.payload;
      break;

    case GET_SUPPORTED_CARRIERS_SUCCESS:
      let data = action.payload.map((item) => {
        let name = item.metadata !== "" ? `${item.carrier_name} (${item.metadata})` : item.carrier_name;
        return { ...item, carrier_name: name };
      });
      draft.supportedCarriers = data;
      break;

    default:
  }
}, INITIAL_STATE);

export default addressesReducer;
