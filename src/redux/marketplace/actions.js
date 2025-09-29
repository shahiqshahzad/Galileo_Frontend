import {
  CHANGE_NOTIFICATION_ALL_STATUS,
  CHANGE_NOTIFICATION_STATUS,
  CLEAR_NOTIFICATIONS_DATA,
  CLEAR_SEPARATE_NOTIFICATION,
  DELETE_NOTIFICATION,
  GET_ALL_MARKETPLACE_CATEGORIES,
  GET_ALL_MARKETPLACE_CATEGORIES_SUCCESS,
  GET_ALL_MARKETPLACE_NFTS_BY_CATEGORY,
  GET_ALL_MARKETPLACE_NFTS_BY_CATEGORY_SUCCESS,
  GET_ALL_SIMILAR_PRODUCTS,
  GET_ALL_SIMILAR_PRODUCTS_SUCCESS,
  GET_NOTIFICATION,
  GET_NOTIFICATION_SUCCESS,
  GET_SEPARATE_NOTIFICATION,
  GET_SEPARATE_NOTIFICATION_HIGH_SUCCESS,
  GET_SEPARATE_NOTIFICATION_LOW_SUCCESS,
  GET_SEPARATE_NOTIFICATION_MEDIUM_SUCCESS,
  GET_SEPARATE_NOTIFICATION_SUCCESS,
  TRACKING_TOOL,
  TRACKING_TOOL_SUCCESS,
  UPDATE_ALL_MARKETPLACE_CATEGORIES,
  GET_ALL_CART_ITEMS,
  GET_ALL_CART_ITEMS_SUCCESS,
  DELETE_CART_ITEM,
  GET_ALL_WISHLIST_ITEMS,
  GET_ALL_WISHLIST_ITEMS_SUCCESS,
  DELETE_WISHLIST_ITEM,
  MOVE_TO_WISHLIST,
  ADD_TO_WISHLIST,
  MOVE_TO_CART,
  ADD_TO_CART,
  GET_SEARCH,
  GET_SEARCH_SUCCESS,
  UPDATE_CART_ITEM,
  NOTIFICATION_COUNT,
  GET_NOTIFICATION_FIRST_TIME,
  GET_ALL_NOTIFICATION_COUNT,
  GET_RECENT_SEARCH,
  GET_RECENT_SEARCH_SUCCESS,
  ADD_RECENT_NFT,
  DELETE_RECENT_SEARCH_NFT,
  GET_ALL_MARKETPLACE_SEARCH,
  GET_ALL_MARKETPLACE_SEARCH_SUCCESS
} from "./constants";

export const getAllSimilarProducts = (data) => {
  return {
    type: GET_ALL_SIMILAR_PRODUCTS,
    payload: data
  };
};

export const getNotifications = () => {
  return {
    type: GET_NOTIFICATION
  };
};

export const getNotificationsFirstTime = () => {
  return {
    type: GET_NOTIFICATION_FIRST_TIME
  };
};

export const getNotificationsSuccess = (data) => {
  return {
    type: GET_NOTIFICATION_SUCCESS,
    payload: data
  };
};

export const getSeparateNotification = (data) => {
  return {
    type: GET_SEPARATE_NOTIFICATION,
    payload: data
  };
};

export const clearNotifications = () => {
  return {
    type: CLEAR_NOTIFICATIONS_DATA
  };
};

export const getSeparateNotificaitonSuccess = (data) => {
  return {
    type: GET_SEPARATE_NOTIFICATION_SUCCESS,
    payload: data
  };
};

export const getNotificationAllCount = (data) => {
  return {
    type: GET_ALL_NOTIFICATION_COUNT,
    payload: data
  };
};

export const getSeparateNotificaitonHighSuccess = (data) => {
  return {
    type: GET_SEPARATE_NOTIFICATION_HIGH_SUCCESS,
    payload: data
  };
};

export const getSeparateNotificationLowSuccess = (data) => {
  return {
    type: GET_SEPARATE_NOTIFICATION_LOW_SUCCESS,
    payload: data
  };
};

export const getSeperateNotificationMediumSuccess = (data) => {
  return {
    type: GET_SEPARATE_NOTIFICATION_MEDIUM_SUCCESS,
    payload: data
  };
};
export const getAllSimilarProductsSuccess = (data) => {
  return {
    type: GET_ALL_SIMILAR_PRODUCTS_SUCCESS,
    payload: data
  };
};
export const getSearch = (data) => {
  return {
    type: GET_SEARCH,
    payload: data
  };
};
export const getRecentSearch = (data) => {
  return {
    type: GET_RECENT_SEARCH,
    payload: data
  };
};

