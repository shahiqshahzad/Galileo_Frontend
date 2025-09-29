import { all } from "redux-saga/effects";
import authSaga from "../redux/auth/sagas";
import categorySaga from "redux/categories/sagas";
import brandSaga from "redux/brand/sagas";
import brandadminSaga from "redux/brandAdmin/sagas";
import brandCategorySaga from "redux/brandCategory/sagas";
import subAdminSaga from "redux/subAdmin/sagas";
import nftSaga from "redux/nftManagement/sagas";
import landingPageSaga from "redux/landingPage/sagas";
import marketplaceSaga from "redux/marketplace/sagas";
import deliverySaga from "redux/deliveryDashboard/sagas";
import permissionedSaga from "redux/permissioned/sagas";
import addressesSaga from "redux/addresses/sagas";
import allActivitySaga from "redux/activity/sagas";
import brandActivitySaga from "redux/brandActivityDashboard/saga";
import currencySaga from "redux/generalSettingSuperadmin/sagas";

export default function* rootSaga() {
  yield all([
    authSaga(),
    brandSaga(),
    brandadminSaga(),
    brandCategorySaga(),
    categorySaga(),
    addressesSaga(),
    subAdminSaga(),
    nftSaga(),
    landingPageSaga(),
    marketplaceSaga(),
    deliverySaga(),
    permissionedSaga(),
    allActivitySaga(),
    brandActivitySaga(),
    currencySaga()
  ]);
}
