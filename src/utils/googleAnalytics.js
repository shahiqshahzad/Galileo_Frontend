import { GOOGLE_ANALYTICS_EVENTS } from "./constants";
import ReactGA from "react-ga4";

// creating purchase event
export const createGoogleAnalyticsForPurchase = (payload) => {
    let { nftId, nftQty, nftCategory, nftPrice, nftTax, nftShipping, nftCurrency, orderNumber, nftName, nftSalePrice, nftBrand } = payload;

    let nftPerUnitPrice = nftPrice;
    if (nftSalePrice) {
        nftPrice = nftSalePrice;
        nftPerUnitPrice = nftPrice;
    }
    nftTax = nftTax * nftQty;
    nftPrice = nftPrice * nftQty + nftTax + nftShipping;
    
    ReactGA.event(GOOGLE_ANALYTICS_EVENTS.PURCHASE, {
        transaction_id: orderNumber,
        value: nftPrice,
        tax: nftTax,
        shipping: nftShipping,
        currency: "USD",
        items: [
            {
                item_id: nftId,
                item_name: nftName,
                affiliation: nftBrand,
                discount: nftSalePrice,
                item_brand: nftBrand,
                item_category: nftCategory,
                price: nftPerUnitPrice,
                quantity: +nftQty
            }
        ]
    });
}
// creating view_item event
export const createGoogleAnalyticsForViewItem = (payload) => {
  const { nftId, nftQty, nftCategory, nftPrice, nftName, nftSalePrice, nftBrand } = payload;
  ReactGA.event(GOOGLE_ANALYTICS_EVENTS.VIEW_ITEM, {
    value: nftPrice,
    currency: "USD",
    items: [
      {
        item_id: nftId,
        item_name: nftName,
        affiliation: nftBrand,
        discount: nftSalePrice,
        item_brand: nftBrand,
        item_category: nftCategory,
        price: nftPrice,
        quantity: +nftQty
      }
    ]
  });
};

// creating item return event
export const createGoogleAnalyticsForRefundItem = (payload) => {
  const {
    nftId,
    nftQty,
    nftCategory,
    nftPrice,
    nftName,
    nftSalePrice,
    nftBrand,
    totalPrice,
    totalTax,
    totalShippingCost,
    orderNumber
  } = payload;
  ReactGA.event(GOOGLE_ANALYTICS_EVENTS.REFUND_ITEM, {
    currency: "USD",
    transaction_id: orderNumber,
    value: totalPrice,
    shipping: totalShippingCost,
    tax: totalTax,
    items: [
      {
        item_id: nftId,
        item_name: nftName,
        affiliation: nftBrand,
        discount: nftSalePrice,
        item_brand: nftBrand,
        item_category: nftCategory,
        price: nftPrice,
        quantity: +nftQty
      }
    ]
  });
};

// creating item begin checkout event
export const createGoogleAnalyticsForBeginCheckout = (payload) => {
  const {
    nftId,
    nftQty,
    nftCategory,
    nftPrice,
    nftName,
    nftSalePrice,
    nftBrand,
    totalPrice,
    totalTax,
    totalShippingCost
  } = payload;
  ReactGA.event(GOOGLE_ANALYTICS_EVENTS.BEGIN_CHECKOUT, {
    currency: "USD",
    value: totalPrice + totalTax + totalShippingCost,
    items: [
      {
        item_id: nftId,
        item_name: nftName,
        affiliation: nftBrand,
        discount: nftSalePrice,
        item_brand: nftBrand,
        item_category: nftCategory,
        price: nftPrice,
        quantity: +nftQty
      }
    ]
  });
};

// creating adding shipping info event
export const createGoogleAnalyticsForAddingShipping = (payload) => {
    const { nftId, nftQty, nftCategory, nftPrice, nftCurrency, nftName, nftSalePrice, nftBrand, totalPrice, totalTax, totalShippingCost } = payload;
    ReactGA.event(GOOGLE_ANALYTICS_EVENTS.ADDING_SHIPPING, {
        currency: "USD",
        value: totalPrice + totalShippingCost + totalTax,
        items: [
            {
                item_id: nftId,
                item_name: nftName,
                affiliation: nftBrand,
                discount: nftSalePrice,
                item_brand: nftBrand,
                item_category: nftCategory,
                price: nftPrice,
                quantity: +nftQty
            }
        ]
    });
}

// creating adding signup info event
export const createGoogleAnalyticsForSignup = (payload) => {
  const { signupMethod } = payload;
  ReactGA.event(GOOGLE_ANALYTICS_EVENTS.SIGNUP, {
      method: signupMethod
  });
}