/* eslint-disable no-unused-vars */
import axios from "utils/axios";
import { all, fork, put, takeLatest, select } from "redux-saga/effects";
import { makeSelectAuthId, makeSelectAuthToken } from "store/Selector";
import {
  getAllNft,
  getAllBulkNft,
  getAllBulkNftSuccess,
  getAllNftSuccess,
  getAllNftSuperAdmin,
  getAllNftSuccessUser,
  getAllNftSuccessSuperAdmin,
  getNftBuyerSuccess,
  getALLNftResold,
  getNftResoldSuccess,
  cancleReselNftSuccess,
  getEditNFtSuccess,
  setStateMintedNFtSuccess,
  resoldNftLoader,
  resoldNftLoaderSuccess,
  approveEditNft,
  UploadNftImagesSuccess,
  BackgroundRemovalImageSuccess
} from "./actions";
import {
  GET_ALL_NFT,
  GET_ALL_BULKNFT,
  ADD_NFT,
  RESOLED_NFT,
  MINT_NFT,
  LAZY_MINT_NFT,
  REQUEST_NFT_FOR_MINTING,
  GET_ALL_NFT_SUPER_ADMIN,
  GET_ALL_NFT_USER,
  EDIT_NFT,
  DELETE_NFT,
  REMOVED_NFT,
  REJECT_NFT,
  BUY_NFT,
  RESELL_NFT,
  REDEEM_NFT,
  ADD_DELIVERY_NFT,
  GET_NFT_BUYER,
  REQUEST_CHANGE_NFT,
  CHANGE_TOKEN_ID,
  GET_EDITED_NFT_DATA,
  UPDATE_NFT_DYNAMIC_METADATA,
  EDIT_REQUEST_NFT,
  GET_ALL_NFT_RESOLD,
  CANCLE_RESELL_NFT,
  REJECT_EDIT_NFT,
  APPROVE_EDIT_NFT,
  EDIT_REQUEST_METADATA_NFT,
  META_DATA_NFT_TOKEN_URI,
  META_DATA_URI_TOKEN_CANCEL,
  ADD_PRIMARY_IMAGE_NFT,
  BUY_NFT_CART,
  MINT_LOADER_NFT,
  BULK_BUY_NFT,
  UPLOAD_NFT_IMAGES,
  UPLOAD_IMAGE_BACKGROUND_CHANGE
} from "./constants";
import { sagaErrorHandler } from "shared/helperMethods/sagaErrorHandler";
import { setNotification } from "shared/helperMethods/setNotification";
import { getnftData, getnftDataSuccess } from "redux/landingPage/actions";

import { getAllCartItems } from "redux/marketplace/actions";
import { updateUriBulk } from "utils/updateUriBulk";
import { updateSingleUri } from "utils/updateUriSingle";
import { createGoogleAnalyticsForPurchase } from "utils/googleAnalytics";
import { store } from "store";

function* updateNftDynamicMetaDataRequest({ payload }) {
  const formData = new FormData();

  formData.append("id", payload.id);
  formData.append("asset", payload.asset);
  formData.append("name", payload.name);
  formData.append("price", payload.price);
  formData.append("currencyType", payload.currencyType);
  formData.append("description", payload.description);
  formData.append("quantity", payload.quantity);
  formData.append("mintType", payload.mintType);
  formData.append("metaData", JSON.stringify(payload.metaData));
  formData.append("metaFiles", JSON.stringify(payload.metaFiles));
  formData.append("tokenUri", payload.tokenUri);

  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.post(`/nft/dynamicMetaDataNftUpdate`, formData, headers);

    yield put(
      getAllNftSuperAdmin({
        categoryId: payload.categoryId,
        brandId: payload.brandId,
        search: payload.search,
        page: payload.page,
        limit: payload.limit,
        type: payload.type
      })
    );
    payload.handleClose();
    yield setNotification("success", response.data.message);
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
    // payload.setLoader(false);
  }
}

export function* watchUpdateNftDynamicMetaData() {
  yield takeLatest(UPDATE_NFT_DYNAMIC_METADATA, updateNftDynamicMetaDataRequest);
}

function* getEditedNftDataRequest({ payload }) {
  const formData = new FormData();
  if (payload.isFile) {
    formData.append("asset", payload.asset);
  }
  formData.append("name", payload.name);
  formData.append("price", payload.price);
  formData.append("currencyType", payload.currencyType);
  formData.append("description", payload.description);
  formData.append("quantity", payload.quantity);
  formData.append("metaData", JSON.stringify(payload.metaDataArray));
  formData.append("mintType", payload.mintType);
  formData.append("fileNameArray", JSON.stringify(payload.fileNameArray));
  formData.append("previousUploadedItems", JSON.stringify(payload.previousUploadedItems));
  formData.append("brandId", JSON.stringify(payload.brandId));
  for (let i = 0; i < payload.fileArray.length; i++) {
    formData.append("fileArray", payload.fileArray[i]);
  }

  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.put(`/nft/getUpdatedNftData/${payload.id}`, formData, headers);
    payload.handleDynamicMetaData(response.data.data);
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
    // payload.setLoader(false);
  }
}

