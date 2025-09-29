/* eslint-disable no-unused-vars */
import axios from "../../utils/axios";

import { all, fork, put, takeLatest, select } from "redux-saga/effects";
import { makeSelectAuthToken } from "store/Selector";
import {
  CHANGE_NOTIFICATION_ALL_STATUS,
  CHANGE_NOTIFICATION_STATUS,
  CLEAR_SEPARATE_NOTIFICATION,
  DELETE_NOTIFICATION,
  GET_ALL_MARKETPLACE_CATEGORIES,
  GET_ALL_MARKETPLACE_NFTS_BY_CATEGORY,
  GET_ALL_SIMILAR_PRODUCTS,
  GET_NOTIFICATION,
  GET_SEPARATE_NOTIFICATION,
  TRACKING_TOOL,
  UPDATE_ALL_MARKETPLACE_CATEGORIES,
  GET_ALL_CART_ITEMS,
  DELETE_CART_ITEM,
  GET_ALL_WISHLIST_ITEMS,
  DELETE_WISHLIST_ITEM,
  MOVE_TO_CART,
  MOVE_TO_WISHLIST,
  ADD_TO_CART,
  GET_SEARCH,
  UPDATE_CART_ITEM,
  ADD_TO_WISHLIST,
  GET_NOTIFICATION_FIRST_TIME,
  GET_RECENT_SEARCH,
  ADD_RECENT_NFT,
  DELETE_RECENT_SEARCH_NFT,
  GET_ALL_MARKETPLACE_SEARCH
} from "./constants";
import {
  getAllMarketplaceCategoriesSuccess,
  getAllMarketplaceNftsByCategorySuccess,
  getAllSimilarProductsSuccess,
  getNotificationsSuccess,
  getSeparateNotificaitonHighSuccess,
  getSeparateNotificaitonSuccess,
  getSeparateNotificationLowSuccess,
  getSeperateNotificationMediumSuccess,
  getTrackSuccess,
  getAllCartItemsSuccess,
  getAllCartItems,
  getAllWishlistItems,
  getAllWishlistItemsSuccess,
  getSearchSuccess,
  notificationCountIcon,
  getNotificationAllCount,
  getRecentSearchSuccess
} from "./actions";
import { sagaErrorHandler } from "../../shared/helperMethods/sagaErrorHandler";
import { setNotification } from "../../shared/helperMethods/setNotification";
import { setLoader } from "redux/auth/actions";
import { getnftData } from "redux/landingPage/actions";

function* trackingToolRequest({ payload }) {
  try {
    let data = {
      serialId: payload.serialId,
      tokenId: payload.tokenId,
      address: payload.address
    };
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.post(`nft/trackNFT`, data, headers);
    yield put(setLoader(false));
    // yield setNotification('success', response.data.message);
    yield put(getTrackSuccess(response.data.data));
  } catch (error) {
    yield put(setLoader(false));
    yield sagaErrorHandler(error.response.data.data);
    if (error.response.data.data) {
      payload.navigate("/home");
    }
  }
}

export function* watchTrackingTool() {
  yield takeLatest(TRACKING_TOOL, trackingToolRequest);
}

function* getAllSimilarProductsRequest({ payload }) {
  const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };

  try {
    const response = yield axios.get(
      `/nft/recommendedNfts?activeTab=${payload.activeTab}&size=${payload.limit}&page=${payload.page}`,
      headers
    );
    yield put(getAllSimilarProductsSuccess(response.data.data));
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}

