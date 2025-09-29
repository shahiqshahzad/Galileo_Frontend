import axios from "../../utils/axios";
import { all, fork, put, takeLatest, select } from "redux-saga/effects";
import {
  GET_ALL_TRENDING,
  GET_ALL_BRANDS,
  GET_ALL_CATEGORIES,
  GET_ALL_GALILEO,
  GET_NFT_DATA,
  BMW,
  COMINGSOON_MARKETPLACE,
  GET_NFT_TAX
} from "./constants";
import {
  getAllCategoriesSuccess,
  getAllBrandsSuccess,
  getAllTrendingSuccess,
  getAllgalileoSuccess,
  getnftDataSuccess,
  bmwPageSuccess,
  comingSoonMarketplaceSuccess,
  getNftTaxSuccess,
  getnftData
} from "./actions";

import { sagaErrorHandler } from "../../shared/helperMethods/sagaErrorHandler";
import { makeSelectAuthToken, makeSelectAuthId, makeSelectAuthRole } from "store/Selector";
import { updateSingleUri } from "utils/updateUriSingle";
import { createGoogleAnalyticsForViewItem } from "utils/googleAnalytics";

//resold NFT ===>
function* getAllResoldNftsRequest({ payload }) {
  try {
    const response = yield axios.get(
      `/marketplace/galileo/nft?page=${payload.page}&size=${payload.size}&isShowAll=${payload.isShowAll === "isShowAll" ? true : false}`
    );

    yield put(getAllgalileoSuccess(response?.data?.data));

    if (response.status === 200) {
      payload.setLoading(false);
    }
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
    payload.setLoading(false);
  }
}

export function* watchGetAllResoldNfts() {
  yield takeLatest(GET_ALL_GALILEO, getAllResoldNftsRequest);
}

// trending Nft===>

function* getAllTrendingRequest({ payload }) {
  try {
    const response = yield axios.get(
      `/marketplace/trending/nft?page=${payload.page}&size=${payload.size}&isShowAll=${payload.isShowAll === "isShowAll" ? true : false}`
    );
    const previousData = payload?.previousData;
    if (previousData && previousData.length > 0) {
      yield put(
        getAllTrendingSuccess({
          newNfts: previousData.concat(response.data.data.newNfts),
          newNftsPages: response.data.data.newNftsPages,
          totalCount: response.data.data.totalCount
        })
      );
    } else {
      yield put(getAllTrendingSuccess(response?.data?.data));
    }
    if (response.status === 200) {
      payload.setNftLoading(false);
    }
  } catch (error) {
    console.log(error, "errrrr");
    yield sagaErrorHandler(error.response.data.data);
    payload.setNftLoading(false);
  }
}

export function* watchGetAllTrending() {
  yield takeLatest(GET_ALL_TRENDING, getAllTrendingRequest);
}

// brands===>
function* getAllBrandsRequest({ payload }) {
  try {
    const response = yield axios.get(
      `/marketplace/brand?isShowAll=${payload.isShowAll === "isShowAll" ? true : false}`
    );

    yield put(getAllBrandsSuccess(response?.data?.data?.brands));
    if (response.status === 200) {
      payload.setLoading(false);
    }
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
    payload.setLoading(false);
  }
}

export function* watchGetAllBrands() {
  yield takeLatest(GET_ALL_BRANDS, getAllBrandsRequest);
}

// categories==>

function* getAllCategoriesRequest({ payload }) {
  try {
    const response = yield axios.get(`/marketplace/categories`);

    yield put(getAllCategoriesSuccess(response?.data?.data?.categories));
    if (response.status === 200) {
      payload.setLoading(false);
    }
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
    payload.setLoading(false);
  }
}

export function* watchGetAllCategories() {
  yield takeLatest(GET_ALL_CATEGORIES, getAllCategoriesRequest);
}

