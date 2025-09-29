import produce from "immer";
import {
  ACTIVITY_STATUS_LOADER_SUCCESS,
  GET_ALL_BRAND_ACTIVITY_SUCCESS,
  GET_BRAND_ACTIVITY_DETAIL_SUCCESS,
  GET_BRAND_ACTIVITY_STATUS_SUCCESS
} from "./constants";

const INITIAL_STATE = {
  brandActivities: [],
  brandActivityDetail: null,
  brandActivityStatus: [],
  activityStatusLoader: false
};

const brandActivityReducer = produce((draft, action) => {
  switch (action.type) {
    case GET_ALL_BRAND_ACTIVITY_SUCCESS:
      draft.brandActivities = action.payload;
      break;
    case GET_BRAND_ACTIVITY_DETAIL_SUCCESS:
      draft.brandActivityDetail = action.payload;
      break;
    case GET_BRAND_ACTIVITY_STATUS_SUCCESS:
      draft.brandActivityStatus = action.payload;
      break;
    case ACTIVITY_STATUS_LOADER_SUCCESS:
      draft.activityStatusLoader = action.payload;
      break;
    default:
  }
}, INITIAL_STATE);

export default brandActivityReducer;