function* deleteNotification({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.delete(`/notification/clear/${payload.notificationId}`, headers);
    const responsed = yield axios.get(`/homepage-notification`, headers);
    const responseAll = yield axios.get(`/notification?type=All&page=${1}&size=${5}`, headers);
    const notificationHome = yield axios.get(`/notification?type=${payload.value}&page=${1}&size=${5}`, headers);
    const notificationData = notificationHome.data.data.notifications;
    const notificationDataAll = responseAll.data.data.notifications;
    yield put(getNotificationAllCount(responseAll.data.data));
    yield put(getNotificationsSuccess(responsed.data.data));
    yield setNotification("success", response.data.message);
    switch (payload.value) {
      case "High":
        yield put(getSeparateNotificaitonHighSuccess(notificationData));
        yield put(getSeparateNotificaitonSuccess(notificationDataAll));
        break;
      case "Low":
        yield put(getSeparateNotificationLowSuccess(notificationData));
        yield put(getSeparateNotificaitonSuccess(notificationDataAll));

        break;
      case "Medium":
        yield put(getSeperateNotificationMediumSuccess(notificationData));
        yield put(getSeparateNotificaitonSuccess(notificationDataAll));
        break;
      default:
        break;
    }
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}

export function* watchdeleteNotifcation() {
  yield takeLatest(DELETE_NOTIFICATION, deleteNotification);
}

function* deleteSeparateNotification({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.delete(`/notification/clear/${payload.id}`, headers);
    const responsed = yield axios.get(
      `/notification?type=${payload.notificationValue}&page=${1}&size=${payload.page * 5}`,
      headers
    );
    const responseAll = yield axios.get(`/notification?type=All&page=${1}&size=${5}`, headers);
    yield setNotification("success", response.data.message);
    const notificationData = responsed.data.data.notifications;
    const notificationDataAll = responseAll.data.data.notifications;
    switch (payload.notificationValue) {
      case "High":
        yield put(getSeparateNotificaitonHighSuccess(notificationData));
        yield put(getSeparateNotificaitonSuccess(notificationDataAll));
        break;
      case "Low":
        yield put(getSeparateNotificationLowSuccess(notificationData));
        yield put(getSeparateNotificaitonSuccess(notificationDataAll));

        break;
      case "Medium":
        yield put(getSeperateNotificationMediumSuccess(notificationData));
        yield put(getSeparateNotificaitonSuccess(notificationDataAll));
        break;
      default:
        break;
    }
  } catch (error) {}
}

export function* watchDeleteSeperateNotification() {
  yield takeLatest(CLEAR_SEPARATE_NOTIFICATION, deleteSeparateNotification);
}
function* changeNotificationStatusAll() {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const responsed = yield axios.put(`/notification/mark-all-as-read`, {}, headers);
    const response = yield axios.get(`/homepage-notification`, headers);
    yield put(getNotificationsSuccess(response.data.data));
    yield setNotification("success", responsed.data.message);
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}

export function* watchChangeNotificationAll() {
  yield takeLatest(CHANGE_NOTIFICATION_ALL_STATUS, changeNotificationStatusAll);
}
function* changeNotificationStatus({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    yield axios.put(`/notification/mark-as-read`, { id: payload.id }, headers);
    const response = yield axios.get(`/homepage-notification`, headers);
    yield put(getNotificationsSuccess(response.data.data));
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}
export function* watchchangeNotification() {
  yield takeLatest(CHANGE_NOTIFICATION_STATUS, changeNotificationStatus);
}

export function* watchGetAllSimilarProducts() {
  yield takeLatest(GET_ALL_SIMILAR_PRODUCTS, getAllSimilarProductsRequest);
}
function* getNotifications() {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.get(`/homepage-notification`, headers);
    yield put(getNotificationsSuccess(response.data.data));
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}

export function* watchGetNotifications() {
  yield takeLatest(GET_NOTIFICATION, getNotifications);
}

function* getSearch({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    if (yield select(makeSelectAuthToken())) {
      const response = yield axios.get(
        `search?search=${payload.value}&nftPage=${payload.page}&nPageSize=${payload.limit}&brandPage=${payload.bPage}&bPageSize=${payload.limit}&categoryIds=${JSON.stringify(payload.categoryIds)}&brandIds=${JSON.stringify(payload.brandIds)}&order=${payload.order}&sort=${payload.sort}&isShowAll=${payload.isShowAll === "isShowAll" ? true : false}`,
        headers
      );
      yield put(getSearchSuccess(response.data.data));
      payload.setLoading(false);
    } else {
      const response = yield axios.get(
        `search?search=${payload.value}&isShowAll=${payload.isShowAll === "isShowAll" ? true : false}`
      );
      yield put(getSearchSuccess(response.data.data));
      payload.setLoading(false);
    }
  } catch (error) {
    payload.setLoading(false);
    yield sagaErrorHandler(error.response.data.data);
  }
}
export function* watchGetSearch() {
  yield takeLatest(GET_SEARCH, getSearch);
}

function* getRecentSearch({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    if (yield select(makeSelectAuthToken())) {
      const response = yield axios.get(
        `/get-recent?isShowAll=${payload.isShowAll === "isShowAll" ? true : false}`,
        headers
      );
      yield put(getRecentSearchSuccess(response.data.data));
      if (response?.data?.data?.length) {
        payload?.setIsOpen(true);
      }
    } else {
      // if not logged in get recent data from local storage
      let response = JSON.parse(localStorage.getItem("recentSearchArray")) || [];

      if (response?.length) {
        payload?.setIsOpen(true);
        let nftIds = response.map((item) => item.nftId);
        const apiResponse = yield axios.post("nft", { nftIds });
        const filteredArray = response.filter((obj) => apiResponse.data.data.includes(obj.nftId));

        localStorage.setItem("recentSearchArray", JSON.stringify(filteredArray));
        yield put(getRecentSearchSuccess(filteredArray));
      }
    }
  } catch (error) {}
}
export function* watchGetRecentSearch() {
  yield takeLatest(GET_RECENT_SEARCH, getRecentSearch);
}
function* getNotificationFirstTime() {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.get(`/homepage-notification`, headers);
    const result = response.data.data;
    const notificationAll = result?.all?.some((d) => d.isRead === false);
    const notificationHigh = result?.high?.some((d) => d.isRead === false);
    const notificationAMedium = result?.medium?.some((d) => d.isRead === false);
    const notificationALow = result?.low?.some((d) => d.isRead === false);
    if (notificationAll || notificationHigh || notificationAMedium || notificationALow) {
      yield put(notificationCountIcon(true));
    }
  } catch (error) {
    yield sagaErrorHandler(error?.response?.data?.data);
  }
}
export function* watchGetNotificationsFirstTime() {
  yield takeLatest(GET_NOTIFICATION_FIRST_TIME, getNotificationFirstTime);
}
function* getSeparateNotificaiton({ payload }) {
  try {
    const { notificationValue, page, notifications } = payload;
    const token = yield select(makeSelectAuthToken());
    const headers = { Authorization: `Bearer ${token}` };
    const response = yield axios.get(`/notification?type=${notificationValue}&page=${page}&size=${5}`, { headers });

    const notificationData = response.data.data.notifications;
    const notificationCount = response.data.data;
    yield put(getNotificationAllCount(notificationCount));
    switch (notificationValue) {
      case "All":
        yield put(
          getSeparateNotificaitonSuccess({
            count: notificationData.count,
            rows: notifications.concat(notificationData.rows)
          })
        );
        break;
      case "High":
        yield put(
          getSeparateNotificaitonHighSuccess({
            count: notificationData.count,
            rows: notifications.concat(notificationData.rows)
          })
        );
        break;
      case "Low":
        yield put(
          getSeparateNotificationLowSuccess({
            count: notificationData.count,
            rows: notifications.concat(notificationData.rows)
          })
        );
        break;
      case "Medium":
        yield put(
          getSeperateNotificationMediumSuccess({
            count: notificationData.count,
            rows: notifications.concat(notificationData.rows)
          })
        );
        break;
      default:
        break;
    }
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}
export function* watchGetSeperateNotifications() {
  yield takeLatest(GET_SEPARATE_NOTIFICATION, getSeparateNotificaiton);
}

function* getAllMarketplaceCategoriesRequest({ payload }) {
  try {
    let response = [];
    if (payload) {
      response = yield axios.get(`/category/marketplace?search=${payload}`);
    } else {
      response = yield axios.get(`/category/marketplace`);
    }
    let responseData = response.data.data;
    if (responseData?.categories?.length > 0) {
      responseData = responseData?.categories.map((category) => {
        let brands = category.brands.map((brand) => {
          return {
            ...brand,
            checked: false
          };
        });
        return {
          ...category,
          brands
        };
      });
    }
    yield put(getAllMarketplaceCategoriesSuccess({ categories: responseData }));
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}
function* getAllMarketplaceSearchRequest({ payload }) {
  // eslint-disable-next-line no-unused-vars
  const response = yield axios.get(`/search?search=${payload.search}&page=${payload.page}&pageSize=${payload.limit}`);
  // yield put(getAllMarketPlaceSeacrchSuccess(response.data.data))
}

function* updateAllMarketplaceCategoriesRequest({ payload }) {
  yield put(getAllMarketplaceCategoriesSuccess({ categories: payload.categories }));
}

export function* watchGetAllMarketplaceCategories() {
  yield takeLatest(GET_ALL_MARKETPLACE_CATEGORIES, getAllMarketplaceCategoriesRequest);
}
export function* watchGetMarketPlaceSearch() {
  yield takeLatest(GET_ALL_MARKETPLACE_SEARCH, getAllMarketplaceSearchRequest);
}
export function* watchUpdateAllMarketplaceCategories() {
  yield takeLatest(UPDATE_ALL_MARKETPLACE_CATEGORIES, updateAllMarketplaceCategoriesRequest);
}

function* getAllMarketplaceNftsByCategoryRequest({ payload }) {
  try {
    const response = yield axios.get(
      // `/nft/category/${payload.categoryId}?&size=${payload.limit}&page=${payload.page}&search=${payload.search}`
      `/nft/category?&size=${payload.limit}&page=${payload.page}&search=${payload.search}&categoryIds=${JSON.stringify(payload.categoryIds)}&brandIds=${JSON.stringify(payload.brandIds)}&isShowAll=${payload.isShowAll === "isShowAll" ? true : false}`
    );
    payload.setStatusCode(response.status);
    yield put(getAllMarketplaceNftsByCategorySuccess(response.data.data));
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}

export function* watchGetAllMarketplaceNftsByCategory() {
  yield takeLatest(GET_ALL_MARKETPLACE_NFTS_BY_CATEGORY, getAllMarketplaceNftsByCategoryRequest);
}

function* getAllCartItemsRequest({ payload }) {
  try {
    const token = yield select(makeSelectAuthToken());
    if (token) {
      const headers = { Authorization: `Bearer ${token}` };

      const response = yield axios.get(
        `/users/cart${payload?.userAddressId ? `?userAddressId=${payload.userAddressId}` : ""}`,
        {
          headers
        }
      );

      yield put(getAllCartItemsSuccess(response.data.data.cartItems));
      if (payload?.setLoading) payload.setLoading(false);
    }
  } catch (error) {
    console.log(error);
    yield sagaErrorHandler(error.response.data.data);
    if (payload?.setLoading) payload.setLoading(false);
  } finally {
    if (payload?.setFetchShippingPriceLoading) {
      payload.setFetchShippingPriceLoading(false);
    }
  }
}

function* deleteCartItem({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.delete(`/users/cart/${payload.id}`, headers);
    // const responsed = yield axios.get(`/users/cart`, headers);
    yield put(getAllCartItems());
    yield setNotification("success", response.data.message);
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  } finally {
    if (payload?.setLoader) {
      payload.setLoader(false);
    }
  }
}

function* getAllWishlistItemsRequest({ payload }) {
  try {
    const token = yield select(makeSelectAuthToken());
    const headers = { Authorization: `Bearer ${token}` };

    const response = yield axios.get(`/users/wishlist`, { headers });

    yield put(getAllWishlistItemsSuccess(response.data.data.wishlist));
    if (payload?.setLoading) payload.setLoading(false);
  } catch (error) {
    console.log(error);
    yield sagaErrorHandler(error.response.data.data);
    if (payload?.setLoading) payload.setLoading(false);
  }
}

function* deleteWishlistItemRequest({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.delete(`/users/wishlist/${payload?.id}?NftId=${payload?.NftId}`, headers);
    // const responsed = yield axios.get(`/users/cart`, headers);
    yield put(getAllWishlistItems());
    yield setNotification("success", response.data.message);
    if (payload.setLike) {
      payload?.setLike(false);
    }
  } catch (error) {
    console.error(error);
    yield sagaErrorHandler(error.response.data.data);
    payload?.setLike(false);
  } finally {
    if (payload?.setLoader) {
      payload.setLoader(false);
    }
  }
}

function* moveToCart({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.post(`/users/wishlist/move-to-cart`, payload, headers);
    // const responsed = yield axios.get(`/users/cart`, headers);
    yield put(getAllWishlistItems());
    yield setNotification("success", response.data.message);
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}

function* moveToWishlist({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.post(`/users/cart/move-to-wishlist`, { ids: payload.ids }, headers);
    // const responsed = yield axios.get(`/users/cart`, headers);
    yield put(getAllCartItems());
    yield setNotification("success", response.data.message);
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  } finally {
    if (payload?.setLoading) {
      payload?.setLoading(false);
      payload?.handleClose();
    }
  }
}
function* addToCart({ payload }) {
  const token = yield select(makeSelectAuthToken());
  try {
    const headers = { headers: { Authorization: `Bearer ${token}` } };

    const response = yield axios.post(`/users/cart/add-nft-to-cart`, payload, headers);
    yield put(getAllCartItems());
    yield put(getnftData({ id: payload.NftId }));
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}

function* updateCartItem({ payload }) {
  const token = yield select(makeSelectAuthToken());

  try {
    const headers = { headers: { Authorization: `Bearer ${token}` } };
    const response = yield axios.put(`/users/cart/update-cart-item`, payload, headers);
    yield put(getAllCartItems());
    yield setNotification("success", response.data.message);
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}

function* addToWishList({ payload }) {
  const token = yield select(makeSelectAuthToken());

  try {
    const headers = { headers: { Authorization: `Bearer ${token}` } };
    const response = yield axios.post(`/users/wishlist`, payload, headers);
    payload.setLike(true);
    yield setNotification("success", response.data.message);
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
    payload.setLike(false);
  }
}
function* addRecentSearch({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    if (yield select(makeSelectAuthToken())) {
      yield axios.get(`/update-recent?searchId=${payload.id}&searchType=${payload.nft}`, headers);
      const response = yield axios.get(
        `/get-recent?isShowAll=${payload.isShowAll === "isShowAll" ? true : false}`,
        headers
      );
      yield put(getRecentSearchSuccess(response.data.data));
    } else {
      // if not logged in add recent data to local storege

      let recentStoredData = JSON.parse(localStorage.getItem("recentSearchArray")) || [];
      const nftExists = recentStoredData.find((data) => data.id === payload.id);

      if (!nftExists) {
        if (recentStoredData.length < 3) {
          recentStoredData.unshift(payload.nftData);
        } else {
          recentStoredData.pop();
          recentStoredData.unshift(payload.nftData);
        }
        localStorage.setItem("recentSearchArray", JSON.stringify(recentStoredData));
        yield put(getRecentSearchSuccess(recentStoredData));
      }
    }
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}
function* deleteRecentSearch({ payload }) {
  const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
  if (headers) {
    if (payload.id) {
      yield axios.delete(`/remove-recent/${payload.id}`, headers);
      const response = yield axios.get(
        `/get-recent?isShowAll=${payload.isShowAll === "isShowAll" ? true : false}`,
        headers
      );
      yield put(getRecentSearchSuccess(response.data.data));
      payload.setLoading(false);
    } else {
      yield axios.delete(`/remove-recent`, headers);
      const response = yield axios.get(
        `/get-recent?isShowAll=${payload.isShowAll === "isShowAll" ? true : false}`,
        headers
      );
      yield put(getRecentSearchSuccess(response.data.data));
      payload.setLoading(false);
    }
  }
}

export function* watchDeleteCartItem() {
  yield takeLatest(DELETE_CART_ITEM, deleteCartItem);
}
export function* watchAddToCart() {
  yield takeLatest(ADD_TO_CART, addToCart);
}
export function* watchAddToWishlist() {
  yield takeLatest(ADD_TO_WISHLIST, addToWishList);
}
export function* watchUpdateToCartItem() {
  yield takeLatest(UPDATE_CART_ITEM, updateCartItem);
}

export function* watchGetAllCartItemsRequest() {
  yield takeLatest(GET_ALL_CART_ITEMS, getAllCartItemsRequest);
}

export function* watchDeleteWishlistItem() {
  yield takeLatest(DELETE_WISHLIST_ITEM, deleteWishlistItemRequest);
}

export function* watchGetAllWishlistItemsRequest() {
  yield takeLatest(GET_ALL_WISHLIST_ITEMS, getAllWishlistItemsRequest);
}

export function* watchMoveToCart() {
  yield takeLatest(MOVE_TO_CART, moveToCart);
}
export function* watchMoveToWishlist() {
  yield takeLatest(MOVE_TO_WISHLIST, moveToWishlist);
}
export function* watchAddRecentSearch() {
  yield takeLatest(ADD_RECENT_NFT, addRecentSearch);
}

export function* watchDeleteRecentSearch() {
  yield takeLatest(DELETE_RECENT_SEARCH_NFT, deleteRecentSearch);
}

export default function* marketplaceSaga() {
  yield all([
    fork(watchGetAllMarketplaceCategories),
    fork(watchGetMarketPlaceSearch),
    fork(watchGetAllMarketplaceNftsByCategory),
    fork(watchGetAllSimilarProducts),
    fork(watchTrackingTool),
    fork(watchGetNotifications),
    fork(watchdeleteNotifcation),
    fork(watchchangeNotification),
    fork(watchChangeNotificationAll),
    fork(watchGetSeperateNotifications),
    fork(watchDeleteSeperateNotification),
    fork(watchUpdateAllMarketplaceCategories),
    fork(watchGetAllCartItemsRequest),
    fork(watchDeleteCartItem),
    fork(watchDeleteWishlistItem),
    fork(watchGetAllWishlistItemsRequest),
    fork(watchMoveToCart),
    fork(watchMoveToWishlist),
    fork(watchAddToCart),
    fork(watchGetSearch),
    fork(watchUpdateToCartItem),
    fork(watchAddToWishlist),
    fork(watchGetNotificationsFirstTime),
    fork(watchAddRecentSearch),
    fork(watchGetRecentSearch),
    fork(watchDeleteRecentSearch)
  ]);
}
