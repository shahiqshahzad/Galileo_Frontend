import axios from "utils/axios";
import { all, fork, put, takeLatest, select } from "redux-saga/effects";
import {
  ACTIVITY_STATUS_LOADER,
  GET_ALL_BRAND_ACTIVITY,
  GET_BRAND_ACTIVITY_DETAIL,
  GET_BRAND_ACTIVITY_STATUS,
  UPDATE_BRAND_ACTIVITY_STATUS,
  UPDATE_DETAIL_AND_LINK_ACTIVITY
} from "./constants";
import {
  activityStatusLoaderSuccess,
  getAllBrandActivitySuccess,
  getBrandActivityDetailSuccess,
  getBrandActivityStatusSuccess
} from "./actions";
import { makeSelectAuthToken } from "store/Selector";
import { setNotification } from "shared/helperMethods/setNotification";
import { getMyActivitySubAdminDetailSuccess } from "redux/subAdmin/actions";
import { sagaErrorHandler } from "shared/helperMethods/sagaErrorHandler";

function* getAllbrandActivity({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.get(
      `/get-order-activity?status=${payload.status}&page=${payload.page}&size=10`,
      headers
    );
    yield put(getAllBrandActivitySuccess(response.data.data));
    payload.setActivityLoader(false);
  } catch (error) {
    payload.setActivityLoader(false);
  }
}

export function* watchAllBrandActivity() {
  yield takeLatest(GET_ALL_BRAND_ACTIVITY, getAllbrandActivity);
}

function* updateBrandStatusActivity({ payload }) {
  try {
    if (payload.data.shipmentStatus === "Delivered") {
      yield put(activityStatusLoaderSuccess(true));
    }
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.post(`/update-shipment-status`, payload.data, headers);
    const responsed = yield axios.get(`/get-order-details?orderNumber=${payload.data.orderNumber}`, headers);
    const responsedSubadmin = yield axios.get(
      `/brand/get-order-details-for-return?orderNumber=${payload.data.orderNumber}`,
      headers
    );

    yield put(getMyActivitySubAdminDetailSuccess(responsedSubadmin.data.data));
    yield put(getBrandActivityDetailSuccess(responsed.data.data));
    yield setNotification("success", response.data.message);
    payload.setNftData({});
    payload.setIsModalOpen(false);
    payload.setStatusLoader(false);
    if (payload?.data?.frontEndReceipt) {
      yield put(activityStatusLoaderSuccess(false));
    }
  } catch (error) {
    payload.setNftData({});
    payload.setIsModalOpen(false);
    payload.setStatusLoader(false);
    yield put(activityStatusLoaderSuccess(false));
    yield sagaErrorHandler(error.response.data.data);
  }
}

export function* watchUpdateStatusActivity() {
  yield takeLatest(UPDATE_BRAND_ACTIVITY_STATUS, updateBrandStatusActivity);
}
function* updateDetailActivity({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.put(`/update-order-details`, payload.data, headers);
    const responsed = yield axios.get(`/get-order-details?orderNumber=${payload.data.orderNumber}`, headers);
    const responsedSubadmin = yield axios.get(
      `/brand/get-order-details-for-return?orderNumber=${payload.data.orderNumber}`,
      headers
    );
    yield put(getMyActivitySubAdminDetailSuccess(responsedSubadmin.data.data));
    yield put(getBrandActivityDetailSuccess(responsed.data.data));
    yield setNotification("success", response.data.message);

    payload.setNftData({});
    payload.formikTrackingLink.resetForm();
    payload.setIsModalOpen(false);
    payload.setTrackLinkLoader(false);
  } catch (error) {
    payload.setNftData({});
    payload.setIsModalOpen(false);
    payload.setTrackLinkLoader(false);
  }
}
export function* watchUpdateLinkActivity() {
  yield takeLatest(UPDATE_DETAIL_AND_LINK_ACTIVITY, updateDetailActivity);
}
function* getBrandActivityDetail({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.get(`/get-order-details?orderNumber=${payload.orderId}`, headers);
    yield put(getBrandActivityDetailSuccess(response.data.data));
    if (payload?.setLoader) {
      payload.setLoader(false);
    }
  } catch (error) {
    if (payload?.setLoader) {
      payload.setLoader(false);
    }
  }
}

export function* watchBrandActivityDetail() {
  yield takeLatest(GET_BRAND_ACTIVITY_DETAIL, getBrandActivityDetail);
}
function* getBrandActivityStatus() {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.get(`/brand/admin/redeem-status`, headers);
    yield put(getBrandActivityStatusSuccess(response.data.data.statuses));
  } catch (error) {}
}
export function* watchBrandActivityStatus() {
  yield takeLatest(GET_BRAND_ACTIVITY_STATUS, getBrandActivityStatus);
}

function* activityStatusLoader({ payload }) {
  yield put(activityStatusLoaderSuccess(payload));
}
export function* watchActivityStatusLoader() {
  yield takeLatest(ACTIVITY_STATUS_LOADER, activityStatusLoader);
}
export default function* brandActivitySaga() {
  yield all([
    fork(watchAllBrandActivity),
    fork(watchBrandActivityDetail),
    fork(watchUpdateStatusActivity),
    fork(watchBrandActivityStatus),
    fork(watchUpdateLinkActivity),
    fork(watchActivityStatusLoader)
  ]);
}
