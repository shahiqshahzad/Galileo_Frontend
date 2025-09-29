import {
  GET_ALL_ACTIVITY,
  GET_ALL_ACTIVITY_SUCCESS,
  GET_DOWNLOAD_RECEIPT_PDF,
  GET_ORDER_DETAIL,
  GET_ORDER_DETAIL_SUCCESS,
  GET_RETURN_DETAIL,
  POST_REFUND_STATUS
} from "./constants";

export const getAllActivity = (data) => {
  return {
    type: GET_ALL_ACTIVITY,
    payload: data
  };
};

export const getAllActivitySuccess = (data) => {
  return {
    type: GET_ALL_ACTIVITY_SUCCESS,
    payload: data
  };
};

export const getOrderDetail = (data) => {
  return {
    type: GET_ORDER_DETAIL,
    payload: data
  };
};
export const getReturnDetail = (data) => {
  return {
    type: GET_RETURN_DETAIL,
    payload: data
  };
};
export const getDownloadReceiptPdf = (data) => {
  return {
    type: GET_DOWNLOAD_RECEIPT_PDF,
    payload: data
  };
};
export const getOrderDetailSuccess = (data) => {
  return {
    type: GET_ORDER_DETAIL_SUCCESS,
    payload: data
  };
};
export const postRefundStatus = (data) => {
  return {
    type: POST_REFUND_STATUS,
    payload: data
  };
};