export function* watchGetEditedNftData() {
  yield takeLatest(GET_EDITED_NFT_DATA, getEditedNftDataRequest);
}

function* deleteNftRequest({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.delete(`nft/brandAdmin/${payload.id}`, headers);
    yield put(
      getAllNft({
        categoryId: payload.categoryId,
        search: payload.search,
        page: payload.page,
        limit: payload.limit,
        type: payload.type,
        brandId: payload.brandId,
        setLoader: payload.handleClose
      })
    );
    yield setNotification("success", response.data.message);
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}

export function* watchDeleteNft() {
  yield takeLatest(DELETE_NFT, deleteNftRequest);
}
function* removedNftRequest({ payload }) {
  try {
    let data = {
      brandId: payload.brandId,
      categoryId: payload.categoryId,
      nftId: payload.nftId
    };
    let bulkdata = {
      brandId: payload.brandId,
      categoryId: payload.categoryId,
      // nftId: payload.nftId,
      bulkId: payload.bulkId,
      dListingQty: payload?.dListingQty
    };
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.post(`nft/delist-nft`, payload.bulkId ? bulkdata : data, headers);
    if (payload.bulkId) {
      yield put(
        getAllBulkNft({
          bulkId: payload?.bulkId
        })
      );
    } else {
      yield put(
        getAllNftSuperAdmin({
          categoryId: payload.categoryId,
          brandId: payload.brandId,
          search: payload.search,
          page: payload.page,
          limit: payload.limit,
          type: payload.type,
          setLoader: payload.handleClose
        })
      );
    }

    yield setNotification("success", response.data.message);
    payload.handleClose();
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
    payload.setLoader(false);
  }
}

export function* watchRemovedNft() {
  yield takeLatest(REMOVED_NFT, removedNftRequest);
}

function* getAllNftSuperAdminRequest({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.get(
      `/nft/admin?page=${payload.page}&size=${payload.limit}&search=${payload.search}&brandId=${payload.brandId}&categoryId=${payload.categoryId}&type=${payload.type}`,
      headers
    );

    yield put(getAllNftSuccessSuperAdmin(response.data.data));
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  } finally {
    if (payload?.setLoader) {
      payload.setLoader();
    }
  }
}

function* getAllNftUserRequest({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.get(`/users/nfts/` + payload.walletAddress, headers);
    yield put(getAllNftSuccessUser(response.data.data));
    payload.setLoading(false);
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
    payload.setLoading(false);
  }
}

function* getNftResoldRequest({ payload }) {
  try {
    yield put(resoldNftLoader());
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.get(`/getUserOnsaleNFT`, headers);
    yield put(getNftResoldSuccess(response.data.data));
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  } finally {
    yield put(resoldNftLoaderSuccess());
  }
}

function* cancleNftRequest({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.post(`/cancelUserOnsaleNFT/${payload.walletAddress}`, { ...payload }, headers);
    yield put(cancleReselNftSuccess(response.data.data));
    yield setNotification("success", response.data.message);
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}

function* getNftBuyerRequest({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.get(
      `/users/nfts/check/` + payload.walletAddress + "/" + payload.NftId + "/" + payload.NFTTokenId,
      headers
    );

    yield put(getNftBuyerSuccess(response.data.data));
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}

export function* watchGetNftBuyer() {
  yield takeLatest(GET_NFT_BUYER, getNftBuyerRequest);
}
export function* watchGetAllNftSuperAdmin() {
  yield takeLatest(GET_ALL_NFT_SUPER_ADMIN, getAllNftSuperAdminRequest);
}

export function* watchGetAllNftUser() {
  yield takeLatest(GET_ALL_NFT_USER, getAllNftUserRequest);
}
export function* watchGetNftResold() {
  yield takeLatest(GET_ALL_NFT_RESOLD, getNftResoldRequest);
}
export function* watchCancleResoldNft() {
  yield takeLatest(CANCLE_RESELL_NFT, cancleNftRequest);
}
function* editNftRequest({ payload }) {
  const formData = new FormData();
  if (payload.isFile) {
    formData.append("asset", payload.asset);
  }
  formData.append("primary", JSON.stringify(payload.primary));
  formData.append("secondary", JSON.stringify(payload.secondary));
  formData.append("primaryEdit", payload?.primaryEdit?.image);
  formData.append("name", payload.name);
  formData.append("price", payload.price);
  formData.append("currencyType", payload.currencyType);
  formData.append("description", payload.description);
  formData.append("quantity", payload.quantity);
  formData.append("isSoldByGalileo", payload.isSoldByGalileo);

  payload.metaDataArray.forEach((item, index) => {
    if (item.proofFile && item.proofFile instanceof File) {
      formData.append(`proofFile`, item.proofFile);
      payload.metaDataArray[index].proofFile = payload.metaDataArray[index].proofFile.name;
    }
  });
  formData.append("metaData", JSON.stringify(payload.metaDataArray));
  formData.append("mintType", payload.mintType);
  formData.append("fileNameArray", JSON.stringify(payload.fileNameArray));
  formData.append("previousUploadedItems", JSON.stringify(payload.previousUploadedItems));
  formData.append("threeDModelUrl", payload.threeDModelUrl);
  formData.append("threeDFileName", payload.threeDFileName);
  formData.append("videoFile", payload.videoFile);
  formData.append("isRemoveVideo", payload.isRemoveVideo);

  formData.append("longDescription", payload.longDescription);
  formData.append("salePrice", payload.salePrice);
  formData.append("taxStatus", payload.taxStatus);
  formData.append("taxClass", payload.taxClass);
  formData.append("taxCalculationMethod", payload.taxCalculationMethod);
  formData.append("taxRate", payload.taxRate);
  formData.append("multiCategoriesId", JSON.stringify(payload.multiCategoriesId));
  formData.append("productTags", JSON.stringify(payload.productTags));

  for (let i = 0; i < payload.fileArray.length; i++) {
    formData.append("fileArray", payload.fileArray[i]);
  }
  if (payload.secondaryEdit.length > 0) {
    for (let i = 0; i < payload.secondaryEdit.length; i++) {
      formData.append("secondaryEdit", payload.secondaryEdit[i].image);
    }
  }

  // Nft Fulfillment details
  if (payload?.shippingCalculationMethod) {
    formData.append("shippingCalculationMethod", payload.shippingCalculationMethod);
  }

  // Flat Rate Shipping Data
  if (payload?.shippingCalculationMethod === "FRS") {
    formData.append("flatRateShippingCost", payload.flatRateShippingCost);
    formData.append("noExternalCostForMultipleCopies", payload.noExternalCostForMultipleCopies);
  }

  // Carrier Calculated Shipping Data
  if (payload?.shippingCalculationMethod === "CCS") {
    formData.append("weight", payload.weight);
    formData.append("height", payload.height);
    formData.append("length", payload.length);
    formData.append("breadth", payload.breadth);
    formData.append("warehouseAddressId", payload.warehouseAddressId);
    formData.append("modeOfShipment", payload.modeOfShipment);

    formData.append("shippingCostAdjustment", payload.shippingCostAdjustment);
    formData.append("isPurchaseAllowed", payload.isPurchaseAllowed);

    if (payload?.supportedCarrier) {
      formData.append("supportedCarrier", payload.supportedCarrier);
    }
    if (payload?.fallBackShippingAmount > 0) {
      formData.append("fallBackShippingAmount", payload.fallBackShippingAmount);
    }
  }

  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.put(`nft/brandAdmin/updateNFT/${payload.id}`, formData, headers);

    yield put(
      getnftData({
        id: payload.id
      })
    );

    if (payload.role === "Super Admin" || payload.role === "Sub Admin") {
      yield put(
        getAllNftSuperAdmin({
          categoryId: payload.categoryId,
          brandId: payload.brandId,
          search: payload.search,
          page: payload.page,
          limit: payload.limit,
          type: payload.type,
          setLoader: payload.setLoader
        })
      );
    } else {
      yield put(
        getAllNft({
          categoryId: payload.categoryId,
          search: payload.search,
          page: payload.page,
          limit: payload.limit,
          type: payload.type,
          brandId: payload.brandId,
          setLoader: payload.setLoader
        })
      );
    }
    yield setNotification("success", response.data.message);
    payload.handleClose();
    // yield put(UploadNftImagesSuccess([]));
  } catch (error) {
    console.log(error);
    yield sagaErrorHandler(error.response.data.data);
    payload.setLoader(false);
  }
}

function* metadataNftEdit({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.put(`updateNftMetaDataTokenUri/${payload.nftId}`, payload.tokenUri, headers);
    yield setNotification("success", response.data.message);
    yield put(getEditNFtSuccess({}));

    yield put(
      getnftData({
        id: payload.nftId
      })
    );
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}

function* metaDataTokenCancel() {
  yield put(getEditNFtSuccess({}));
}

function* editMetadataRequest({ payload }) {
  const formData = new FormData();
  formData.append("metaDataArray", JSON.stringify(payload.fieldDataChange));
  if (payload.proofAry.length === 0) {
    formData.append("proofFiles[]", "");
  } else {
    for (let i = 0; i < payload.proofAry.length; i++) {
      formData.append("proofFiles", payload.proofAry[i]);
    }
  }
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.put(`/update/nftMetaData`, formData, headers);
    const filteredRes = response?.data?.data?.data;
    const { contractAddress, nftId, tokenId, tokenPId } = filteredRes;
    const updateUriReason = "updateUriForRedeemedNft";
    const data = { contractAddress, nftId, tokenId, updateUriReason, tokenPId };
    const token = yield select(makeSelectAuthToken());
    yield put(getEditNFtSuccess(response.data.data));
    // yield put(
    //   getnftData({
    //     id: payload.nftId,
    //   })
    //   )
    payload.handleClose();
    yield setNotification("success", response.data.message);
    updateSingleUri(data, token);
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
    payload.setLoader(false);
  }
}
export function* watchEditNft() {
  yield takeLatest(EDIT_NFT, editNftRequest);
}

function* editRequestNftRequest({ payload }) {
  const formData = new FormData();
  // if (payload.isFile) {
  //     formData.append('asset', payload.asset);
  // }
  formData.append("primary", JSON.stringify(payload.primary));
  formData.append("secondary", JSON.stringify(payload.secondary));
  formData.append("primaryEdit", payload?.primaryEdit?.image);
  payload.metaDataArray.forEach((item, index) => {
    if (item.proofFile && item.proofFile instanceof File) {
      formData.append(`proofFile`, item.proofFile);
      payload.metaDataArray[index].proofFile = payload.metaDataArray[index].proofFile.name;
    }
  });
  formData.append("metaData", JSON.stringify(payload.metaDataArray));
  formData.append("fileNameArray", JSON.stringify(payload.fileNameArray));
  formData.append("threeDModelUrl", JSON.stringify(payload.threeDModelUrl));
  formData.append("threeDFileName", JSON.stringify(payload.threeDFileName));
  formData.append("videoFile", payload.videoFile);
  formData.append("isRemoveVideo", payload.isRemoveVideo);
  formData.append("metaDataIdArray", JSON.stringify(payload.metaDataIdArray ? payload.metaDataIdArray : []));
  for (let i = 0; i < payload.fileArray.length; i++) {
    formData.append("metaDataFileArray", JSON.stringify(payload.metaDataFileArray[i]));
  }
  formData.append("previousUploadedItems", JSON.stringify(payload.previousUploadedItems));
  for (let i = 0; i < payload.fileArray.length; i++) {
    formData.append("fileArray", payload.fileArray[i]);
  }
  if (payload.secondaryEdit.length > 0) {
    for (let i = 0; i < payload.secondaryEdit.length; i++) {
      formData.append("secondaryEdit", payload.secondaryEdit[i].image);
    }
  }
  for (let i = 0; i < payload.metaDataFileArray.length; i++) {
    formData.append("metaDataFileArray", payload.metaDataFileArray[i]);
  }

  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.put(`editNftMetaDataRequest/${payload.id}`, formData, headers);
    if (payload?.editAndApprove && response?.data?.data?.draftNftId) {
      yield put(
        approveEditNft({
          id: response?.data?.data?.draftNftId,
          ipfsUrl: payload?.ipfsUrl,
          categoryId: payload?.categoryId,
          brandId: payload?.brandId,
          type: payload?.type || "all",
          page: payload?.page || 1,
          limit: payload?.limit || 12,
          search: payload?.search || "",
          bulkId: payload?.bulkId
        })
      );
    }

    if (payload.bulkId) {
      yield put(
        getAllBulkNft({
          bulkId: payload?.bulkId
        })
      );
    } else {
      yield put(
        getAllNft({
          categoryId: payload.categoryId,
          search: payload.search,
          page: payload.page,
          limit: payload.limit,
          type: payload.type,
          brandId: payload.brandId
        })
      );
    }

    yield setNotification("success", response.data.message);
    payload.handleClose();
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
    payload.setLoader(false);
    payload.handleClose();
  }
}
export function* watchEditRequestNft() {
  yield takeLatest(EDIT_REQUEST_NFT, editRequestNftRequest);
}

function* addNftRequest({ payload }) {
  const formData = new FormData();
  // formData.append("asset", payload.asset);
  formData.append("name", payload.name);
  formData.append("requesterAddress", payload.requesterAddress);
  // formData.append('contractAddress', payload.contractAddress);
  formData.append("price", payload.price);
  formData.append("autoRedeem", payload.autoRedeem);
  formData.append("isSoldByGalileo", payload.isSoldByGalileo);
  formData.append("description", payload.description);
  formData.append("directBuyerAddress", payload.directBuyerAddress);
  formData.append("isDirectTransfer", payload.isDirectTransfer);
  formData.append("categoryId", payload.categoryId);
  formData.append("quantity", payload.quantity);
  formData.append("chainId", payload.chainId);
  formData.append("currencySymbol", payload.currencySymbol);
  payload.metaDataArray.forEach((item, index) => {
    if (item.proofFile && item.proofFile instanceof File) {
      formData.append(`proofFile`, item.proofFile);
      payload.metaDataArray[index].proofFile = payload.metaDataArray[index].proofFile.name;
    }
  });

  formData.append("metaData", JSON.stringify(payload.metaDataArray));
  formData.append("mintType", payload.mintType);
  formData.append("videoFile", payload.videoFile);
  formData.append("threeDModelUrl", payload.threeDModelUrl);
  formData.append("threeDFileName", payload.threeDFileName);
  formData.append("fileNameArray", JSON.stringify(payload.fileNameArray));
  for (let i = 0; i < payload.fileArray.length; i++) {
    formData.append("fileArray", payload.fileArray[i]);
  }
  formData.append("secondaryAssets", JSON.stringify(payload.secondaryImage));
  formData.append("longDescription", payload.longDescription);
  formData.append("salePrice", payload.salePrice);
  formData.append("taxStatus", payload.taxStatus);
  formData.append("taxClass", payload.taxClass);
  formData.append("taxCalculationMethod", payload.taxCalculationMethod);
  formData.append("taxRate", payload.taxRate);
  formData.append("multiCategoriesId", JSON.stringify(payload.multiCategoriesId));
  formData.append("productTags", JSON.stringify(payload.productTags));

  // Nft Fulfillment details
  formData.append("shippingCalculationMethod", payload.shippingCalculationMethod);

  // Flat Rate Shipping Data
  if (payload.shippingCalculationMethod === "FRS") {
    formData.append("flatRateShippingCost", payload.flatRateShippingCost);
    formData.append("noExternalCostForMultipleCopies", payload.noExternalCostForMultipleCopies);
  }

  // Carrier Calculated Shipping Data
  if (payload.shippingCalculationMethod === "CCS") {
    formData.append("weight", payload.weight);
    formData.append("height", payload.height);
    formData.append("length", payload.length);
    formData.append("breadth", payload.breadth);
    formData.append("warehouseAddressId", payload.warehouseAddressId);
    formData.append("modeOfShipment", payload.modeOfShipment);

    formData.append("shippingCostAdjustment", payload.shippingCostAdjustment);
    formData.append("isPurchaseAllowed", payload.isPurchaseAllowed);

    if (payload?.supportedCarrier) {
      formData.append("supportedCarrier", payload.supportedCarrier);
    }
    if (payload?.fallBackShippingAmount > 0) {
      formData.append("fallBackShippingAmount", payload.fallBackShippingAmount);
    }
  }

  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.post(`/nft/brandAdmin`, formData, headers);
    if (payload?.createdBy === "SubAdmin") {
      yield put(
        getAllNftSuperAdmin({
          categoryId: payload.categoryId,
          search: payload.search,
          page: payload.page,
          limit: payload.limit,
          type: payload.type,
          brandId: payload.brandId
        })
      );
    } else {
      yield put(
        getAllNft({
          categoryId: payload.categoryId,
          search: payload.search,
          page: payload.page,
          limit: payload.limit,
          type: payload.type,
          brandId: payload.brandId
        })
      );
    }
    payload.setLoader(false);
    yield setNotification("success", response.data.message);
    payload.handleClose();
    yield put(UploadNftImagesSuccess([]));
  } catch (error) {
    yield sagaErrorHandler(error?.response?.data?.data || "Error");
    payload.setLoader(false);
  }
}

