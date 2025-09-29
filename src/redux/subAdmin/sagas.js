import axios from "utils/axios";
import { all, fork, put, takeLatest, select } from "redux-saga/effects";
import { sagaErrorHandler } from "shared/helperMethods/sagaErrorHandler";
import { makeSelectAuthToken } from "store/Selector";
import {
  fetchEarningsSuccess,
  fetchWithdrawHistroySuccess,
  ReleaseScheduledSuccess,
  getAllActivitySubAdminSuccess,
  getAllGeneralSettingSuccess,
  getAllSubAdminList,
  getAllSubAdminListSuccess,
  getGeneralSettingInfo,
  getAllCountriesList,
  getMyActivitySubAdminDetailSuccess,
  getAllCountriesListSuccess
} from "./actions";
import {
  GET_ALL_SUBADMIN_LIST,
  ADD_SUBADMIN,
  UPDATE_SUBADMIN,
  DELETE_SUBADMIN,
  CHANGE_SUBADMIN_STATUS,
  CHANGE_ROLE,
  CHANGE_SUBADMIN_MINTING_ACCESS,
  ASSIGN_BRANDCATEGORY,
  GET_ALL_GENERAL_SETTING_STATUS,
  DELETE_STATUS_SUBADMIN,
  ADD_GENERAL_SETTING_STATUS,
  OPTIONAL_COUNTRIES,
  ADD_GENERAL_CONTACT_INFO,
  FETCH_EARNINGS,
  FETCH_WITHDRAW_HISTORY,
  RELEASE_SCHEDULE,
  GET_ALL_MY_ACTIVITY_SUBADMIN,
  GET_MY_ACTIVITY_SUBADMIN_DETAIL,
  UPDATE_RETURN_MY_ACTIVITY_SUBADMIN,
  GET_COUNTRY_LIST
} from "./constants";
import { setNotification } from "shared/helperMethods/setNotification";
import { countries } from "utils/utilFunctions";
import { toast } from "react-toastify";
import { activityStatusLoaderSuccess } from "redux/brandActivityDashboard/actions";

