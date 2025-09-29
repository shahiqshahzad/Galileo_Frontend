import {
  ADD_ADDRESS,
  DELETE_ADDRESS,
  UPDATE_ADDRESS,
  GET_ALL_ADDRESSES,
  SET_DEFAULT_ADDRESS,
  GET_ALL_ADDRESSES_SUCCESS,
  GET_SUPPORTED_CARRIERS,
  GET_SUPPORTED_CARRIERS_SUCCESS,
  GET_ALL_CATEGORY_ADDRESSES,
  GET_ALL_CATEGORY_ADDRESSES_SUCCESS
} from "./constants";

export const getAllAddresses = (data) => {
  return {
    type: GET_ALL_ADDRESSES,
    payload: data
  };
};

export const getAllAddressesSuccess = (data) => {
  return {
    type: GET_ALL_ADDRESSES_SUCCESS,
    payload: data
  };
};

export const getSupportedCarriers = (data) => {
  return {
    type: GET_SUPPORTED_CARRIERS,
    payload: data
  };
};

export const getSupportedCarriersSuccess = (data) => {
  return {
    type: GET_SUPPORTED_CARRIERS_SUCCESS,
    payload: data
  };
};

export const addAddress = (data) => {
  return {
    type: ADD_ADDRESS,
    payload: data
  };
};

export const updateAddress = (data) => {
  return {
    type: UPDATE_ADDRESS,
    payload: data
  };
};

export const deleteAddress = (data) => {
  return {
    type: DELETE_ADDRESS,
    payload: data
  };
};

export const setDefaultAddress = (data) => {
  return {
    type: SET_DEFAULT_ADDRESS,
    payload: data
  };
};

export const getAllCategoryAddresses = (data) => {
  return {
    type: GET_ALL_CATEGORY_ADDRESSES,
    payload: data
  };
};

export const getAllCategoryAddressesSuccess = (data) => {
  return {
    type: GET_ALL_CATEGORY_ADDRESSES_SUCCESS,
    payload: data
  };
};
