import axios from "utils/axios";
import { all, fork, put, takeLatest, select } from "redux-saga/effects";
import { sagaErrorHandler } from "shared/helperMethods/sagaErrorHandler";
import { makeSelectAuthToken } from "store/Selector";
import { getAllCurrenciesSuccess, getAllChainSuccess } from "./actions";
import { GET_ALL_CURRENCIES, ADD_CURRENCY, GET_ALL_CHAIN } from "./constants";
import { setNotification } from "shared/helperMethods/setNotification";

function* getAllCurrencyRequest({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.get(`/admin/currency`, headers);
    yield put(getAllCurrenciesSuccess(response.data.data?.currencies));
    if (payload?.setLoading) {
      payload?.setLoading(false);
    }
  } catch (error) {
    yield sagaErrorHandler(error?.response?.data?.data || "Error");
    if (payload?.setLoading) {
      payload?.setLoading(false);
    }
  }
}

export function* watchGetAllCurrencies() {
  yield takeLatest(GET_ALL_CURRENCIES, getAllCurrencyRequest);
}
function* getAllChainRequest({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.get(`/admin/get-available-chains`, headers);
    yield put(getAllChainSuccess(response.data.data));
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}

export function* watchGetAllChain() {
  yield takeLatest(GET_ALL_CHAIN, getAllChainRequest);
}

function* addCurrencyRequest({ payload }) {
  const formData = new FormData();
  formData.append("contractAddress", payload.contractAddress);
  formData.append("chainId", payload.chainId);
  formData.append("currencySymbol", payload.currencySymbol);

  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };

    const response = yield axios.post(`/admin/currency`, formData, headers);
    // const responsed = yield axios.get(`/admin/currency`, headers);
    yield put(getAllCurrenciesSuccess(response.data.data?.currencies));

    payload.setLoader(false);
    payload.handleClose();
    yield setNotification("success", response.data.message);
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
    payload.setLoader(false);
    payload.handleClose();
  }
}

export function* watchAddCurrency() {
  yield takeLatest(ADD_CURRENCY, addCurrencyRequest);
}

export default function* currencySaga() {
  yield all([fork(watchGetAllCurrencies), fork(watchAddCurrency), fork(watchGetAllChain)]);
}
