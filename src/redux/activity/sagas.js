import { all, fork, put, select, takeLatest } from "redux-saga/effects";
import {
  GET_ALL_ACTIVITY,
  GET_DOWNLOAD_RECEIPT_PDF,
  GET_ORDER_DETAIL,
  GET_RETURN_DETAIL,
  POST_REFUND_STATUS
} from "./constants";
import { makeSelectAuthToken } from "store/Selector";
import axios from "../../utils/axios";
import { getAllActivitySuccess, getOrderDetailSuccess } from "./actions";
import { toast } from "react-toastify";
import { activityStatusLoaderSuccess } from "redux/brandActivityDashboard/actions";
import { setNotification } from "shared/helperMethods/setNotification";
import { sagaErrorHandler } from "shared/helperMethods/sagaErrorHandler";
import { createGoogleAnalyticsForRefundItem } from "utils/googleAnalytics";

function* allActivity({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.get(
      `/users/get-activity?status=${payload.status}&page=${payload.page}&size=10`,
      headers
    );
    yield put(getAllActivitySuccess(response.data.data));
    payload.setActivityLoader(false);
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}
export function* watchAllActivity() {
  yield takeLatest(GET_ALL_ACTIVITY, allActivity);
}
function* getOrderDetail({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.get(`/users/get-order-details?orderNumber=${payload.orderId}`, headers);
    yield put(getOrderDetailSuccess(response.data.data));
    if (payload?.setLoader) {
      payload.setLoader(false);
    }
  } catch (error) {
    toast.error(error.response.data.data);
  }
}

export function* watchActivityOrder() {
  yield takeLatest(GET_ORDER_DETAIL, getOrderDetail);
}

function* getReturnDetail({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.get(`/users/get-order-details-for-return?orderNumber=${payload.orderId}`, headers);
    yield put(getOrderDetailSuccess(response.data.data));
    payload.setLoader(false);
  } catch (error) {
    toast.error(error.response.data.data.message);
  }
}
export function* watchReturnOrderDetail() {
  yield takeLatest(GET_RETURN_DETAIL, getReturnDetail);
}
function* getPdfDownloadActivity({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.get(`/users/get-order-receipt/${payload}`, headers);
    const byteCharacters = atob(response.data.data.pdfBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${payload}.pdf`;
    a.click();
  } catch (error) {
    toast.error(error?.response?.data?.data?.message);
  }
}

export function* watchPdfDownloadActivity() {
  yield takeLatest(GET_DOWNLOAD_RECEIPT_PDF, getPdfDownloadActivity);
}
function* postRefundStatus({ payload }) {
  yield put(activityStatusLoaderSuccess(true));
  try {
    const { setOpen, ...rest } = payload;
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.post(`/users/return-order-request`, rest, headers);
    const nftData = response.data.data;
    if (Object.keys(nftData)?.length > 0) {
      createGoogleAnalyticsForRefundItem(nftData);
    }
    yield setNotification("success", response.data.message);

    payload.setOpen(false);
    if (payload?.fetchAfterReturn) {
      payload?.fetchAfterReturn();
    }
  } catch (error) {
    payload.setOpen(false);
    yield put(activityStatusLoaderSuccess(false));
  }
}
export function* watchReturnStatus() {
  yield takeLatest(POST_REFUND_STATUS, postRefundStatus);
}
export default function* allActivitySaga() {
  yield all([
    fork(watchAllActivity),
    fork(watchActivityOrder),
    fork(watchPdfDownloadActivity),
    fork(watchReturnStatus),
    fork(watchReturnOrderDetail)
  ]);
}
