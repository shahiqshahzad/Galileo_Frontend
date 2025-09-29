import produce from "immer";
import {
  GET_ALL_BRAND_CATEGORIES_ADMIN_SUCCESS,
  GET_ALL_BRAND_CATEGORIES_BY_ADMIN_SUCCESS,
  GET_ALL_BRAND_CATEGORIES_SUCCESS,
  GET_ALL_CATEGORIES_DROPDOWN_SUCCESS
} from "./constants";

const INITIAL_STATE = {
  brandCategoriesList: [],
  categoriesDropdownList: [],
  brandCategoriesAdminList: [],
  brandCategoriesByAdminList: []
};

const brandCategoryReducer = produce((draft, action) => {
  switch (action.type) {
    case GET_ALL_BRAND_CATEGORIES_SUCCESS:
      draft.brandCategoriesList = action.payload;
      break;
    case GET_ALL_CATEGORIES_DROPDOWN_SUCCESS:
      draft.categoriesDropdownList = action.payload;
      break;
    case GET_ALL_BRAND_CATEGORIES_ADMIN_SUCCESS:
      draft.brandCategoriesAdminList = action.payload;
      break;
    case GET_ALL_BRAND_CATEGORIES_BY_ADMIN_SUCCESS:
      draft.brandCategoriesByAdminList = action.payload;
      break;

    default:
  }
}, INITIAL_STATE);

export default brandCategoryReducer;
