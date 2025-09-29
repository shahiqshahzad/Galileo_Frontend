import {
  GET_ALL_BRAND_CATEGORIES,
  GET_ALL_BRAND_CATEGORIES_SUCCESS,
  GET_ALL_BRAND_CATEGORIES_ADMIN,
  GET_ALL_BRAND_CATEGORIES_ADMIN_SUCCESS,
  GET_ALL_CATEGORIES_DROPDOWN,
  GET_ALL_CATEGORIES_DROPDOWN_SUCCESS,
  ADD_BRAND_CATEGORY,
  UPDATE_BRAND_CATEGORY,
  DELETE_BRAND_CATEGORY,
  GET_ALL_BRAND_CATEGORIES_BY_ADMIN,
  GET_ALL_BRAND_CATEGORIES_BY_ADMIN_SUCCESS,
  DEACTIVATION_BRAND,
  UPDATE_BRAND_CATEGORY_TOGGLE
} from "./constants";

export const getAllBrandCategoriesAdmin = (data) => {
  return {
    type: GET_ALL_BRAND_CATEGORIES_ADMIN,
    payload: data
  };
};

export const getAllBrandCategoriesAdminSuccess = (data) => {
  return {
    type: GET_ALL_BRAND_CATEGORIES_ADMIN_SUCCESS,
    payload: data
  };
};
export const getAllCategoriesDropdown = (data) => {
  return {
    type: GET_ALL_CATEGORIES_DROPDOWN,
    payload: data
  };
};

export const getAllCategoriesDropdownSuccess = (data) => {
  return {
    type: GET_ALL_CATEGORIES_DROPDOWN_SUCCESS,
    payload: data
  };
};

export const getAllBrandCategoriesByAdmin = (data) => {
  return {
    type: GET_ALL_BRAND_CATEGORIES_BY_ADMIN,
    payload: data
  };
};

export const getAllBrandCategoriesByAdminSuccess = (data) => {
  return {
    type: GET_ALL_BRAND_CATEGORIES_BY_ADMIN_SUCCESS,
    payload: data
  };
};

export const getAllBrandCategories = (data) => {
  return {
    type: GET_ALL_BRAND_CATEGORIES,
    payload: data
  };
};

export const getAllBrandCategoriesSuccess = (data) => {
  return {
    type: GET_ALL_BRAND_CATEGORIES_SUCCESS,
    payload: data
  };
};

export const addBrandCategory = (data) => {
  return {
    type: ADD_BRAND_CATEGORY,
    payload: data
  };
};
export const updateBrandCategoryToggle = (data) => {
  return {
    type: UPDATE_BRAND_CATEGORY_TOGGLE,
    payload: data
  };
};
export const deactivationBrands = (data) => {
  return {
    type: DEACTIVATION_BRAND,
    payload: data
  };
};

export const updateBrandCategory = (data) => {
  return {
    type: UPDATE_BRAND_CATEGORY,
    payload: data
  };
};

export const deleteBrandCategory = (data) => {
  return {
    type: DELETE_BRAND_CATEGORY,
    payload: data
  };
};
