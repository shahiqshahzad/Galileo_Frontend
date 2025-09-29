import { put } from "redux-saga/effects";
import { SNACKBAR_OPEN } from "store/actions";

// there are four types of alertSeverity (info,success,error,warning)

export function* setNotification(alertSeverity, message) {
  yield put({
    type: SNACKBAR_OPEN,
    open: true,
    message: message,
    variant: "alert",
    alertSeverity: alertSeverity,
    transition: "SlideRight",
    anchorOrigin: { vertical: "top", horizontal: "right" }
  });
}
