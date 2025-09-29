import axios from "utils/axios";
import { all, fork, put, takeLatest, select } from "redux-saga/effects";
import { sagaErrorHandler } from "shared/helperMethods/sagaErrorHandler";
import { makeSelectAuthToken } from "store/Selector";
import { getAllBrands, getAllBrandsSuccess, getAllBrandsByAdminSuccess } from "./actions";
import {
  GET_ALL_BRANDS,
  ADD_BRAND,
  UPDATE_BRAND,
  UPDATE_PROPERTY,
  DELETE_BRAND,
  GET_ALL_BRANDS_BY_ADMIN
} from "./constants";
import { setNotification } from "shared/helperMethods/setNotification";
import { getnftData } from "redux/landingPage/actions";
// import { getAllMarketplaceNftsByCategorySuccess } from 'redux/marketplace/actions';
function* getAllBrandsByAdminRequest({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.get(
      `brandsByAdmin/${payload.id}?size=${payload.limit}&page=${payload.page}&search=${payload.search}`,
      headers
    );
    yield put(getAllBrandsByAdminSuccess(response.data.data));
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}

export function* watchGetAllBrandsByAdmin() {
  yield takeLatest(GET_ALL_BRANDS_BY_ADMIN, getAllBrandsByAdminRequest);
}
function* getAllBrandsRequest({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.get(
      `brand?size=${payload.limit}&page=${payload.page}&search=${payload.search}`,
      headers
    );
    yield put(getAllBrandsSuccess(response.data.data));
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}

export function* watchGetAllBrands() {
  yield takeLatest(GET_ALL_BRANDS, getAllBrandsRequest);
}

function* addBrandRequest({ payload }) {
  const { name, location, description, image, ...socials } = payload;
  const formData = new FormData();
  formData.append("name", name);
  formData.append("location", location);
  formData.append("description", description);
  formData.append("image", image);

  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };

    // Make request to create brand
    const response = yield axios.post(`brand`, formData, headers);

    // Get brandId from the response
    const brandId = response.data?.data?.brand?.id;

    // Remove empty strings from the `socials` object
    Object.keys(socials).forEach((key) => socials[key] === "" && delete socials[key]);

    // socials contains page and limit but we don't want to send them
    delete socials.page;
    delete socials.limit;

    // Make request to create socials
    yield axios.post(`brand/${brandId}/socials`, socials, headers);

    yield put(
      getAllBrands({
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

export function* watchAddBrand() {
  yield takeLatest(ADD_BRAND, addBrandRequest);
}

function* updateBrandRequest({ payload }) {
  const { name, location, description, image, brandId, ...socials } = payload;
  const formData = new FormData();
  formData.append("name", name);
  formData.append("location", location);
  formData.append("description", description);
  formData.append("image", image);

  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };

    // Make request to update brand
    const response = yield axios.put(`brand/${brandId}`, formData, headers);

    // Remove empty strings from the `socials` object
    Object.keys(socials).forEach((key) => socials[key] === "" && delete socials[key]);

    // socials contains page and limit but we don't want to send them
    delete socials.page;
    delete socials.limit;

    // Make request to update socials
    yield axios.put(`brand/${brandId}/socials`, socials, headers);

    yield put(
      getAllBrands({
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

export function* watchUpdateBrand() {
  yield takeLatest(UPDATE_BRAND, updateBrandRequest);
}

function* updatePropertyRequest({ payload }) {
  const formData = new FormData();
  formData.append("trait_type", payload.trait_type);
  formData.append("value", payload.value);
  formData.append("file", payload.file);

  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.put(`/update/nftMetaData/${payload.id}`, formData, headers);
    yield put(
      getnftData({
        id: payload.nftid
      })
    );
    payload.handleClose();
    // payload.navigate('/creatorProfile');
    yield setNotification("success", response.data.message);
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}

export function* watchPropertyBrand() {
  yield takeLatest(UPDATE_PROPERTY, updatePropertyRequest);
}

function* deleteBrandRequest({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.delete(`brand/${payload.id}`, headers);
    yield put(
      getAllBrands({
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

export function* watchDeleteBrand() {
  yield takeLatest(DELETE_BRAND, deleteBrandRequest);
}

export default function* brandSaga() {
  yield all([
    fork(watchGetAllBrands),
    fork(watchAddBrand),
    fork(watchPropertyBrand),
    fork(watchDeleteBrand),
    fork(watchUpdateBrand),
    fork(watchGetAllBrandsByAdmin)
  ]);
}
