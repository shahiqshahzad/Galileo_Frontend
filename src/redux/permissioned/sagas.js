import axios from "utils/axios";
import { all, fork, put, takeLatest, select } from "redux-saga/effects";
import { sagaErrorHandler } from "shared/helperMethods/sagaErrorHandler";
import { makeSelectAuthToken } from "store/Selector";
import { getAllPermissionsSuccess, getAllPermissions } from "./actions";
import { GET_ALL_PERMISSIONS, MAKEPUBLIC, ADD_ADDRESS, UPDATE_ADDRESS, DELETE_ADDRESS } from "./constants";
import { setNotification } from "shared/helperMethods/setNotification";

function* getAllPermissionRequest({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };

    const response = yield axios.get(`permission?id=${payload.id}`, headers);

    yield put(getAllPermissionsSuccess(response.data.data));
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}

export function* watchGetAllPermission() {
  yield takeLatest(GET_ALL_PERMISSIONS, getAllPermissionRequest);
}

function* addAddressRequest({ payload }) {
  const formData = new FormData();
  formData.append("NftId", payload.NftId);
  formData.append("walletAddress", payload.walletAddress);
  formData.append("expTime", payload.expTime);
  formData.append("userTimezone", payload.userTimezone);
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.post(`/permission`, formData, headers);
    yield put(
      getAllPermissions({
        id: payload.id
      })
    );
    payload.handleClose();

    yield setNotification("success", response.data.message);
  } catch (error) {
    console.log(error, "error");
    // yield sagaErrorHandler(error.response.data.data);
  }
}

export function* watchAddAddress() {
  yield takeLatest(ADD_ADDRESS, addAddressRequest);
}
function* makepublicRequest({ payload }) {
  const formData = new FormData();
  formData.append("isPublic", payload.isPublic);

  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.put(`/permission/isPublic/${payload.id}`, formData, headers);

    yield setNotification("success", response.data.message);
  } catch (error) {
    console.log(error, "error");
    // yield sagaErrorHandler(error.response.data.data);
  }
}

export function* watchmakepublic() {
  yield takeLatest(MAKEPUBLIC, makepublicRequest);
}

function* updateAddressRequest({ payload }) {
  const formData = new FormData();
  formData.append("id", payload.id);
  formData.append("NftId", payload.NftId);
  formData.append("walletAddress", payload.walletAddress);
  formData.append("expTime", payload.expTime);
  formData.append("userTimezone", payload.userTimezone);

  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.put(`/permission`, formData, headers);
    yield put(
      getAllPermissions({
        id: payload.NftId
      })
    );
    payload.handleClose();
    yield setNotification("success", response.data.message);
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}

export function* watchUpdateAddress() {
  yield takeLatest(UPDATE_ADDRESS, updateAddressRequest);
}

function* deleteAddressRequest({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.delete(`/permission?id=${payload.id}`, headers);
    yield put(
      getAllPermissions({
        id: payload.NftId
      })
    );
    payload.handleClose();
    yield setNotification("success", response.data.message);
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}

export function* watchDeleteAddress() {
  yield takeLatest(DELETE_ADDRESS, deleteAddressRequest);
}

export default function* permissionedSaga() {
  yield all([
    fork(watchGetAllPermission),
    fork(watchAddAddress),
    fork(watchmakepublic),
    fork(watchDeleteAddress),
    fork(watchUpdateAddress)
  ]);
}
