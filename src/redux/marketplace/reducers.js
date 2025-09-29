/* eslint-disable no-unused-vars */
import produce from "immer";
import {
  CLEAR_NOTIFICATIONS_DATA,
  GET_ALL_MARKETPLACE_CATEGORIES_SUCCESS,
  GET_ALL_MARKETPLACE_NFTS_BY_CATEGORY_SUCCESS,
  GET_ALL_SIMILAR_PRODUCTS_SUCCESS,
  GET_NOTIFICATION_SUCCESS,
  GET_SEPARATE_NOTIFICATION_HIGH_SUCCESS,
  GET_SEPARATE_NOTIFICATION_LOW_SUCCESS,
  GET_SEPARATE_NOTIFICATION_MEDIUM_SUCCESS,
  GET_SEPARATE_NOTIFICATION_SUCCESS,
  TRACKING_TOOL_SUCCESS,
  GET_ALL_CART_ITEMS_SUCCESS,
  GET_ALL_WISHLIST_ITEMS,
  GET_ALL_WISHLIST_ITEMS_SUCCESS,
  DELETE_WISHLIST_ITEM,
  GET_SEARCH_SUCCESS,
  NOTIFICATION_COUNT,
  GET_ALL_NOTIFICATION_COUNT,
  GET_RECENT_SEARCH_SUCCESS,
  GET_ALL_MARKETPLACE_SEARCH_SUCCESS
} from "./constants";

const INITIAL_STATE = {
  marketplaceCategories: [],
  marketplaceNfts: [],
  similarProductNfts: [],
  trackNft: [],
  notifications: [],
  cartItems: [],
  wishlist: [],
  notificationIconCount: false,
  separateNotifications: { count: 0, rows: [] },
  separateHighNotifications: { count: 0, rows: [] },
  separateLowNotifications: { count: 0, rows: [] },
  separateMediumNotifications: { count: 0, rows: [] },
  marketPlaceSearch: [],
  allCountNotification: [],
  marketPlaceRecentSearch: []
};

const marketplaceReducer = produce((draft, action) => {
  switch (action.type) {
    case GET_ALL_MARKETPLACE_CATEGORIES_SUCCESS:
      draft.marketplaceCategories = action.payload;
      break;
    case TRACKING_TOOL_SUCCESS:
      draft.trackNft = action.payload;
      break;
    case GET_ALL_MARKETPLACE_NFTS_BY_CATEGORY_SUCCESS:
      draft.marketplaceNfts = action.payload;
      break;
    case GET_ALL_SIMILAR_PRODUCTS_SUCCESS:
      draft.similarProductNfts = action.payload;
      break;
    case GET_NOTIFICATION_SUCCESS:
      draft.notifications = action.payload;
      break;
    case GET_SEPARATE_NOTIFICATION_SUCCESS:
      draft.separateNotifications = action.payload;
      break;
    case GET_ALL_NOTIFICATION_COUNT:
      draft.allCountNotification = action.payload;
      break;
    case GET_SEPARATE_NOTIFICATION_HIGH_SUCCESS:
      draft.separateHighNotifications = action.payload;
      break;
    case GET_SEPARATE_NOTIFICATION_LOW_SUCCESS:
      draft.separateLowNotifications = action.payload;
      break;
    case GET_SEPARATE_NOTIFICATION_MEDIUM_SUCCESS:
      draft.separateMediumNotifications = action.payload;
      break;
    case CLEAR_NOTIFICATIONS_DATA:
      draft.separateNotifications = { count: 0, rows: [] };
      draft.separateHighNotifications = { count: 0, rows: [] };
      draft.separateLowNotifications = { count: 0, rows: [] };
      draft.separateMediumNotifications = { count: 0, rows: [] };
      break;
    case GET_ALL_CART_ITEMS_SUCCESS:
      draft.cartItems = action.payload;
      break;
    case GET_ALL_WISHLIST_ITEMS_SUCCESS:
      draft.wishlist = action.payload;
      break;
    case GET_SEARCH_SUCCESS:
      draft.marketPlaceSearch = action.payload;
      break;
    case NOTIFICATION_COUNT:
      draft.notificationIconCount = action.payload;
      break;
    case GET_RECENT_SEARCH_SUCCESS:
      draft.marketPlaceRecentSearch = action.payload;
      break;
    default:
  }
}, INITIAL_STATE);

export default marketplaceReducer;
