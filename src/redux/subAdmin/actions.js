import {
  GET_ALL_SUBADMIN_LIST,
  GET_ALL_SUBADMIN_LIST_SUCCESS,
  ADD_SUBADMIN,
  UPDATE_SUBADMIN,
  DELETE_SUBADMIN,
  CHANGE_SUBADMIN_STATUS,
  CHANGE_SUBADMIN_MINTING_ACCESS,
  CHANGE_ROLE,
  ASSIGN_BRANDCATEGORY,
  GET_ALL_GENERAL_SETTING_STATUS,
  GET_ALL_GENERAL_SETTING_STATUS_SUCCESS,
  DELETE_STATUS_SUBADMIN,
  ADD_GENERAL_SETTING_STATUS,
  OPTIONAL_COUNTRIES,
  GET_GENERAL_SETTING_INFO_SUCCESS,
  FETCH_EARNINGS,
  FETCH_EARNINGS_SUCCESS,
  ADD_GENERAL_CONTACT_INFO,
  FETCH_WITHDRAW_HISTORY,
  FETCH_WITHDRAW_HISTORY_SUCCESS,
  RELEASE_SCHEDULE,
  RELEASE_SCHEDULE_SUCCESS,
  GET_ALL_MY_ACTIVITY_SUBADMIN,
  GET_ALL_MY_ACTIVITY_SUBADMIN_SUCCESS,
  GET_MY_ACTIVITY_SUBADMIN_DETAIL,
  GET_MY_ACTIVITY_SUBADMIN_DETAIL_SUCCESS,
  UPDATE_RETURN_MY_ACTIVITY_SUBADMIN,
  GET_COUNTRY_LIST,
  GET_COUNTRY_LIST_SUCCESS
} from "./constants";

// Admin

export const getAllSubAdminList = (data) => {
  return {
    type: GET_ALL_SUBADMIN_LIST,
    payload: data
  };
};

export const getAllgeneralSettingList = (data) => {
  return {
    type: GET_ALL_GENERAL_SETTING_STATUS,
    payload: data
  };
};

export const getAllGeneralSettingSuccess = (data) => {
  return {
    type: GET_ALL_GENERAL_SETTING_STATUS_SUCCESS,
    payload: data
  };
};

export const getGeneralSettingInfo = (data) => {
  return {
    type: GET_GENERAL_SETTING_INFO_SUCCESS,
    payload: data
  };
};
export const addGeneralSettingStatus = (data) => {
  return {
    type: ADD_GENERAL_SETTING_STATUS,
    payload: data
  };
};
export const optionalCountries = (data) => {
  return {
    type: OPTIONAL_COUNTRIES,
    payload: data
  };
};
export const addGeneralContactInfo = (data) => {
  return {
    type: ADD_GENERAL_CONTACT_INFO,
    payload: data
  };
};
export const getAllSubAdminListSuccess = (data) => {
  return {
    type: GET_ALL_SUBADMIN_LIST_SUCCESS,
    payload: data
  };
};
export const getAllCountriesList = (data) => {
  return {
    type: GET_COUNTRY_LIST,
    payload: data
  };
};
export const getAllCountriesListSuccess = (data) => {
  return {
    type: GET_COUNTRY_LIST_SUCCESS,
    payload: data
  };
};
export const deleteStatusSubAdmin = (data) => {
  return {
    type: DELETE_STATUS_SUBADMIN,
    payload: data
  };
};

export const addSubAdmin = (data) => {
  return {
    type: ADD_SUBADMIN,
    payload: data
  };
};

export const updateSubAdmin = (data) => {
  return {
    type: UPDATE_SUBADMIN,
    payload: data
  };
};
export const assignBrandCategory = (data) => {
  return {
    type: ASSIGN_BRANDCATEGORY,
    payload: data
  };
};

export const deleteSubAdmin = (data) => {
  return {
    type: DELETE_SUBADMIN,
    payload: data
  };
};
export const changeSubAdminStatus = (data) => {
  return {
    type: CHANGE_SUBADMIN_STATUS,
    payload: data
  };
};
export const changeRole = (data) => {
  return {
    type: CHANGE_ROLE,
    payload: data
  };
};

export const changeSubAdminMintingAccess = (data) => {
  return {
    type: CHANGE_SUBADMIN_MINTING_ACCESS,
    payload: data
  };
};

export const fetchEarnings = (data) => {
  return {
    type: FETCH_EARNINGS,
    payload: data
  };
};

export const fetchEarningsSuccess = (data) => {
  return {
    type: FETCH_EARNINGS_SUCCESS,
    payload: data
  };
};

export const fetchWithdrawHistroy = (data) => {
  return {
    type: FETCH_WITHDRAW_HISTORY,
    payload: data
  };
};

export const fetchWithdrawHistroySuccess = (data) => {
  return {
    type: FETCH_WITHDRAW_HISTORY_SUCCESS,
    payload: data
  };
};
export const ReleaseScheduled = (data) => {
  return {
    type: RELEASE_SCHEDULE,
    payload: data
  };
};

export const ReleaseScheduledSuccess = (data) => {
  return {
    type: RELEASE_SCHEDULE_SUCCESS,
    payload: data
  };
};

export const getMyActivitySubAdmin = (data) => {
  return {
    type: GET_ALL_MY_ACTIVITY_SUBADMIN,
    payload: data
  };
};
export const getAllActivitySubAdminSuccess = (data) => {
  return {
    type: GET_ALL_MY_ACTIVITY_SUBADMIN_SUCCESS,
    payload: data
  };
};
export const getMyActivitySubAdminDetail = (data) => {
  return {
    type: GET_MY_ACTIVITY_SUBADMIN_DETAIL,
    payload: data
  };
};
export const getMyActivitySubAdminDetailSuccess = (data) => {
  return {
    type: GET_MY_ACTIVITY_SUBADMIN_DETAIL_SUCCESS,
    payload: data
  };
};
export const updateReturnMyActivitySubAdmin = (data) => {
  return {
    type: UPDATE_RETURN_MY_ACTIVITY_SUBADMIN,
    payload: data
  };
};
