import {
  GET_ALL_NFT_SUPER_ADMIN,
  RESOLED_NFT,
  GET_ALL_NFT_SUPER_ADMIN_SUCCESS,
  GET_ALL_NFT_USER_SUCCESS,
  GET_ALL_NFT,
  GET_ALL_NFT_SUCCESS,
  GET_ALL_BULKNFT,
  GET_ALL_BULKNFT_SUCCESS,
  ADD_NFT,
  MINT_NFT,
  LAZY_MINT_NFT,
  REQUEST_NFT_FOR_MINTING,
  EDIT_NFT,
  EDIT_REQUEST_NFT,
  APPROVE_EDIT_NFT,
  DELETE_NFT,
  REMOVED_NFT,
  REJECT_NFT,
  BUY_NFT,
  GET_ALL_NFT_USER,
  RESELL_NFT,
  REDEEM_NFT,
  GET_NFT_BUYER_SUCCESS,
  GET_NFT_BUYER,
  ADD_DELIVERY_NFT,
  CHANGE_TOKEN_ID,
  GET_EDITED_NFT_DATA,
  UPDATE_NFT_DYNAMIC_METADATA,
  GET_ALL_NFT_RESOLD_SUCCESS,
  GET_ALL_NFT_RESOLD,
  CANCLE_RESELL_NFT,
  CANCLE_RESELL_NFT_SUCCESS,
  REJECT_EDIT_NFT,
  EDIT_REQUEST_METADATA_NFT,
  META_DATA_NFT_TOKEN_URI,
  GET_NFT_TOKEN_SUCCESS,
  META_DATA_URI_TOKEN_CANCEL,
  ADD_PRIMARY_IMAGE_NFT,
  BUY_NFT_CART,
  IS_ALREADY_SOLD,
  MINT_LOADER_NFT,
  SET_STATE_MINTED_NFT_SUCCESS,
  RESOLD_NFT_LOADER,
  RESOLD_NFT_LOADER_SUCCESS,
  BULK_BUY_NFT,
  UPLOAD_NFT_IMAGES,
  UPLOAD_NFT_IMAGES_SUCCESS,
  UPLOAD_IMAGE_BACKGROUND_CHANGE,
  UPLOAD_IMAGE_BACKGROUND_CHANGE_SUCCESS
} from "./constants";

export const updateNftDynamicMetaData = (data) => {
  return {
    type: UPDATE_NFT_DYNAMIC_METADATA,
    payload: data
  };
};

export const editRequestMetadata = (data) => {
  return {
    type: EDIT_REQUEST_METADATA_NFT,
    payload: data
  };
};
export const metaDataUpdateToken = (data) => {
  return {
    type: META_DATA_NFT_TOKEN_URI,
    payload: data
  };
};

export const cancelUriToken = () => {
  return {
    type: META_DATA_URI_TOKEN_CANCEL
  };
};

export const getEditedNftData = (data) => {
  return {
    type: GET_EDITED_NFT_DATA,
    payload: data
  };
};

export const getAllNftSuperAdmin = (data) => {
  return {
    type: GET_ALL_NFT_SUPER_ADMIN,
    payload: data
  };
};
export const setStateMintedNFtSuccess = (data) => {
  return {
    type: SET_STATE_MINTED_NFT_SUCCESS,
    payload: data
  };
};
export const getNftBuyer = (data) => {
  return {
    type: GET_NFT_BUYER,
    payload: data
  };
};
export const getNftBuyerSuccess = (data) => {
  return {
    type: GET_NFT_BUYER_SUCCESS,
    payload: data
  };
};

export const getAllNftUser = (data) => {
  return {
    type: GET_ALL_NFT_USER,
    payload: data
  };
};
export const getALLNftResold = (data) => {
  return {
    type: GET_ALL_NFT_RESOLD,
    payload: data
  };
};
export const cancleReselNft = (data) => {
  return {
    type: CANCLE_RESELL_NFT,
    payload: data
  };
};
export const getAllNftSuccessSuperAdmin = (data) => {
  return {
    type: GET_ALL_NFT_SUPER_ADMIN_SUCCESS,
    payload: data
  };
};

export const getAllNftSuccessUser = (data) => {
  return {
    type: GET_ALL_NFT_USER_SUCCESS,
    payload: data
  };
};