function* getNftDataRequest({ payload }) {
  try {
    const token = yield select(makeSelectAuthToken());
    let headers = {};
    let cartHeaders = {};
    let cartResponse = null;
    let wishlistResponse = null;
    let UserId = null;
    let role = null;
    if (token) {
      headers = { headers: { Authorization: token } };
      cartHeaders = { headers: { Authorization: `Bearer ${token}` } };
      cartResponse = yield axios.get(`/users/cart/cart-item-already-exist/${payload.id}`, cartHeaders);
      wishlistResponse = yield axios.get(`/users/wishlist/wishlist-item-already-exist/${payload.id}`, cartHeaders);
      UserId = yield select(makeSelectAuthId());
      role = yield select(makeSelectAuthRole());
    }

    const response = yield axios.get(
      `/nft/${payload.id}?${payload?.userAddressId ? `userAddressId=${payload.userAddressId}` : ""}${
        payload?.quantity ? `&quantity=${payload.quantity}` : ""
      }`,
      headers
    );
    const filteredRes = response?.data?.data?.nft;
    if (role === "User") {      
      const {salePrice, id, name, price, quantity, currencyType, Brand, Category} = filteredRes;
      const {name:nftBrand} = Brand;
      const {name:nftCategory} = Category;
      const dataToCreateViewItemGoogleAnalytics = {
        nftPrice: price,
        nftCurrency: currencyType,
        nftId: id,
        nftSalePrice: salePrice,
        nftName: name,
        nftBrand,
        nftCategory,
        nftQty: +quantity
      }
      createGoogleAnalyticsForViewItem(dataToCreateViewItemGoogleAnalytics)
    }
    if (UserId) {
      if (filteredRes?.progressState === "updateUriPending" && filteredRes?.updateUriPendingBy === +UserId) {
        // This section is for single nft where bulkId is null
        if (!filteredRes?.bulkId && !filteredRes?.updateUriPendingForEdit && !filteredRes?.updUriPendRedeemEdit) {
          const { contractAddress, id } = filteredRes;
          const tokenId = filteredRes?.NFTTokens[0]?.tokenId;
          const tokenPId = filteredRes?.NFTTokens[0]?.id;
          const data = { contractAddress, nftId: id, tokenId, tokenPId };
          updateSingleUri(data, token);
        }
        if (filteredRes?.updateUriPendingForEdit && !filteredRes?.updUriPendRedeemEdit) {
          const { contractAddress, id } = filteredRes;
          const updateUriReason = "updateUriForEdit";
          const tokenId = filteredRes?.NFTTokens[0]?.tokenId;
          const tokenPId = filteredRes?.NFTTokens[0]?.id;
          const data = { contractAddress, nftId: id, tokenId, updateUriReason, tokenPId };
          updateSingleUri(data, token);
        }
        if (filteredRes?.updUriPendRedeemEdit) {
          const { contractAddress, id } = filteredRes;
          const updateUriReason = "updateUriForRedeemedNft";
          const tokenId = filteredRes?.NFTTokens[0]?.tokenId;
          const tokenPId = filteredRes?.NFTTokens[0]?.id;
          const data = { contractAddress, nftId: id, tokenId, updateUriReason, tokenPId };
          updateSingleUri(data, token);
        }
      }
    }
    // yield put(getnftDataSuccess({ ...response?.data?.data, existsInCart: cartResponse?.data?.data }));
    yield put(
      getnftDataSuccess({
        ...response?.data?.data,
        existsInCart: cartResponse?.data?.data,
        existsInWishlist: wishlistResponse?.data?.data
      })
    );

    if (payload?.setFetchNftLoading) {
      payload.setFetchNftLoading(false);
    }
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
    if (payload?.setFetchNftLoading) {
      payload.setFetchNftLoading(false);
    }
  } finally {
    if (payload?.setFetchShippingPriceLoading) {
      payload.setFetchShippingPriceLoading(false);
    }
  }
}

export function* watchGetNftData() {
  yield takeLatest(GET_NFT_DATA, getNftDataRequest);
}
function* getBMWDataRequest({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.get(
      `dynamicBrandData?BrandId=${payload.BrandId}&isShowAll=${payload.isShowAll === "isShowAll" ? true : false}`,
      headers
    );
    yield put(bmwPageSuccess(response.data.data));
    if (response.status === 200) {
      payload.setLoading(false);
    }
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
    payload.setLoading(false);
  }
}

export function* watchGetbmwData() {
  yield takeLatest(BMW, getBMWDataRequest);
}

function* getNftTaxRequest({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.get(
      `nft/calculate-tax?userAddressId=${payload.userAddressId}&nftId=${payload.nftId}`,
      headers
    );
    yield put(getNftTaxSuccess({ ...response.data.data }));
    yield put(getnftData(payload.shippingPayload));
    payload.setTaxError(false);
  } catch (error) {
    payload.setTaxError(true);
    payload.setFetchShippingPriceLoading(false);
    yield sagaErrorHandler(error.response.data.data);
  }
}

export function* watchNftTax() {
  yield takeLatest(GET_NFT_TAX, getNftTaxRequest);
}

function* getComingsoonMarketPlaceRequest({ payload }) {
  const response = yield axios.get(`coming-soon-data?size=${payload.pageLimit}&page=${payload.page}`);
  yield put(comingSoonMarketplaceSuccess(response.data.data));
  payload.setLoading(false);
}

export function* watchComingsoonMarketplace() {
  yield takeLatest(COMINGSOON_MARKETPLACE, getComingsoonMarketPlaceRequest);
}
export default function* landingPageSaga() {
  yield all([
    fork(watchGetAllResoldNfts),
    fork(watchGetAllTrending),
    fork(watchGetAllBrands),
    fork(watchGetAllCategories),
    fork(watchGetNftData),
    fork(watchGetbmwData),
    fork(watchComingsoonMarketplace),
    fork(watchNftTax)
  ]);
}
