import {
  GET_ALL_GALILEO_SUCCESS,
  GET_ALL_GALILEO,
  GET_ALL_TRENDING,
  GET_ALL_TRENDING_SUCCESS,
  GET_ALL_BRANDS,
  GET_ALL_BRANDS_SUCCESS,
  GET_ALL_CATEGORIES,
  GET_ALL_CATEGORIES_SUCCESS,
  GET_NFT_DATA,
  GET_NFT_DATA_SUCCESS,
  BMW,
  BMW_SUCCESS,
  COMINGSOON_MARKETPLACE,
  COMINGSOON_MARKETPLACE_SUCCESS,
  GET_NFT_TAX,
  GET_NFT_TAX_SUCCESS
} from "./constants";

export const getAllgalileo = (data) => {
  return {
    type: GET_ALL_GALILEO,
    payload: data
  };
};

export const getAllgalileoSuccess = (data) => {
  return {
    type: GET_ALL_GALILEO_SUCCESS,
    payload: data
  };
};
export const getAllTrending = (data) => {
  return {
    type: GET_ALL_TRENDING,
    payload: data
  };
};

export const getAllTrendingSuccess = (data) => {
  return {
    type: GET_ALL_TRENDING_SUCCESS,
    payload: data
  };
};
export const getAllBrands = (data) => {
  return {
    type: GET_ALL_BRANDS,
    payload: data
  };
};

export const getAllBrandsSuccess = (data) => {
  return {
    type: GET_ALL_BRANDS_SUCCESS,
    payload: data
  };
};
export const getAllCategories = (data) => {
  return {
    type: GET_ALL_CATEGORIES,
    payload: data
  };
};

export const getAllCategoriesSuccess = (data) => {
  return {
    type: GET_ALL_CATEGORIES_SUCCESS,
    payload: data
  };
};
export const getnftData = (data) => {
  return {
    type: GET_NFT_DATA,
    payload: data
  };
};

export const getnftDataSuccess = (data) => {
  return {
    type: GET_NFT_DATA_SUCCESS,
    payload: data
  };
};
export const bmwPage = (data) => {
  return {
    type: BMW,
    payload: data
  };
};

export const bmwPageSuccess = (data) => {
  return {
    type: BMW_SUCCESS,
    payload: data
  };
};

export const getcomingSoonMarketplace = (data) => {
  return {
    type: COMINGSOON_MARKETPLACE,
    payload: data
  };
};

export const comingSoonMarketplaceSuccess = (data) => {
  return {
    type: COMINGSOON_MARKETPLACE_SUCCESS,
    payload: data
  };
};

export const getNftTax = (data) => {
  return {
    type: GET_NFT_TAX,
    payload: data
  };
};

export const getNftTaxSuccess = (data) => {
  return {
    type: GET_NFT_TAX_SUCCESS,
    payload: data
  };
};
