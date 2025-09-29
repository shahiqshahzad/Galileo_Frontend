import {
  GET_ALL_PERMISSIONS,
  GET_ALL_PERMISSIONS_SUCCESS,
  MAKEPUBLIC,
  ADD_ADDRESS,
  UPDATE_ADDRESS,
  DELETE_ADDRESS
} from "./constants";

export const getAllPermissions = (data) => {
  return {
    type: GET_ALL_PERMISSIONS,
    payload: data
  };
};

export const getAllPermissionsSuccess = (data) => {
  return {
    type: GET_ALL_PERMISSIONS_SUCCESS,
    payload: data
  };
};

export const addAddress = (data) => {
  return {
    type: ADD_ADDRESS,
    payload: data
  };
};
export const makePublic = (data) => {
  return {
    type: MAKEPUBLIC,
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
