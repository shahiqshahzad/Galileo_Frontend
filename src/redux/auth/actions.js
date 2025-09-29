import {
  LOGIN,
  LOGIN_SUCCESS,
  UPDATE_EMAIL,
  EMAIL_RESEND,
  DELETE_WALLET,
  SIGN_UP,
  SIGN_UP_SUCCESS,
  SIGN_UP_SOCIAL,
  SIGN_UP_SOCIAL_SUCCESS,
  LOGOUT,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  SET_WALLET_ADDRESS,
  SET_LOADER,
  CHANGE_PASSWORD,
  DASHBOARD,
  DASHBOARD_SUCCESS,
  BRAND_DASHBOARD,
  BRAND_DASHBOARD_SUCCESS,
  VERIFY,
  VERIFY_SUCCESS,
  EDIT_PROFILE_SUCCESS,
  EDIT_PROFILE_REQUEST,
  SUPPORT_REQUEST,
  SUPPORT_REQUEST_SUCCESS,
  UPDATE_EMAIL_SUCCESS,
  RESTRICT_APPLICATION,
  RESTRICT_APPLICATION_SUCCESS,
  KYC_NOTIFICATION_SUCCESS,
  IS_KYC_POPUP_SHOWN_TO_USER,
  IS_KYC_POPUP_SHOWN_TO_USER_SUCCESS,
  GET_DROPDOWN_VALUE,
  SOCKET_CONNECTION,
  SOCKET_CONNECTION_SUCCESS
} from "./constants";

export const is_kyc_popup_shown_to_user = (data) => {
  return {
    type: IS_KYC_POPUP_SHOWN_TO_USER,
    payload: data
  };
};
export const is_kyc_popup_shown_to_userSuccess = (data) => {
  return {
    type: IS_KYC_POPUP_SHOWN_TO_USER_SUCCESS,
    payload: data
  };
};
export const login = (data) => {
  return {
    type: LOGIN,
    payload: data
  };
};

export const loginSuccess = (data) => {
  return {
    type: LOGIN_SUCCESS,
    payload: data
  };
};
export const dashboard = (data) => {
  return {
    type: DASHBOARD,
    payload: data
  };
};

export const dashboardSuccess = (data) => {
  return {
    type: DASHBOARD_SUCCESS,
    payload: data
  };
};
export const emailVerification = (data) => {
  return {
    type: VERIFY,
    payload: data
  };
};

export const emailVerificationSuccess = (data) => {
  return {
    type: VERIFY_SUCCESS,
    payload: data
  };
};
export const branddashboard = (data) => {
  return {
    type: BRAND_DASHBOARD,
    payload: data
  };
};

export const branddashboardSuccess = (data) => {
  return {
    type: BRAND_DASHBOARD_SUCCESS,
    payload: data
  };
};

export const signup = (data) => {
  return {
    type: SIGN_UP,
    payload: data
  };
};

export const signupSuccess = (data) => {
  return {
    type: SIGN_UP_SUCCESS,
    payload: data
  };
};
export const updateEmail = (data) => {
  return {
    type: UPDATE_EMAIL,
    payload: data
  };
};
export const updateEmailSuccess = (data) => {
  return {
    type: UPDATE_EMAIL_SUCCESS,
    payload: data
  };
};
export const resendEmail = (data) => {
  return {
    type: EMAIL_RESEND,
    payload: data
  };
};

export const signupsocial = (data) => {
  return {
    type: SIGN_UP_SOCIAL,
    payload: data
  };
};

export const signupsocialSuccess = (data) => {
  return {
    type: SIGN_UP_SOCIAL_SUCCESS,
    payload: data
  };
};

export const setLoader = (data) => {
  return {
    type: SET_LOADER,
    payload: data
  };
};

export const logout = () => {
  return {
    type: LOGOUT
  };
};
export const deleteWallet = (data) => {
  return {
    type: DELETE_WALLET,
    payload: data
  };
};

export const forgotPassword = (data) => {
  return {
    type: FORGOT_PASSWORD,
    payload: data
  };
};
export const resetPassword = (data) => {
  return {
    type: RESET_PASSWORD,
    payload: data
  };
};
export const changePassword = (data) => {
  return {
    type: CHANGE_PASSWORD,
    payload: data
  };
};
export const setWallet = (data) => {
  return {
    type: SET_WALLET_ADDRESS,
    payload: data
  };
};

export function editProfileRequest(data) {
  return {
    type: EDIT_PROFILE_REQUEST,
    payload: data
  };
}

export function editProfileSuccess(data) {
  return {
    type: EDIT_PROFILE_SUCCESS,
    payload: data
  };
}
export function supportRequest(data) {
  return {
    type: SUPPORT_REQUEST,
    payload: data
  };
}

export function supportRequestSuccess(data) {
  return {
    type: SUPPORT_REQUEST_SUCCESS,
    payload: data
  };
}

export function restrictApplication() {
  return {
    type: RESTRICT_APPLICATION
  };
}

export function restrictApplicationSuccess(data) {
  return {
    type: RESTRICT_APPLICATION_SUCCESS,
    payload: data
  };
}
export function getdropdownValue(data) {
  return {
    type: GET_DROPDOWN_VALUE,
    payload: data
  };
}

export function kycNotificationSuccess(data) {
  return {
    type: KYC_NOTIFICATION_SUCCESS,
    payload: data
  };
}

export function socketConnection(data) {
  return {
    type: SOCKET_CONNECTION,
    payload: data
  };
}

export function socketConnectionSuccess(data) {
  return {
    type: SOCKET_CONNECTION_SUCCESS,
    payload: data
  };
}
