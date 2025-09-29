import {
  GET_ALL_CATEGORIES,
  GET_ALL_CATEGORIES_SUCCESS,
  ADD_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
  GET_ALL_CATEGORIES_BY_BRAND,
  GET_ALL_CATEGORIES_BY_BRAND_SUCCESS
} from "./constants";

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

export const addCategory = (data) => {
  return {
    type: ADD_CATEGORY,
    payload: data
  };
};

export const updateCategory = (data) => {
  return {
    type: UPDATE_CATEGORY,
    payload: data
  };
};

export const deleteCategory = (data) => {
  return {
    type: DELETE_CATEGORY,
    payload: data
  };
};

export const getAllCategoriesByBrand = (data) => {
  return {
    type: GET_ALL_CATEGORIES_BY_BRAND,
    payload: data
  };
};

export const getAllCategoriesByBrandSuccess = (data) => {
  return {
    type: GET_ALL_CATEGORIES_BY_BRAND_SUCCESS,
    payload: data
  };
};