function* getAllSubAdminListRequest({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.get(
      `admin?size=${payload.limit}&page=${payload.page}&search=${payload.search}`,
      headers
    );
    yield put(getAllSubAdminListSuccess(response.data.data));
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}
function* getAllGeneralSettingRequest({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.get(`brand/admin/redeem-status`, headers);
    yield put(getAllGeneralSettingSuccess(response.data.data.statuses));
    const generalInfoResponse = yield axios.get("brand/admin/contact-details", headers);
    yield put(getGeneralSettingInfo(generalInfoResponse.data.data.contactDetails));
    payload.setLoader(false);
  } catch (error) {
    yield sagaErrorHandler(error?.response?.data?.data);
  }
}

export function* watchGetAllGeneralSettingList() {
  yield takeLatest(GET_ALL_GENERAL_SETTING_STATUS, getAllGeneralSettingRequest);
}

function* deleteGeneralSettingRequest({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.delete(`redeem-status?redeemStatus=${payload}`, headers);
    yield put(getAllGeneralSettingSuccess(response.data.data.statues));
    yield setNotification("success", response.data.message);
  } catch (error) {
    yield setNotification("error", error.response.data.data.message);
  }
}

function* addGeneralSettingRequest({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.post("brand/admin/redeem-status", { redeemStatus: payload.status }, headers);
    yield put(getAllGeneralSettingSuccess(response.data.data.statuses));
    yield setNotification("success", response.data.message);
    payload.setStatusModal(false);
    payload.formik.resetForm();
  } catch (error) {
    yield setNotification("error", error.response.data.data.message);
  }
}
export function* watchAddGeneralSettingStatus() {
  yield takeLatest(ADD_GENERAL_SETTING_STATUS, addGeneralSettingRequest);
}

function* sellingRequest({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.post(
      "admin/operational-countries",
      {
        operationalCountries: payload.operationalCountries
      },
      headers
    );
    yield put(getAllCountriesList());

    payload.setLoader(true);
    yield setNotification("success", response.data.message);
  } catch (error) {
    yield setNotification("error", error.response.data.data.message);
    payload.setLoader(true);
  }
}
export function* watchOptionalCountries() {
  yield takeLatest(OPTIONAL_COUNTRIES, sellingRequest);
}

function* addGeneralContactRequest({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.post(
      "brand/admin/contact-details",
      { supportEmail: payload.email, contactNumber: payload.contactNumber },
      headers
    );
    const generalInfoResponse = yield axios.get("brand/admin/contact-details", headers);
    yield setNotification("success", response.data.message);
    yield put(getGeneralSettingInfo(generalInfoResponse.data.data.contactDetails));
  } catch (error) {
    yield sagaErrorHandler(error?.response?.data?.data?.message);
  }
}

export function* watchAddGeneralSettingContact() {
  yield takeLatest(ADD_GENERAL_CONTACT_INFO, addGeneralContactRequest);
}

export function* watchDeleteGeneralSetting() {
  yield takeLatest(DELETE_STATUS_SUBADMIN, deleteGeneralSettingRequest);
}

export function* watchGetAllSubAdminList() {
  yield takeLatest(GET_ALL_SUBADMIN_LIST, getAllSubAdminListRequest);
}

function* getAllCountryListRequest({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.get(`/admin/operational-countries`, headers);

    let { operationalCountries } = response.data.data;

    operationalCountries =
      operationalCountries !== undefined &&
      operationalCountries.map((shortCode) => {
        const countryObject = countries.find((country) => country.shortName === shortCode);
        return countryObject;
      });

    response.data.data.operationalCountries = operationalCountries;

    yield put(getAllCountriesListSuccess(response.data.data));
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}
export function* watchGetAllCountryList() {
  yield takeLatest(GET_COUNTRY_LIST, getAllCountryListRequest);
}

function* addSubAdminRequest({ payload }) {
  let data = {
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    password: payload.password,
    walletAddress: payload.walletAddress,
    brandCategory: payload.brandCategory,
    hasMintingAccess: true
  };
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.post(`admin`, data, headers);
    yield put(
      getAllSubAdminList({
        page: payload.page,
        limit: payload.limit,
        search: payload.search
      })
    );
    payload.handleClose();
    yield setNotification("success", response.data.message);
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
    payload.setLoader(false);
  }
}

export function* watchAddSubAdmin() {
  yield takeLatest(ADD_SUBADMIN, addSubAdminRequest);
}
function* updateSubAdminRequest({ payload }) {
  let data = {
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    password: payload.password,
    walletAddress: payload.walletAddress
  };
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.put(`admin/${payload.id}`, data, headers);
    yield put(
      getAllSubAdminList({
        page: payload.page,
        limit: payload.limit,
        search: payload.search
      })
    );
    payload.handleClose();
    yield setNotification("success", response.data.message);
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}

export function* watchUpdateSubAdmin() {
  yield takeLatest(UPDATE_SUBADMIN, updateSubAdminRequest);
}
function* assignBrandCategoryRequest({ payload }) {
  let data = {
    brandCategory: payload.brandCategory
  };
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.patch(`admin/assignBrandCategory/${payload.id}`, data, headers);
    yield put(
      getAllSubAdminList({
        page: payload.page,
        limit: payload.limit,
        search: payload.search
      })
    );
    payload.handleClose();
    yield setNotification("success", response.data.message);
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}

export function* watchAssignBrandCategory() {
  yield takeLatest(ASSIGN_BRANDCATEGORY, assignBrandCategoryRequest);
}

function* deleteSubAdminRequest({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.delete(`admin/${payload.id}`, headers);
    yield put(
      getAllSubAdminList({
        page: payload.page,
        limit: payload.limit,
        search: payload.search
      })
    );
    payload.handleClose();
    yield setNotification("success", response.data.message);
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}

export function* watchDeleteSubAdmin() {
  yield takeLatest(DELETE_SUBADMIN, deleteSubAdminRequest);
}

function* changeSubAdminStatusRequest({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.patch(`admin/${payload.id}`, {}, headers);
    yield put(
      getAllSubAdminList({
        page: payload.page,
        limit: payload.limit,
        search: payload.search
      })
    );
    payload.handleClose();
    yield setNotification("success", response.data.message);
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}

export function* watchChangeSubAdminStatus() {
  yield takeLatest(CHANGE_SUBADMIN_STATUS, changeSubAdminStatusRequest);
}
function* changeSubadminRoleRequest({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.patch(
      `/admin/changeRole/${payload.id}`,
      { brandCategoryId: payload?.brandCategoryId },
      headers
    );
    yield put(
      getAllSubAdminList({
        page: payload.page,
        limit: payload.limit,
        search: payload.search
      })
    );
    payload.handleClose();
    yield setNotification("success", response.data.message);
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}

export function* watchChangeSubAdminRole() {
  yield takeLatest(CHANGE_ROLE, changeSubadminRoleRequest);
}

function* changeSubAdminMintingAccessRequest({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.patch(`admin/mint/${payload.id}`, {}, headers);
    yield put(
      getAllSubAdminList({
        page: payload.page,
        limit: payload.limit,
        search: payload.search
      })
    );
    payload.handleClose();
    yield setNotification("success", response.data.message);
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}

export function* watchChangeSubAdminMintingAccess() {
  yield takeLatest(CHANGE_SUBADMIN_MINTING_ACCESS, changeSubAdminMintingAccessRequest);
}

function* fetchEarningsRequest({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.get(`admin/get-escrow-data`, headers);
    yield put(fetchEarningsSuccess(response.data.data));
  } catch (error) {
    yield sagaErrorHandler(error?.response?.data?.data || "Error");
  } finally {
    if (payload?.setLoading) {
      payload?.setLoading(false);
    }
  }
}

export function* watchfetchEarningsRequest() {
  yield takeLatest(FETCH_EARNINGS, fetchEarningsRequest);
}

function* fetchWithdrawHistoryRequest({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.get("/admin/get-escrow-withdraw-history", headers);
    yield put(fetchWithdrawHistroySuccess(response.data.data));
  } catch (error) {
    yield sagaErrorHandler(error?.response?.data?.data || "Error");
  } finally {
    if (payload?.setLoading) {
      payload?.setLoading(false);
    }
  }
}

export function* watchFetchWithdrawHistoryRequest() {
  yield takeLatest(FETCH_WITHDRAW_HISTORY, fetchWithdrawHistoryRequest);
}
function* ReleaseScheduledRequest({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.get("/admin/get-release-schedule-details", headers);
    yield put(ReleaseScheduledSuccess(response.data.data));
    payload.setStatusCode(response.status);
  } catch (error) {
    yield sagaErrorHandler(error?.response?.data?.data || "Error");
  } finally {
    if (payload?.setLoading) {
      payload?.setLoading(false);
    }
  }
}

export function* watchReleaseScheduled() {
  yield takeLatest(RELEASE_SCHEDULE, ReleaseScheduledRequest);
}

function* getSubAdminActivity({ payload }) {
  try {
    payload.setActivityLoader(true);
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.get(
      `/brand/sub-admin-activity?status=${payload.status}&page=${payload.page}&size=10`,
      headers
    );
    yield put(getAllActivitySubAdminSuccess(response.data.data));
    payload.setActivityLoader(false);
  } catch (error) {
    console.log(error);
  }
}
export function* watchGetSubAdminActivity() {
  yield takeLatest(GET_ALL_MY_ACTIVITY_SUBADMIN, getSubAdminActivity);
}
function* getSubAdminActivityDetail({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.get(`/brand/get-order-details-for-return?orderNumber=${payload.orderId}`, headers);
    yield put(getMyActivitySubAdminDetailSuccess(response.data.data));
    if (payload?.setLoader) {
      payload.setLoader(false);
    }
  } catch (error) {
    toast.error(error.response.data.data.message);
  }
}
export function* watchGetSubAdminActivityDetail() {
  yield takeLatest(GET_MY_ACTIVITY_SUBADMIN_DETAIL, getSubAdminActivityDetail);
}

function* updateSubadminActivityReturn({ payload }) {
  try {
    yield put(activityStatusLoaderSuccess(true));
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.post(`brand/make-return-request-decision`, payload, headers);
    const responsed = yield axios.get(
      `/brand/get-order-details-for-return?orderNumber=${payload.orderNumber}`,
      headers
    );
    yield put(getMyActivitySubAdminDetailSuccess(responsed.data.data));
    yield setNotification("success", response.data.message);
    payload.setOpen(false);
    if (payload?.fetchAfterMakeDecision) {
      payload?.fetchAfterMakeDecision();
    }
  } catch (error) {
    console.log("ERROR::::::::",error?.response);
    
    yield put(activityStatusLoaderSuccess(false));
    toast.error(error.response.data.message);
  }
}

export function* watchupdateSubadminActivityReturn() {
  yield takeLatest(UPDATE_RETURN_MY_ACTIVITY_SUBADMIN, updateSubadminActivityReturn);
}
export default function* subAdminSaga() {
  yield all([
    fork(watchGetAllSubAdminList),
    fork(watchAddSubAdmin),
    fork(watchUpdateSubAdmin),
    fork(watchDeleteSubAdmin),
    fork(watchChangeSubAdminStatus),
    fork(watchChangeSubAdminRole),
    fork(watchChangeSubAdminMintingAccess),
    fork(watchAssignBrandCategory),
    fork(watchGetAllGeneralSettingList),
    fork(watchDeleteGeneralSetting),
    fork(watchAddGeneralSettingStatus),
    fork(watchAddGeneralSettingContact),
    fork(watchfetchEarningsRequest),
    fork(watchFetchWithdrawHistoryRequest),
    fork(watchGetSubAdminActivity),
    fork(watchGetSubAdminActivityDetail),
    fork(watchupdateSubadminActivityReturn),
    fork(watchOptionalCountries),
    fork(watchGetAllCountryList),
    fork(watchReleaseScheduled)
  ]);
}