export const getNftResoldSuccess = (data) => {
  return {
    type: GET_ALL_NFT_RESOLD_SUCCESS,
    payload: data
  };
};
export const cancleReselNftSuccess = (data) => {
  return {
    type: CANCLE_RESELL_NFT_SUCCESS,
    payload: data
  };
};
export const getAllNft = (data) => {
  return {
    type: GET_ALL_NFT,
    payload: data
  };
};

export const getAllNftSuccess = (data) => {
  return {
    type: GET_ALL_NFT_SUCCESS,
    payload: data
  };
};
export const getEditNFtSuccess = (data) => {
  return {
    type: GET_NFT_TOKEN_SUCCESS,
    payload: data
  };
};
export const getAllBulkNft = (data) => {
  return {
    type: GET_ALL_BULKNFT,
    payload: data
  };
};

export const getAllBulkNftSuccess = (data) => {
  return {
    type: GET_ALL_BULKNFT_SUCCESS,
    payload: data
  };
};

export const addNft = (data) => {
  return {
    type: ADD_NFT,
    payload: data
  };
};

export const buyNft = (data) => {
  return {
    type: BUY_NFT,
    payload: data
  };
};

export const bulkBuyNft = (data) => {
  return {
    type: BULK_BUY_NFT,
    payload: data
  };
};

export const addPrimaryImageNft = (data) => {
  return {
    type: ADD_PRIMARY_IMAGE_NFT,
    payload: data
  };
};

export const changeTokenId = (data) => {
  return {
    type: CHANGE_TOKEN_ID,
    payload: data
  };
};

export const resellNft = (data) => {
  return {
    type: RESELL_NFT,
    payload: data
  };
};
export const resoledNft = (data) => {
  return {
    type: RESOLED_NFT,
    payload: data
  };
};

export const redeemNft = (data) => {
  return {
    type: REDEEM_NFT,
    payload: data
  };
};
export const addDeliveryNft = (data) => {
  return {
    type: ADD_DELIVERY_NFT,
    payload: data
  };
};

export const deleteNft = (data) => {
  return {
    type: DELETE_NFT,
    payload: data
  };
};
export const removedNft = (data) => {
  return {
    type: REMOVED_NFT,
    payload: data
  };
};

export const editNft = (data) => {
  return {
    type: EDIT_NFT,
    payload: data
  };
};
export const editRequestNft = (data) => {
  return {
    type: EDIT_REQUEST_NFT,
    payload: data
  };
};

export const requestNftForMinting = (data) => {
  return {
    type: REQUEST_NFT_FOR_MINTING,
    payload: data
  };
};

export const lazyMintNft = (data) => {
  return {
    type: LAZY_MINT_NFT,
    payload: data
  };
};

export const mintNft = (data) => {
  return {
    type: MINT_NFT,
    payload: data
  };
};
export const mintLoaderNft = (data) => {
  return {
    type: MINT_LOADER_NFT,
    payload: data
  };
};
export const resoldNftLoader = (data) => {
  return {
    type: RESOLD_NFT_LOADER,
    payload: data
  };
};
export const resoldNftLoaderSuccess = (data) => {
  return {
    type: RESOLD_NFT_LOADER_SUCCESS,
    payload: data
  };
};

export const rejectNft = (data) => {
  return {
    type: REJECT_NFT,
    payload: data
  };
};
export const rejectEditNft = (data) => {
  return {
    type: REJECT_EDIT_NFT,
    payload: data
  };
};
export const approveEditNft = (data) => {
  return {
    type: APPROVE_EDIT_NFT,
    payload: data
  };
};
export const buyNftCart = (data) => {
  return {
    type: BUY_NFT_CART,
    payload: data
  };
};

export const checkIsAlreadySold = (data) => {
  return {
    type: IS_ALREADY_SOLD,
    payload: data
  };
};

export const UploadNftImages = (data) => {
  return {
    type: UPLOAD_NFT_IMAGES,
    payload: data
  };
};
export const UploadNftImagesSuccess = (data) => {
  return {
    type: UPLOAD_NFT_IMAGES_SUCCESS,
    payload: data
  };
};

export const BackgroundRemovalImage = (data) => {
  return {
    type: UPLOAD_IMAGE_BACKGROUND_CHANGE,
    payload: data
  };
};
export const BackgroundRemovalImageSuccess = (data) => {
  return {
    type: UPLOAD_IMAGE_BACKGROUND_CHANGE_SUCCESS,
    payload: data
  };
};
