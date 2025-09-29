import { combineReducers } from "redux";
import customizationReducer from "./themeReducers/customizationReducer";
import snackbarReducer from "./themeReducers/snackbarReducer";
import AuthReducer from "redux/auth/reducers";
import brand from "redux/brand/reducers";
import category from "redux/categories/reducers";
import subAdminReducer from "redux/subAdmin/reducers";
import brandadminReducer from "redux/brandAdmin/reducers";
import brandCategoryReducer from "redux/brandCategory/reducers";
import nftReducer from "redux/nftManagement/reducers";
import landingPageReducer from "redux/landingPage/reducers";
import marketplaceReducer from "redux/marketplace/reducers";
import delivery from "redux/deliveryDashboard/reducers";
import permissioned from "redux/permissioned/reducers";
import addressesReducer from "redux/addresses/reducers";
import allActivityReducer from "redux/activity/reducers";
import brandActivityReducer from "redux/brandActivityDashboard/reducers";
import Currency from "redux/generalSettingSuperadmin/reducers";

const rootReducer = combineReducers({
  customization: customizationReducer,
  snackbar: snackbarReducer,
  auth: AuthReducer,
  addresses: addressesReducer,
  brand: brand,
  category: category,
  subAdminReducer: subAdminReducer,
  brandadminReducer: brandadminReducer,
  brandCategoryReducer: brandCategoryReducer,
  nftReducer: nftReducer,
  landingPageReducer: landingPageReducer,
  marketplaceReducer: marketplaceReducer,
  delivery: delivery,
  permissioned: permissioned,
  allActivityReducer: allActivityReducer,
  brandActivityReducer: brandActivityReducer,
  Currency: Currency
});

export default rootReducer;
