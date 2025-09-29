import {
  // Brand
  GET_ALL_BRANDS,
  GET_ALL_BRANDS_SUCCESS,
  UPDATE_PROPERTY,
  ADD_BRAND,
  UPDATE_BRAND,
  DELETE_BRAND,
  GET_ALL_BRANDS_BY_ADMIN,
  GET_ALL_BRANDS_BY_ADMIN_SUCCESS
} from "./constants";

// Brands

export const getAllBrands = (data) => {
  return {
    type: GET_ALL_BRANDS,
    payload: data
  };
};

export const getAllBrandsByAdmin = (data) => {
  return {
    type: GET_ALL_BRANDS_BY_ADMIN,
    payload: data
  };
};

export const getAllBrandsSuccess = (data) => {
  return {
    type: GET_ALL_BRANDS_SUCCESS,
    payload: data
  };
};

export const getAllBrandsByAdminSuccess = (data) => {
  return {
    type: GET_ALL_BRANDS_BY_ADMIN_SUCCESS,
    payload: data
  };
};

export const addBrand = (data) => {
  return {
    type: ADD_BRAND,
    payload: data
  };
};

export const updateBrand = (data) => {
  return {
    type: UPDATE_BRAND,
    payload: data
  };
};
export const updateProperty = (data) => {
  return {
    type: UPDATE_PROPERTY,
    payload: data
  };
};

export const deleteBrand = (data) => {
  return {
    type: DELETE_BRAND,
    payload: data
  };
};
