import produce from "immer";
import { GET_ALL_BRANDS_SUCCESS, GET_ALL_BRANDS_BY_ADMIN_SUCCESS } from "./constants";

const INITIAL_STATE = {
  brandsList: [],
  brandsByAdminList: []
};

const brand = produce((draft, action) => {
  switch (action.type) {
    case GET_ALL_BRANDS_SUCCESS:
      draft.brandsList = action.payload;

      break;
    case GET_ALL_BRANDS_BY_ADMIN_SUCCESS:
      draft.brandsByAdminList = action.payload;

      break;

    default:
  }
}, INITIAL_STATE);

export default brand;
