import {
  ACTIVITY_STATUS_LOADER,
  ACTIVITY_STATUS_LOADER_SUCCESS,
  GET_ALL_BRAND_ACTIVITY,
  GET_ALL_BRAND_ACTIVITY_SUCCESS,
  GET_BRAND_ACTIVITY_DETAIL,
  GET_BRAND_ACTIVITY_DETAIL_SUCCESS,
  GET_BRAND_ACTIVITY_STATUS,
  GET_BRAND_ACTIVITY_STATUS_SUCCESS,
  UPDATE_BRAND_ACTIVITY_STATUS,
  UPDATE_DETAIL_AND_LINK_ACTIVITY
} from "./constants";

export const getAllBrandActivity = (data) => {
  return {
    type: GET_ALL_BRAND_ACTIVITY,
    payload: data
  };
};

export const getBrandActivityDetail = (data) => {
  return {
    type: GET_BRAND_ACTIVITY_DETAIL,
    payload: data
  };
};
export const activityStatusChangeLoader = (data) => {
  return {
    type: ACTIVITY_STATUS_LOADER,
    payload: data
  };
};
export const activityStatusLoaderSuccess = (data) => {
  return {
    type: ACTIVITY_STATUS_LOADER_SUCCESS,
    payload: data
  };
};
export const getBrandActivityStatus = (data) => {
  return {
    type: GET_BRAND_ACTIVITY_STATUS
  };
};
export const updateBrandActivityStatus = (data) => {
  return {
    type: UPDATE_BRAND_ACTIVITY_STATUS,
    payload: data
  };
};
export const updateDetailAndLinkActivity = (data) => {
  return {
    type: UPDATE_DETAIL_AND_LINK_ACTIVITY,
    payload: data
  };
};
export const getBrandActivityDetailSuccess = (data) => {
  return {
    type: GET_BRAND_ACTIVITY_DETAIL_SUCCESS,
    payload: data
  };
};
export const getBrandActivityStatusSuccess = (data) => {
  return {
    type: GET_BRAND_ACTIVITY_STATUS_SUCCESS,
    payload: data
  };
};
export const getAllBrandActivitySuccess = (data) => {
  return {
    type: GET_ALL_BRAND_ACTIVITY_SUCCESS,
    payload: data
  };
};
