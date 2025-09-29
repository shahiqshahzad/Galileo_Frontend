import axios from "utils/axios";
import { all, fork, put, takeLatest, select } from "redux-saga/effects";
import { sagaErrorHandler } from "shared/helperMethods/sagaErrorHandler";
import { makeSelectAuthToken } from "store/Selector";
import { getDeliveryDashboardSuccess, getAllProductsSuccess, getDeliveryDashboard } from "./actions";
import { GET_ALL_PRODUCT, GET_ALL_DELIVERY_DASHBOARD, CHANGE_STATUS } from "./constants";
import { setNotification } from "shared/helperMethods/setNotification";

function* getAllProductRequest({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.get(`/delivery?walletAddress=${payload.walletAddress}&page=1&size=10`, headers);
    yield put(getAllProductsSuccess(response.data.data.deliveries.rows));
  } catch (error) {
    // yield sagaErrorHandler(error.response.data.data);
  }
}

export function* watchGetAllProducts() {
  yield takeLatest(GET_ALL_PRODUCT, getAllProductRequest);
}

function* getDeliveryDashRequest({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.get(`/delivery/brand/${payload.brand}?page=1&size=10`, headers);
    yield put(getDeliveryDashboardSuccess(response.data.data.deliveries.rows));
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}

export function* watchGetAllDeliveryDashs() {
  yield takeLatest(GET_ALL_DELIVERY_DASHBOARD, getDeliveryDashRequest);
}

function* changeStatusRequest({ payload }) {
  let data = {
    status: payload.status
  };
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.put(`/update/delivery/${payload.delivery}/brand/${payload.brand}`, data, headers);
    yield put(
      getDeliveryDashboard({
        page: 1,
        size: 10,
        brand: payload.brand
      })
    );
    payload.handleClose();
    yield setNotification("success", response.data.message);
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}

export function* watchChangeStatus() {
  yield takeLatest(CHANGE_STATUS, changeStatusRequest);
}

export default function* deliverySaga() {
  yield all([fork(watchGetAllProducts), fork(watchGetAllDeliveryDashs), fork(watchChangeStatus)]);
}
