import produce from "immer";
import {
  FETCH_EARNINGS_SUCCESS,
  FETCH_WITHDRAW_HISTORY_SUCCESS,
  RELEASE_SCHEDULE_SUCCESS,
  GET_ALL_GENERAL_SETTING_STATUS_SUCCESS,
  GET_ALL_MY_ACTIVITY_SUBADMIN_SUCCESS,
  GET_ALL_SUBADMIN_LIST_SUCCESS,
  GET_GENERAL_SETTING_INFO_SUCCESS,
  GET_MY_ACTIVITY_SUBADMIN_DETAIL_SUCCESS,
  GET_COUNTRY_LIST_SUCCESS
} from "./constants";

const INITIAL_STATE = {
  subAdminList: [],
  generalSettingStatus: [],
  countryList: [],
  generalInfoSetting: {},
  earnings: null,
  escrowHistory: [],
  ReleaseSchedule: [],
  myActivitySubadmin: [],
  myActivitySubadminDetail: {}
};

const subAdminReducer = produce((draft, action) => {
  switch (action.type) {
    case GET_ALL_SUBADMIN_LIST_SUCCESS:
      draft.subAdminList = action.payload;
      break;
    case GET_ALL_GENERAL_SETTING_STATUS_SUCCESS:
      draft.generalSettingStatus = action.payload;
      break;
    case GET_GENERAL_SETTING_INFO_SUCCESS:
      draft.generalInfoSetting = action.payload;
      break;
    case FETCH_EARNINGS_SUCCESS:
      draft.earnings = action.payload;
      break;
    case FETCH_WITHDRAW_HISTORY_SUCCESS:
      draft.escrowHistory = action.payload;
      break;
    case RELEASE_SCHEDULE_SUCCESS:
      draft.ReleaseSchedule = action.payload;
      break;
    case GET_ALL_MY_ACTIVITY_SUBADMIN_SUCCESS:
      draft.myActivitySubadmin = action.payload;
      break;
    case GET_MY_ACTIVITY_SUBADMIN_DETAIL_SUCCESS:
      draft.myActivitySubadminDetail = action.payload;
      break;
    case GET_COUNTRY_LIST_SUCCESS:
      draft.countryList = action.payload;
      break;
    default:
  }
}, INITIAL_STATE);

export default subAdminReducer;
