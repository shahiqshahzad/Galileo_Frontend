import axios from "utils/axios";
import { makeSelectAuthToken } from "store/Selector";
import {
  getAllAddresses,
  getAllAddressesSuccess,
  getAllCategoryAddressesSuccess,
  getSupportedCarriersSuccess
} from "./actions";
import { setNotification } from "shared/helperMethods/setNotification";
import { all, fork, put, takeLatest, select } from "redux-saga/effects";
import { sagaErrorHandler } from "shared/helperMethods/sagaErrorHandler";
import {
  ADD_ADDRESS,
  DELETE_ADDRESS,
  UPDATE_ADDRESS,
  GET_ALL_ADDRESSES,
  SET_DEFAULT_ADDRESS,
  GET_SUPPORTED_CARRIERS,
  GET_ALL_CATEGORY_ADDRESSES
} from "./constants";

function* getAllAddressesRequest() {
  try {
    if (yield select(makeSelectAuthToken())) {
      const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
      const response = yield axios.get("users/addresses", headers);
      yield put(getAllAddressesSuccess(response.data.data));
    }
  } catch (error) {
    yield sagaErrorHandler(error?.response?.data?.data || "Error");
  }
}

export function* watchGetAllAddresses() {
  yield takeLatest(GET_ALL_ADDRESSES, getAllAddressesRequest);
}

function* addAddressRequest({ payload }) {
  try {
    payload.setLoader(true);
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.post("users/address", payload.data, headers);
    payload.handleClose();
    payload.resetForm();
    yield setNotification("success", response.data.message);
    yield put(getAllAddresses());
  } catch (error) {
    payload.setInvalidAddress(true);
    yield sagaErrorHandler(error?.response?.data?.data || "Error");
  } finally {
    payload.setLoader(false);
  }
}

export function* watchAddAddress() {
  yield takeLatest(ADD_ADDRESS, addAddressRequest);
}

function* updateAddressRequest({ payload }) {
  try {
    payload.setLoader(true);
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.put(`users/address/${payload.id}`, payload.data, headers);
    payload.handleClose();
    payload.resetForm();
    yield setNotification("success", response.data.message);
    yield put(getAllAddresses());
  } catch (error) {
    payload.setInvalidAddress(true);
    yield sagaErrorHandler(error?.response?.data?.data || "Error");
  } finally {
    payload.setLoader(false);
  }
}

export function* watchUpdateAddress() {
  yield takeLatest(UPDATE_ADDRESS, updateAddressRequest);
}

function* deleteAddressRequest({ payload }) {
  try {
    payload.setLoader(true);
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.delete(`users/address/${payload.id}`, headers);
    payload.handleClose();
    yield setNotification("success", response.data.message);
    yield put(getAllAddresses());
  } catch (error) {
    yield sagaErrorHandler(error?.response?.data?.data || "Error");
  } finally {
    payload.setLoader(false);
  }
}

export function* watchDeleteAddress() {
  yield takeLatest(DELETE_ADDRESS, deleteAddressRequest);
}

function* setDefaultAddressRequest({ payload }) {
  try {
    payload.setLoader(true);
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.put(`users/setDefaultAddress/${payload.id}`, {}, headers);
    payload.handleClose();
    yield setNotification("success", response.data.message);
    yield put(getAllAddresses());
  } catch (error) {
    yield sagaErrorHandler(error?.response?.data?.data || "Error");
  } finally {
    payload.setLoader(false);
  }
}

export function* watchSetDefaultAddress() {
  yield takeLatest(SET_DEFAULT_ADDRESS, setDefaultAddressRequest);
}

function* getSupportedCarriersRequest() {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.get("nft/getAllCarriers", headers);
    yield put(getSupportedCarriersSuccess(response.data.data.results));
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}

export function* watchGetSupportedCarriers() {
  yield takeLatest(GET_SUPPORTED_CARRIERS, getSupportedCarriersRequest);
}

function* getAllCategoryAddressesRequest({ payload }) {
  try {
    if (yield select(makeSelectAuthToken())) {
      const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
      const response = yield axios.get(
        `brand/sub-admin-address?categoryId=${payload.categoryId}&brandId=${payload.brandId}`,
        headers
      );
      yield put(getAllCategoryAddressesSuccess(response.data.data));
    }
  } catch (error) {
    yield sagaErrorHandler(error?.response?.data?.data || "Error");
  }
}

export function* watchGetAllCategoryAddresses() {
  yield takeLatest(GET_ALL_CATEGORY_ADDRESSES, getAllCategoryAddressesRequest);
}

export default function* addressesSaga() {
  yield all([
    fork(watchGetAllAddresses),
    fork(watchAddAddress),
    fork(watchDeleteAddress),
    fork(watchUpdateAddress),
    fork(watchSetDefaultAddress),
    fork(watchGetSupportedCarriers),
    fork(watchGetAllCategoryAddresses)
  ]);
}
