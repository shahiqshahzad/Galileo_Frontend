/* eslint-disable no-unused-vars */
import produce from "immer";
import {
  GET_ALL_NFT_SUCCESS,
  GET_ALL_BULKNFT_SUCCESS,
  GET_ALL_NFT_SUPER_ADMIN_SUCCESS,
  GET_ALL_NFT_USER_SUCCESS,
  GET_NFT_BUYER_SUCCESS,
  GET_ALL_NFT_RESOLD,
  GET_ALL_NFT_RESOLD_SUCCESS,
  CANCLE_RESELL_NFT,
  CANCLE_RESELL_NFT_SUCCESS,
  EDIT_REQUEST_METADATA_NFT,
  GET_EDIT_NFT_REQUEST,
  META_DATA_NFT_TOKEN_URI,
  GET_NFT_TOKEN_SUCCESS,
  SET_STATE_MINTED_NFT_SUCCESS,
  RESOLD_NFT_LOADER,
  RESOLD_NFT_LOADER_SUCCESS,
  UPLOAD_NFT_IMAGES_SUCCESS,
  UPLOAD_IMAGE_BACKGROUND_CHANGE,
  UPLOAD_IMAGE_BACKGROUND_CHANGE_SUCCESS
} from "./constants";

const INITIAL_STATE = {
  mintNftLoader: false,
  getResoldNftLoader: false,
  nftList: [],
  bulknftList: [],
  nftListSuperAdmin: [],
  nftListUser: [],
  nftBuyer: {},
  nftResold: [],
  cancleNft: {},
  nft_edit: {},
  nft_token: {},
  nft_token_edit: {},
  upload_nft_images: [],
  upload_image_background_change: null
};

const nftReducer = produce((draft, action) => {
  switch (action.type) {
    case GET_ALL_NFT_SUCCESS:
      draft.nftList = action.payload;
      break;
    case GET_NFT_TOKEN_SUCCESS:
      draft.nft_token = action.payload;
      break;
    case GET_ALL_BULKNFT_SUCCESS:
      draft.bulknftList = action.payload;
      break;

    case GET_ALL_NFT_SUPER_ADMIN_SUCCESS:
      draft.nftListSuperAdmin = action.payload;
      break;
    case SET_STATE_MINTED_NFT_SUCCESS:
      draft.mintNftLoader = action.payload;
      break;
    case GET_ALL_NFT_USER_SUCCESS:
      draft.nftListUser = action.payload;
      break;

    case GET_NFT_BUYER_SUCCESS:
      draft.nftBuyer = action.payload;
      break;
    case EDIT_REQUEST_METADATA_NFT:
      draft.nft_edit = action.payload;
      break;
    case META_DATA_NFT_TOKEN_URI:
      draft.nft_token_edit = action.payload;
      break;
    case GET_ALL_NFT_RESOLD_SUCCESS:
      draft.nftResold = action.payload;
      break;

    case RESOLD_NFT_LOADER:
      draft.getResoldNftLoader = true;
      break;
    case RESOLD_NFT_LOADER_SUCCESS:
      draft.getResoldNftLoader = false;
      break;
    case CANCLE_RESELL_NFT_SUCCESS:
      draft.cancleNft = action.payload;
      break;
    case UPLOAD_NFT_IMAGES_SUCCESS:
      draft.upload_nft_images = action.payload;
      break;
    case UPLOAD_IMAGE_BACKGROUND_CHANGE_SUCCESS:
      draft.upload_image_background_change = action.payload;
      break;
    default:
  }
}, INITIAL_STATE);

export default nftReducer;