function* buyNftRequest({ payload }) {
  try {
    let fetchNftId = null;
    if (payload.currentNftId) {
      fetchNftId = payload.currentNftId;
      delete payload.currentNftId;
    }

    let data = {
      // nftId: payload.nftId,
      // nftToken: payload.nftToken,
      // buyerAddress: payload.buyerAddress,
      // serialId: payload.serialId,
      // contractAddress: payload.contractAddress,
      ...payload,
      status: "Buy"
    };

    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.post(`/users/nftOperation`, data, headers);
    const nftData = response.data.data;
    if (Object.keys(nftData)?.length > 0) {
      createGoogleAnalyticsForPurchase(nftData);
    }
    if (fetchNftId) {
      yield put(
        getnftData({
          id: fetchNftId
        })
      );
    }

    // yield put(getnftDataSuccess(payload?.nftid));
    yield setNotification("success", response.data.message);
    payload.buyNftResolve();
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  } finally {
    if (payload?.stopMintNftLoader) {
      payload?.stopMintNftLoader();
    }
  }
}

function* bulkBuyNftRequest({ payload }) {
  try {
    const { currentNftId, ...restOfPayload } = payload;

    let data = {
      ...restOfPayload,
      status: "Buy"
    };

    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.post(`/users/nftOperationBulk`, data, headers);
    yield put(
      getnftData({
        id: currentNftId
      })
    );
    // yield put(getnftDataSuccess(payload?.nftid));
    yield setNotification("success", response.data.message);
    payload.buyNftResolve();
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  } finally {
    if (payload?.stopMintNftLoader) {
      payload?.stopMintNftLoader();
    }
  }
}

