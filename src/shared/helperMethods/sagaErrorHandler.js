import { put } from "redux-saga/effects";
import { logout } from "redux/auth/actions";
import { SNACKBAR_OPEN } from "store/actions";

export function* sagaErrorHandler(error) {
  if (error?.message === "Your account has been blocked!" || error?.message === "Your account has not verified yet!") {
    yield put(logout());
  } else {
    let message = error?.message === "Token not valid" ? "Session Expired" : error?.message ?? "Error";

    yield put({
      type: SNACKBAR_OPEN,
      open: true,
      message: message,
      variant: "alert",
      alertSeverity: "error",
      transition: "SlideRight",
      anchorOrigin: { vertical: "top", horizontal: "right" }
    });
  }
}
