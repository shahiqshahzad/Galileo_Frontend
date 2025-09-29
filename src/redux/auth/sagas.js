import axios from "../../utils/axios";
import { all, fork, put, takeLatest, select } from "redux-saga/effects";
import {
  LOGIN,
  DELETE_WALLET,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  SIGN_UP,
  SIGN_UP_SOCIAL,
  UPDATE_EMAIL,
  CHANGE_PASSWORD,
  DASHBOARD,
  BRAND_DASHBOARD,
  VERIFY,
  EMAIL_RESEND,
  EDIT_PROFILE_REQUEST,
  SUPPORT_REQUEST,
  RESTRICT_APPLICATION,
  IS_KYC_POPUP_SHOWN_TO_USER,
  SOCKET_CONNECTION
} from "./constants";

import {
  loginSuccess,
  signupSuccess,
  signupsocialSuccess,
  setLoader,
  dashboardSuccess,
  branddashboardSuccess,
  editProfileSuccess,
  supportRequestSuccess,
  updateEmailSuccess,
  is_kyc_popup_shown_to_userSuccess,
  restrictApplicationSuccess,
  socketConnectionSuccess
} from "./actions";
import { makeSelectAuthToken } from "store/Selector";

import { sagaErrorHandler } from "../../shared/helperMethods/sagaErrorHandler";
import { setNotification } from "../../shared/helperMethods/setNotification";
import { createGoogleAnalyticsForSignup } from "utils/googleAnalytics";
import { SIGNUP_METHODS } from "utils/constants";

function* loginUser({ payload }) {
  try {
    let data = {
      email: payload.email,
      password: payload.password
    };
    const response = yield axios.post(`/auth/login`, data);
    yield put(setLoader(false));
    yield setNotification("success", response.data.message);
    const kycStatus = response.data.data;
    yield put(loginSuccess(kycStatus));
    let user = response.data.data.user;

    if (user && user?.role === "Sub Admin") {
      let url = `/nftManagement/${user?.CategoryId}/${user?.BrandId}?pageNumber=1&filter=draft`;
      payload.navigate(url);
    } else {
      payload.navigate("/home");
    }
  } catch (error) {
    yield put(setLoader(false));
    if (error.response.data.data.message === "User is not verified") {
      payload.navigate("/emailVerify");
      return;
    }
    yield sagaErrorHandler(error.response.data.data);
  }
}

