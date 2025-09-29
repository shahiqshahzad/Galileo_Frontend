import {
  GET_ALL_PRODUCT,
  GET_ALL_PRODUCT_SUCCESS,
  GET_ALL_DELIVERY_DASHBOARD_SUCCESS,
  GET_ALL_DELIVERY_DASHBOARD,
  CHANGE_STATUS
} from "./constants";

export const getAllProducts = (data) => {
  return {
    type: GET_ALL_PRODUCT,
    payload: data
  };
};

export const getAllProductsSuccess = (data) => {
  return {
    type: GET_ALL_PRODUCT_SUCCESS,
    payload: data
  };
};
export const changeStatus = (data) => {
  return {
    type: CHANGE_STATUS,
    payload: data
  };
};
export const getDeliveryDashboard = (data) => {
  return {
    type: GET_ALL_DELIVERY_DASHBOARD,
    payload: data
  };
};

export const getDeliveryDashboardSuccess = (data) => {
  return {
    type: GET_ALL_DELIVERY_DASHBOARD_SUCCESS,
    payload: data
  };
};