export const getRecentSearchSuccess = (data) => {
  return {
    type: GET_RECENT_SEARCH_SUCCESS,
    payload: data
  };
};
export const getSearchSuccess = (data) => {
  return {
    type: GET_SEARCH_SUCCESS,
    payload: data
  };
};
export const getTrack = (data) => {
  return {
    type: TRACKING_TOOL,
    payload: data
  };
};

export const getTrackSuccess = (data) => {
  return {
    type: TRACKING_TOOL_SUCCESS,
    payload: data
  };
};

export const getAllMarketplaceCategories = (data) => {
  return {
    type: GET_ALL_MARKETPLACE_CATEGORIES,
    payload: data
  };
};

export const getAllMarketPlaceSeacrh = (data) => {
  return {
    type: GET_ALL_MARKETPLACE_SEARCH,
    payload: data
  };
};
export const getAllMarketPlaceSeacrchSuccess = (data) => {
  return {
    type: GET_ALL_MARKETPLACE_SEARCH_SUCCESS,
    payload: data
  };
};
export const updateAllMarketplaceCategories = (data) => {
  return {
    type: UPDATE_ALL_MARKETPLACE_CATEGORIES,
    payload: data
  };
};

export const getAllMarketplaceCategoriesSuccess = (data) => {
  return {
    type: GET_ALL_MARKETPLACE_CATEGORIES_SUCCESS,
    payload: data
  };
};

export const getAllMarketplaceNftsByCategory = (data) => {
  return {
    type: GET_ALL_MARKETPLACE_NFTS_BY_CATEGORY,
    payload: data
  };
};

export const getAllMarketplaceNftsByCategorySuccess = (data) => {
  return {
    type: GET_ALL_MARKETPLACE_NFTS_BY_CATEGORY_SUCCESS,
    payload: data
  };
};

export const deleteNotification = (data) => {
  return {
    type: DELETE_NOTIFICATION,
    payload: data
  };
};

export const notificationCountIcon = (data) => {
  return {
    type: NOTIFICATION_COUNT,
    payload: data
  };
};
export const deleteSeparateNotification = (data) => {
  return {
    type: CLEAR_SEPARATE_NOTIFICATION,
    payload: data
  };
};
export const notificationChangeStatus = (data) => {
  return {
    type: CHANGE_NOTIFICATION_STATUS,
    payload: data
  };
};

export const notificationAllRead = () => {
  return {
    type: CHANGE_NOTIFICATION_ALL_STATUS
  };
};

export const addToCart = (data) => {
  return {
    type: ADD_TO_CART,
    payload: data
  };
};

export const getAllCartItems = (data) => {
  return {
    type: GET_ALL_CART_ITEMS,
    payload: data
  };
};

export const getAllCartItemsSuccess = (data) => {
  return {
    type: GET_ALL_CART_ITEMS_SUCCESS,
    payload: data
  };
};
export const deleteCartItem = (data) => {
  return {
    type: DELETE_CART_ITEM,
    payload: data
  };
};

export const getAllWishlistItems = (data) => {
  return {
    type: GET_ALL_WISHLIST_ITEMS,
    payload: data
  };
};

export const getAllWishlistItemsSuccess = (data) => {
  return {
    type: GET_ALL_WISHLIST_ITEMS_SUCCESS,
    payload: data
  };
};
export const deleteWishlistItem = (data) => {
  return {
    type: DELETE_WISHLIST_ITEM,
    payload: data
  };
};

export const moveToCart = (data) => {
  return {
    type: MOVE_TO_CART,
    payload: data
  };
};

export const moveToWishlist = (data) => {
  return {
    type: MOVE_TO_WISHLIST,
    payload: data
  };
};

export const addToWishList = (data) => {
  return {
    type: ADD_TO_WISHLIST,
    payload: data
  };
};

export const updateCartItem = (data) => {
  return {
    type: UPDATE_CART_ITEM,
    payload: data
  };
};

export const recentSearchNft = (data) => {
  return {
    type: ADD_RECENT_NFT,
    payload: data
  };
};
export const deleteRecentSearchNft = (data) => {
  return {
    type: DELETE_RECENT_SEARCH_NFT,
    payload: data
  };
};