function* buyNftCartRequest({ payload }) {
  try {
    let data = {
      ...payload,
      status: "Buy"
    };

    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.post(`/users/cart/nft-operation-for-cart`, data, headers);
    yield put(getAllCartItems());
    yield setNotification("success", response.data.message);

    payload.buyNftResolve();
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}

function* checkIsAlreadySold({ payload }) {
  try {
    let data = {
      ...payload
    };

    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.post(`/users/cart/nft-operation-for-cart`, data, headers);
    yield put(getAllCartItems());
    yield setNotification("success", response.data.message);

    payload.buyNftResolve();
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}

function* addPrimaryImageNft({ payload }) {
  try {
    let headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const token = yield select(makeSelectAuthToken());
    const response = yield axios.put(`/primaryImage`, payload.data, headers);
    if (token) {
      headers = { headers: { Authorization: token } };
    }
    const responsed = yield axios.get(`/nft/${payload.data.id}`, headers);
    yield put(getnftDataSuccess(responsed.data.data));
    payload.setToggleImage();
    yield setNotification("success", response.data.message);
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}

function* resellNftRequest({ payload }) {
  try {
    let data = {
      // nftId: payload.nftId,
      // nftToken: payload.nftToken,
      // buyerAddress: payload.buyerAddress,
      // contractAddress: payload.contractAddress,
      ...payload,
      status: "Resell"
      // rprice: payload.rprice,
    };

    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.post(`/users/nftOperation`, data, headers);
    yield setNotification("success", response.data.message);
    payload.resellNftResolve();
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
    payload.setLoader(false);
  }
}

function* redeemNftRequest({ payload }) {
  try {
    let data = {
      // nftId: payload.nftId,
      // nftToken: payload.nftToken,
      // buyerAddress: payload.buyerAddress,
      // contractAddress: payload.contractAddress,
      ...payload,
      status: "Redeem"
    };

    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.post(`/users/nftOperation`, data, headers);
    yield setNotification("success", response.data.message);
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
    payload.setLoader(false);
  }
}
function* addDeliveryNftRequest({ payload }) {
  try {
    let data = {
      NftId: payload.NftId,
      tokenId: payload.TokenId.toString(),
      walletAddress: payload.WalletAddress,
      status: payload.status,
      UserId: payload.UserId
    };

    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.post(`/addDelivery`, data, headers);
    yield setNotification("success", response.data.message);
    payload.redeemNftResolve();
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
    payload.setLoader(false);
  }
}

export function* watchAddNft() {
  yield takeLatest(ADD_NFT, addNftRequest);
}
export function* watchBuyNft() {
  yield takeLatest(BUY_NFT, buyNftRequest);
}

export function* watchBulkBuyNft() {
  yield takeLatest(BULK_BUY_NFT, bulkBuyNftRequest);
}

export function* watchBuyNftCart() {
  yield takeLatest(BUY_NFT_CART, buyNftCartRequest);
}

export function* watchPrimaryImageNft() {
  yield takeLatest(ADD_PRIMARY_IMAGE_NFT, addPrimaryImageNft);
}
export function* watchResellNft() {
  yield takeLatest(RESELL_NFT, resellNftRequest);
}
export function* watchRedeemNft() {
  yield takeLatest(REDEEM_NFT, redeemNftRequest);
}
export function* watchAddDeliveryNft() {
  yield takeLatest(ADD_DELIVERY_NFT, addDeliveryNftRequest);
}

function* getAllNftRequest({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.get(
      `/nft/brandAdmin?page=${payload.page}&size=${payload.limit}&search=${payload.search}&categoryId=${payload.categoryId}&brandId=${payload.brandId}&type=${payload.type}`,
      headers
    );
    yield put(getAllNftSuccess(response.data.data));
  } catch (error) {
    yield sagaErrorHandler(error);
  } finally {
    if (payload?.setLoader) {
      payload.setLoader();
    }
  }
}

export function* watchGetAllNft() {
  yield takeLatest(GET_ALL_NFT, getAllNftRequest);
}
function* getAllBulkNftRequest({ payload }) {
  try {
    let tokenIds = [];
    const token = yield select(makeSelectAuthToken());
    const UserId = yield select(makeSelectAuthId());
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.get(`/nft/bulkNfts/${payload.bulkId}`, headers);
    const filteredRes = response?.data?.data;
    const { contractAddress } = filteredRes?.length > 0 ? filteredRes[0] : "";

    for (let item of filteredRes) {
      if (item?.progressState === "updateUriPending" && item?.updateUriPendingBy === +UserId) {
        tokenIds.push({ tokenId: item?.NFTTokens[0]?.tokenId, tokenPId: item?.NFTTokens[0]?.id });
      }
    }
    if (tokenIds?.length > 0) {
      const nftTokenIds = tokenIds.map((item) => {
        return item?.tokenId;
      });
      const data = { contractAddress, tokenIds, nftTokenIds };
      updateUriBulk(data, token);
    }
    yield put(getAllBulkNftSuccess(response.data.data));
  } catch (error) {
    yield sagaErrorHandler(error);
  }
}

export function* watchGetAllBulkNft() {
  yield takeLatest(GET_ALL_BULKNFT, getAllBulkNftRequest);
}

function* requestNftForMintingRequest({ payload }) {
  let data = {
    profitAmount: payload.profitAmount
  };
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.patch(`nft/brandAdmin/mintRequest/${payload.id}`, data, headers);

    yield put(
      getAllNft({
        categoryId: payload.categoryId,
        search: payload.search,
        page: payload.page,
        limit: payload.limit,
        type: payload.type,
        brandId: payload.brandId,
        setLoader: payload.handleClose
      })
    );
    yield setNotification("success", response.data.message);
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}

function* requestChangeTokenId({ payload }) {
  try {
    let data = {
      tokenId: payload.tokenId
    };

    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.put(`update/nftToken/${payload.id}`, data, headers);

    // yield put(
    //     getAllNft({
    //         categoryId: payload.categoryId,
    //         search: payload.search,
    //         page: payload.page,
    //         limit: payload.limit,
    //         type: payload.type,
    //         brandId: payload.brandId
    //     })
    // );
    yield setNotification("success", response.data.message);
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}

export function* watchChangeTokenId() {
  yield takeLatest(CHANGE_TOKEN_ID, requestChangeTokenId);
}
function* requestChangeResolled({ payload }) {
  try {
    let data = {
      price: payload.price,
      transactionHash: payload.transactionHash
    };

    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.post(`/updateUserOnsaleNFT/${payload?.nftId}`, data, headers);

    yield put(getALLNftResold({}));
    yield setNotification("success", response.data.message);
    payload.handleClose();
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}

export function* watchChangeResolled() {
  yield takeLatest(RESOLED_NFT, requestChangeResolled);
}
export function* watchEditNftRequest() {
  yield takeLatest(EDIT_REQUEST_METADATA_NFT, editMetadataRequest);
}
export function* watchTokenUriUpdate() {
  yield takeLatest(META_DATA_NFT_TOKEN_URI, metadataNftEdit);
}
export function* watchCancelUriToken() {
  yield takeLatest(META_DATA_URI_TOKEN_CANCEL, metaDataTokenCancel);
}
export function* watchRequestNftForMinting() {
  yield takeLatest(REQUEST_NFT_FOR_MINTING, requestNftForMintingRequest);
}

function* lazyMintNftRequest({ payload }) {
  let data = {
    minterAddress: payload.minterAddress,
    nftDataArray: JSON.stringify(payload.nftDataArray),
    tokenIdArray: JSON.stringify(payload.tokenIdArray)
  };
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.post(`nft/admin/lazyMint`, data, headers);

    yield put(
      getAllNftSuperAdmin({
        categoryId: payload.categoryId,
        brandId: payload.brandId,
        search: payload.search,
        page: payload.page,
        limit: payload.limit,
        type: payload.type
      })
    );
    yield setNotification("success", response.data.message);
    payload.handleClose();
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
    payload.handleClose();
  }
}

export function* watchLazyMintNft() {
  yield takeLatest(LAZY_MINT_NFT, lazyMintNftRequest);
}

function* mintNftRequest({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    let response = null;
    if (payload.transactionHash) {
      const { nftDataArray, tokenIdArray, minterAddress, transactionHash, signerAddress, tokenUriArray, runCronJob } =
        payload;
      response = yield axios.post(
        `nft/admin/mint`,
        { nftDataArray, tokenIdArray, minterAddress, transactionHash, signerAddress, tokenUriArray, runCronJob },
        headers
      );
    } else {
      const { nftDataArray } = payload;
      response = yield axios.post(`nft/admin/mint`, { nftDataArray }, headers);
    }
    yield put(
      getAllNftSuperAdmin({
        categoryId: payload.categoryId,
        brandId: payload.brandId,
        search: payload.search,
        page: payload.page,
        limit: payload.limit,
        type: payload.type,
        setLoader: payload.handleClose
      })
    );
    yield setNotification("success", response.data.message);
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
    payload.setMintNftoading(false);
    if (payload?.handleError) {
      payload?.handleError();
    }
  }
}

export function* watchMintNft() {
  yield takeLatest(MINT_NFT, mintNftRequest);
}

function* mintLoaderNftRequest({ payload }) {
  yield put(setStateMintedNFtSuccess(payload));
}
export function* watchMinLoaderNft() {
  yield takeLatest(MINT_LOADER_NFT, mintLoaderNftRequest);
}

function* rejectNftRequest({ payload }) {
  try {
    const { rejectReason } = payload;
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.patch(`nft/admin/mintReject/${payload.id}`, { rejectReason: rejectReason }, headers);
    yield put(
      getAllNftSuperAdmin({
        categoryId: payload.categoryId,
        brandId: payload.brandId,
        search: payload.search,
        page: payload.page,
        limit: payload.limit,
        type: payload.type,
        setLoader: payload.setLoader
      })
    );
    yield setNotification("success", "Action successful");
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}

export function* watchRejectNft() {
  yield takeLatest(REJECT_NFT, rejectNftRequest);
}
function* rejectEditNftRequest({ payload }) {
  try {
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.put(`/nft/rejectEditMetaDataRequest/${payload.id}`, {}, headers);
    yield put(
      getAllNftSuperAdmin({
        categoryId: payload.categoryId,
        brandId: payload.brandId,
        search: payload.search,
        page: payload.page,
        limit: payload.limit,
        type: payload.type,
        setLoader: payload.setLoader
      })
    );
    yield setNotification("success", response.data.message);
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}

export function* watchRejectEditNft() {
  yield takeLatest(REJECT_EDIT_NFT, rejectEditNftRequest);
}
function* approveEditNftRequest({ payload }) {
  const token = yield select(makeSelectAuthToken());
  try {
    let data = {
      ipfsUrl: payload.ipfsUrl
    };
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.put(`/nft/approveEditRequest/${payload.id}`, data, headers);
    const filteredData = response?.data?.data;
    updateSingleUri(filteredData, token);
    yield put(
      getAllNftSuperAdmin({
        categoryId: payload.categoryId,
        brandId: payload.brandId,
        search: payload.search,
        page: payload.page,
        limit: payload.limit,
        type: payload.type,
        setLoader: payload.handleClose
      })
    );

    if (payload?.bulkId) {
      yield put(
        getAllBulkNft({
          bulkId: payload?.bulkId
        })
      );
    }

    yield setNotification("success", response.data.message);
  } catch (error) {
    yield sagaErrorHandler(error.response.data.data);
  }
}

export function* watchApproveEditNft() {
  yield takeLatest(APPROVE_EDIT_NFT, approveEditNftRequest);
}

function* uploadNftImages({ payload }) {
  try {
    const { acceptedFiles, recentImages, isPrimary, setPrimaryLoader, setSecondaryImageLoader } = payload;
    const recentImagess = store.getState().nftReducer?.upload_nft_images;

    const formData = new FormData();
    for (let i = 0; i < acceptedFiles.length; i++) {
      formData.append("objForIpfsClient", acceptedFiles[i]);
    }
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const response = yield axios.post(`/ipfs/client/multi-upload`, formData, headers);
    const filteredData = response?.data;
    let setImages = [];
    if (false) {
      const response = yield axios.post(`/ipfs/client/multi-upload?removeBackGround=true`, formData, headers);
      setImages = filteredData.map((item, index) => ({
        ...item,
        isPrimary: isPrimary,
        useBackGroundRemoved: true,
        backgroundRemovedPath: response.data[0].path
      }));
    } else {
      setImages = filteredData.map((item, index) => ({
        ...item,
        id: Math.floor(100000 + Math.random() * 900000),
        isPrimary: isPrimary
      }));
    }
    console.log(setImages);
    setPrimaryLoader(false);
    if (setSecondaryImageLoader) {
      setSecondaryImageLoader(false);
    }
    yield put(UploadNftImagesSuccess(recentImagess.concat(setImages)));
  } catch (error) {
    console.log(error);
  }
}
export function* watchUploadNftImages() {
  yield takeLatest(UPLOAD_NFT_IMAGES, uploadNftImages);
}

function* uploadNFtImageBackgroundRemove({ payload }) {
  const { primaryImage, switchremoveBackground, setRemoveBackgroundLoader } = payload;

  try {
    const response = yield fetch(primaryImage);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const blob = yield response.blob();
    const file = new File([blob], "image.jpg", { type: blob.type });

    const formData = new FormData();
    formData.append("objForIpfsClient", file);
    const headers = { headers: { Authorization: `Bearer ${yield select(makeSelectAuthToken())}` } };
    const responsed = yield axios.post(
      `/ipfs/client/multi-upload?removeBackGround=${switchremoveBackground}`,
      formData,
      headers
    );
    yield put(BackgroundRemovalImageSuccess(responsed.data[0].path));
    setRemoveBackgroundLoader(false);
  } catch (err) {
    console.log(err.message);
    setRemoveBackgroundLoader(false);
  }
}

export function* watchUploadNftImageBackgroundRemove() {
  yield takeLatest(UPLOAD_IMAGE_BACKGROUND_CHANGE, uploadNFtImageBackgroundRemove);
}
export default function* nftSaga() {
  yield all([
    fork(watchGetAllNft),
    fork(watchGetAllBulkNft),
    fork(watchGetAllNftSuperAdmin),
    fork(watchGetAllNftUser),
    fork(watchGetNftResold),
    fork(watchCancleResoldNft),
    fork(watchEditNftRequest),
    fork(watchAddNft),
    fork(watchCancelUriToken),
    fork(watchBuyNft),
    fork(watchBulkBuyNft),
    fork(watchPrimaryImageNft),
    fork(watchResellNft),
    fork(watchRedeemNft),
    fork(watchAddDeliveryNft),
    fork(watchMintNft),
    fork(watchLazyMintNft),
    fork(watchRequestNftForMinting),
    fork(watchEditNft),
    fork(watchEditRequestNft),
    fork(watchDeleteNft),
    fork(watchRejectNft),
    fork(watchGetNftBuyer),
    fork(watchChangeTokenId),
    fork(watchGetEditedNftData),
    fork(watchUpdateNftDynamicMetaData),
    fork(watchRejectEditNft),
    fork(watchApproveEditNft),
    fork(watchChangeResolled),
    fork(watchTokenUriUpdate),
    fork(watchBuyNftCart),
    fork(watchMinLoaderNft),
    fork(watchRemovedNft),
    fork(watchUploadNftImages),
    fork(watchUploadNftImageBackgroundRemove)
  ]);
}
