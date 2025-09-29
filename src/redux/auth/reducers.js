/* eslint-disable no-unused-vars */
import produce from "immer";
import {
  LOGIN_SUCCESS,
  VERIFY_SUCCESS,
  SET_WALLET_ADDRESS,
  LOGOUT,
  SET_LOADER,
  SIGN_UP_SUCCESS,
  SIGN_UP_SOCIAL_SUCCESS,
  DASHBOARD_SUCCESS,
  BRAND_DASHBOARD_SUCCESS,
  EDIT_PROFILE_SUCCESS,
  UPDATE_EMAIL_SUCCESS,
  IS_KYC_POPUP_SHOWN_TO_USER_SUCCESS,
  RESTRICT_APPLICATION,
  RESTRICT_APPLICATION_SUCCESS,
  KYC_NOTIFICATION_SUCCESS,
  GET_DROPDOWN_VALUE,
  SOCKET_CONNECTION_SUCCESS
} from "./constants";
import { NOTIFICATION_COUNT } from "redux/marketplace/constants";

const INITIAL_STATE = {
  user: null,
  updatedUser: null,
  email: null,
  isKycPopupShownToUser: false,
  dahboardUser: null,
  branddahboardUser: null,
  socialuser: null,
  token: null,
  loader: false,
  walletAddress: null,
  Verify: null,
  dropdown: { isShowAll: "isShowAll" },
  restrictApplication: {},
  socketConnection: false
};

const AuthReducer = produce((draft, action) => {
  switch (action.type) {
    case EDIT_PROFILE_SUCCESS:
      draft.user = action.payload.user;
      draft.updatedUser = action.payload.user;
      break;
    case LOGIN_SUCCESS:
      draft.user = action.payload.user;
      draft.token = action.payload.token;

      break;
    case KYC_NOTIFICATION_SUCCESS:
      draft.user.UserKyc = action.payload?.UserKyc;
      draft.user.UserAddresses = action.payload?.UserAddresses;

      break;
    case VERIFY_SUCCESS:
      draft.Verify = action.payload;
      break;
    case DASHBOARD_SUCCESS:
      draft.dahboardUser = action.payload;
      break;
    case BRAND_DASHBOARD_SUCCESS:
      draft.branddahboardUser = action.payload;
      break;

    case SIGN_UP_SOCIAL_SUCCESS:
      draft.user = action.payload.user;
      draft.token = action.payload.token;
      break;
    case SIGN_UP_SUCCESS:
      draft.user = action.payload.user;
      draft.token = action.payload.token;
      break;
    case UPDATE_EMAIL_SUCCESS:
      draft.email = action.payload.email;
      break;
    case IS_KYC_POPUP_SHOWN_TO_USER_SUCCESS:
      draft.user.isKycPopupShownToUser = true;
      break;

    case SET_LOADER:
      draft.loader = action.payload;
      break;
    case SET_WALLET_ADDRESS:
      draft.walletAddress = action.payload;
      break;
    case LOGOUT:
      draft.user = null;
      draft.token = null;
      draft.walletAddress = null;
      break;
    case RESTRICT_APPLICATION_SUCCESS:
      draft.restrictApplication = action.payload;
      break;
    case GET_DROPDOWN_VALUE:
      draft.dropdown = action.payload;
      break;
    case SOCKET_CONNECTION_SUCCESS:
      draft.socketConnection = action.payload;
      break;
    default:
  }
}, INITIAL_STATE);

export default AuthReducer;
