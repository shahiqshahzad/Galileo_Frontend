import produce from "immer";
import {
  GET_ALL_GALILEO_SUCCESS,
  GET_ALL_TRENDING_SUCCESS,
  GET_ALL_BRANDS_SUCCESS,
  GET_ALL_CATEGORIES_SUCCESS,
  GET_NFT_DATA_SUCCESS,
  BMW_SUCCESS,
  COMINGSOON_MARKETPLACE_SUCCESS,
  GET_NFT_TAX_SUCCESS
} from "./constants";

const INITIAL_STATE = {
  galileo: [],
  trending: [],
  brands: [],
  categories: [],
  nft: [],
  nftTax: 0,
  bmwData: [],
  comingsoon_marketplace: { comingSoonBrandsData: [], comingSoonNftsData: [] }
};

const landingPageReducer = produce((draft, action) => {
  switch (action.type) {
    case GET_ALL_GALILEO_SUCCESS:
      draft.galileo = action.payload;
      break;
    case GET_ALL_TRENDING_SUCCESS:
      draft.trending = action.payload;
      break;
    case GET_ALL_BRANDS_SUCCESS:
      draft.brands = action.payload;
      break;
    case GET_ALL_CATEGORIES_SUCCESS:
      draft.categories = action.payload;
      break;
    case GET_NFT_DATA_SUCCESS:
      draft.nft = action.payload;

      break;
    case BMW_SUCCESS:
      draft.bmwData = action.payload;
      break;
    case COMINGSOON_MARKETPLACE_SUCCESS:
      draft.comingsoon_marketplace = action.payload;
      break;
    case GET_NFT_TAX_SUCCESS:
      draft.nftTax = action.payload.taxCounted;
      draft.note = action.payload.note;
      break;
    default:
  }
}, INITIAL_STATE);

export default landingPageReducer;
