import produce from "immer";
import { GET_ALL_BRAND_ADMINS_SUCCESS } from "./constants";

const INITIAL_STATE = {
  brandadminsList: []
};

const brandadminReducer = produce((draft, action) => {
  switch (action.type) {
    case GET_ALL_BRAND_ADMINS_SUCCESS:
      draft.brandadminsList = action.payload;

      break;

    default:
  }
}, INITIAL_STATE);

export default brandadminReducer;
