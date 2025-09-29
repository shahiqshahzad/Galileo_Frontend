import axios from "utils/axios";
import { all, fork, put, takeLatest, select } from "redux-saga/effects";
import { sagaErrorHandler } from "shared/helperMethods/sagaErrorHandler";
import { makeSelectAuthToken } from "store/Selector";
import { getAllCategories, getAllCategoriesSuccess, getAllCategoriesByBrandSuccess } from "./actions";
import {
  GET_ALL_CATEGORIES,
  ADD_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
  GET_ALL_CATEGORIES_BY_BRAND
} from "./constants";
import { setNotification } from "shared/helperMethods/setNotification";

function* getAllCategoriesRequest({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.get(
      `/category/all?size=${payload.limit}&page=${payload.page}&search=${payload.search}`,
      headers
    );
    yield put(getAllCategoriesSuccess(response.data.data));
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}

export function* watchGetAllCategories() {
  yield takeLatest(GET_ALL_CATEGORIES, getAllCategoriesRequest);
}

function* addCategoryRequest({ payload }) {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("description", payload.description);
  formData.append("image", payload.image);
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.post(`/category`, formData, headers);
    yield put(
      getAllCategories({
        search: payload.search,
        page: payload.page,
        limit: payload.limit
      })
    );
    payload.handleClose();
    yield setNotification("success", response.data.message);
    payload.setLoader(false);
  } catch (error) {
    payload.setLoader(false);
    yield sagaErrorHandler(error.response.data.data);
  }
}

export function* watchAddCategory() {
  yield takeLatest(ADD_CATEGORY, addCategoryRequest);
}

function* updateCategoryRequest({ payload }) {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("description", payload.description);
  formData.append("image", payload.image);
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.put(`/category/${payload.categoryId}`, formData, headers);
    yield put(
      getAllCategories({
        search: payload.search,
        page: payload.page,
        limit: payload.limit
      })
    );
    payload.handleClose();
    yield setNotification("success", response.data.message);
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}

export function* watchUpdateCategory() {
  yield takeLatest(UPDATE_CATEGORY, updateCategoryRequest);
}

function* deleteCategoryRequest({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.delete(`category/${payload.categoryId}`, headers);
    yield put(
      getAllCategories({
        search: payload.search,
        page: payload.page,
        limit: payload.limit
      })
    );
    payload.handleClose();
    yield setNotification("success", response.data.message);
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}

export function* watchDeleteCategory() {
  yield takeLatest(DELETE_CATEGORY, deleteCategoryRequest);
}

function* getAllCategoryByBrandRequest({ payload }) {
  try {
    const headers = { headers: { "auth-token": yield select(makeSelectAuthToken()) } };
    const response = yield axios.get(`admin/category/getAllCategoriesByBrand/${payload.brandId}`, headers);
    yield put(getAllCategoriesByBrandSuccess(response.data.data));
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}

export function* watchGetAllCategoryByBrand() {
  yield takeLatest(GET_ALL_CATEGORIES_BY_BRAND, getAllCategoryByBrandRequest);
}

export default function* categorySaga() {
  yield all([
    fork(watchGetAllCategories),
    fork(watchAddCategory),
    fork(watchDeleteCategory),
    fork(watchUpdateCategory),
    fork(watchGetAllCategoryByBrand)
  ]);
}