function* dashboard() {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.get(`/adminDashboard`, headers);

    yield put(dashboardSuccess(response.data.data));
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}
function* branddashboard({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.get(`/brandAdminDashboard/${payload.brandId}`, headers);

    yield put(branddashboardSuccess(response.data.data));
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}
function* updateEmailRequest({ payload }) {
  let data = {
    email: payload.email
  };
  try {
    const response = yield axios.put(`auth/signup/email-update?id=${payload.id}`, data);
    yield setNotification("success", response.data.message);
    yield put(updateEmailSuccess(response.data.data));

    payload.handleClose();
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}

export function* watchUpdateEmail() {
  yield takeLatest(UPDATE_EMAIL, updateEmailRequest);
}
function* is_kyc_popup_shown_to_userRequest({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.patch(`users/update-kyc-popup-status`, {}, headers);
    yield put(is_kyc_popup_shown_to_userSuccess(response.data.data));

    payload.handleClose();
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}

export function* watchUpdateiskyc() {
  yield takeLatest(IS_KYC_POPUP_SHOWN_TO_USER, is_kyc_popup_shown_to_userRequest);
}

function* resendEmailRequest({ payload }) {
  try {
    // let data = ''
    const response = yield axios.post(`auth/resendCode?id=${payload.id}`);

    yield setNotification("success", response.data.message);
    payload.navigate("/emailVerify");
  } catch (error) {
    yield sagaErrorHandler(error.response.data);
  }
}

export function* watchresendEmail() {
  yield takeLatest(EMAIL_RESEND, resendEmailRequest);
}

function* signupUserRequest({ payload }) {
  payload.setLoader(true);
  try {
    let data = {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      // password: payload.password,
      walletAddress: payload.walletAddress,
      address: payload.address,
      isResidentInEurope: payload.isResidentInEurope,
      emailOptIn: payload.emailOptIn,
      agreedToTerms: payload.termsAndConditions,
      referalCode: payload.referalCode,
      signupMethod: payload.signupMethod
    };
    const headers = { headers: { Authorization: `Bearer ${payload.token}` } };
    const response = yield axios.post(`/auth/signup`, data, headers);
    if (payload?.referalCode) {
      createGoogleAnalyticsForSignup({ signupMethod: SIGNUP_METHODS.REFERAL });
    } else {
      createGoogleAnalyticsForSignup({ signupMethod: SIGNUP_METHODS.ORGANIC });
    }
    payload.setLoader(false);

    yield setNotification("success", response.data.message);
    yield put(signupSuccess(response.data.data));
    if (response?.data?.data?.user?.isVerified) {
      payload.navigate("/home");
    } else {
      payload.navigate("/emailVerify");
    }
  } catch (error) {
    payload.setLoader(false);

    if (error.response.data.data.message === "User is not verified") {
      payload.navigate("/emailVerify");
      return;
    }
    yield sagaErrorHandler(error.response.data.data);
  }
}
function* signupSocialUserRequest({ payload }) {
  try {
    let data = {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      walletAddress: payload.walletAddress,
      isEuropeanResident: payload.isEuropeanResident,
      agreedToTerms: payload.termsAndConditions,
      emailOptIn: payload.emailOptIn,
      referalCode: payload.referalCode
    };
    const response = yield axios.post(`/auth/socialSignup`, data);

    yield put(setLoader(false));
    if (payload.referalCode) {
      createGoogleAnalyticsForSignup({ signupMethod: SIGNUP_METHODS.REFERAL });
    } else {
      createGoogleAnalyticsForSignup({ signupMethod: SIGNUP_METHODS.ORGANIC });
    }
    yield setNotification("success", response.data.message);
    yield put(signupsocialSuccess(response.data.data));
    payload.navigate("/home");
  } catch (error) {
    yield put(setLoader(false));
    yield sagaErrorHandler(error.response.data.data);
  }
}
function* forgetPasswordRequest({ payload }) {
  let data = {
    email: payload.email
  };
  try {
    const response = yield axios.post(`auth/forgetPassword`, data);
    yield put(setLoader(false));
    yield setNotification("success", response.data.message);
    payload.navigate("/login");
  } catch (error) {
    yield put(setLoader(false));
    yield sagaErrorHandler(error.response.data.data);
  }
}

function* resetPasswordRequest({ payload }) {
  let data = {
    newPassword: payload.newPassword,
    token: payload.token
  };
  try {
    const response = yield axios.put(`auth/resetPassword`, data);

    yield setNotification("success", response.data.message);
    payload.navigate("/login");
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}
function* verifyRequest({ payload }) {
  let data = {
    token: payload.token
  };
  try {
    const response = yield axios.put(`users/verify/email`, data);
    yield setNotification("success", response?.data?.message);
    if (data) {
      window.open("/login", "_self");
      // payload.navigate("/login");
    }
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
    setTimeout(() => {
      // payload.navigate("/login");
      window.open("/login", "_self");
    }, 6000);
  }
}

function* changePasswordRequest({ payload }) {
  let data = {
    newPassword: payload.newPassword,
    currentPassword: payload.currentPassword
  };
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };

    const response = yield axios.put(`auth/changePassword`, data, headers);
    yield setNotification("success", response.data.message);
    // payload.navigate("/login");
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}

function* editProfileSaga({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };

    // Check if payload includes files
    let data;
    if (payload.profileImg || payload.bannerImg) {
      // Create a new FormData instance
      data = new FormData();

      // Append all fields to the FormData
      for (let key in payload) {
        data.append(key, payload[key]);
      }
    } else {
      data = payload;
    }

    const response = yield axios.put(`/auth/updateProfile`, data, headers);

    const transformedUser = {
      user: {
        id: response.data.data.user.id,
        firstName: response.data.data.user.firstName,
        lastName: response.data.data.user.lastName,
        email: response.data.data.user.email,
        walletAddress: response.data.data.user.walletAddress,
        address: response.data.data.user.address,
        isVerified: response.data.data.user.isVerified,
        createdAt: response.data.data.user.createdAt,
        role: response.data.data.user.role,
        UserKyc: response.data.data.user.UserKyc,
        UserAddresses: response.data.data.user.UserAddresses,
        signupMethod: response.data.data.user.signupMethod,
        isKycPopupShownToUser: response.data.data.user.isKycPopupShownToUser,
        UserProfile: {
          profileImg: response.data.data.userProfile.profileImg,
          bannerImg: response.data.data.userProfile.bannerImg,
          description: response.data.data.userProfile.description
        }
      }
    };

    yield put(editProfileSuccess(transformedUser));
    yield setNotification("success", response.data.message);
  } catch (error) {
    if (error.response && error.response.data && error.response.data.data) {
      yield sagaErrorHandler(error.response.data.data);
    } else {
      console.log(error);
    }
  }
}
function* supportRequestSaga({ payload }) {
  try {
    let data = {
      subject: payload.subject,
      query: payload.query
    };
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.post(`/users/send-query`, data, headers);
    yield put(setLoader(false));
    yield setNotification("success", response.data.message);
    yield put(supportRequestSuccess(response.data.data));
    payload.handleClose();
  } catch (error) {
    yield put(setLoader(false));
    yield sagaErrorHandler(error.response.data.data);
  }
}
function* deleteWalletRequest({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    // eslint-disable-next-line no-unused-vars
    const response = yield axios.delete(`/users/cancelSignup`, headers);

    // payload.navigate('/');
    // yield setNotification('success', response.data.message);
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}
function* restrictApplicationRequest() {
  try {
    const response = yield axios.get("/users/get-location");
    yield put(restrictApplicationSuccess(response.data.data));
  } catch (error) {}
}

function* socketConnection({ payload }) {
  try {
    yield put(socketConnectionSuccess(payload));
  } catch (error) {
    console.log(error);
  }
}
export function* watchSocketConnection() {
  yield takeLatest(SOCKET_CONNECTION, socketConnection);
}
export function* watchDeleteWallet() {
  yield takeLatest(DELETE_WALLET, deleteWalletRequest);
}

export function* watchLogin() {
  yield takeLatest(LOGIN, loginUser);
}
export function* watchDashboard() {
  yield takeLatest(DASHBOARD, dashboard);
}
export function* watchBrandDashboard() {
  yield takeLatest(BRAND_DASHBOARD, branddashboard);
}

export function* watchSignup() {
  yield takeLatest(SIGN_UP, signupUserRequest);
}
export function* watchSocialSignup() {
  yield takeLatest(SIGN_UP_SOCIAL, signupSocialUserRequest);
}

export function* watchForgot() {
  yield takeLatest(FORGOT_PASSWORD, forgetPasswordRequest);
}

export function* watchReset() {
  yield takeLatest(RESET_PASSWORD, resetPasswordRequest);
}
export function* watchVerify() {
  yield takeLatest(VERIFY, verifyRequest);
}
export function* watchchangePassword() {
  yield takeLatest(CHANGE_PASSWORD, changePasswordRequest);
}
export function* watchRestrictApplication() {
  yield takeLatest(RESTRICT_APPLICATION, restrictApplicationRequest);
}
export function* watchEditProfile() {
  yield takeLatest(EDIT_PROFILE_REQUEST, editProfileSaga);
}
export function* watchsupportRequest() {
  yield takeLatest(SUPPORT_REQUEST, supportRequestSaga);
}

export default function* authSaga() {
  yield all([
    fork(watchLogin),
    fork(watchVerify),

    fork(watchForgot),
    fork(watchReset),
    fork(watchDeleteWallet),
    fork(watchsupportRequest),

    fork(watchSignup),
    fork(watchUpdateEmail),
    fork(watchresendEmail),
    fork(watchSocialSignup),
    fork(watchchangePassword),
    fork(watchDashboard),
    fork(watchBrandDashboard),
    fork(watchUpdateiskyc),
    fork(watchSocketConnection),
    fork(watchEditProfile),
    fork(watchRestrictApplication)
  ]);
}
