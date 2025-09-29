import {
  // Brand
  GET_ALL_CURRENCIES,
  GET_ALL_CURRENCIES_SUCCESS,
  ADD_CURRENCY,
  UPDATE_CURRENCY,
  DELETE_CURRENCY,
  GET_ALL_CHAIN,
  GET_ALL_CHAIN_SUCCESS
} from "./constants";

// CURRENCY

export const getAllCurrencies = (data) => {
  return {
    type: GET_ALL_CURRENCIES,
    payload: data
  };
};

export const getAllCurrenciesSuccess = (data) => {
  return {
    type: GET_ALL_CURRENCIES_SUCCESS,
    payload: data
  };
};
export const getAllChain = (data) => {
  return {
    type: GET_ALL_CHAIN,
    payload: data
  };
};

export const getAllChainSuccess = (data) => {
  return {
    type: GET_ALL_CHAIN_SUCCESS,
    payload: data
  };
};

export const addCurrency = (data) => {
  return {
    type: ADD_CURRENCY,
    payload: data
  };
};

export const updateCurrency = (data) => {
  return {
    type: UPDATE_CURRENCY,
    payload: data
  };
};

export const deleteCurrency = (data) => {
  return {
    type: DELETE_CURRENCY,
    payload: data
  };
};
