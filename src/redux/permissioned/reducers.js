import produce from "immer";
import { GET_ALL_PERMISSIONS_SUCCESS } from "./constants";

const INITIAL_STATE = {
  permissionList: []
};

const permissioned = produce((draft, action) => {
  switch (action.type) {
    case GET_ALL_PERMISSIONS_SUCCESS:
      draft.permissionList = action.payload;
      break;

    default:
  }
}, INITIAL_STATE);

export default permissioned;
