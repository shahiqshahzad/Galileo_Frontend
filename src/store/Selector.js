import { createSelector } from "reselect";

const selectLoginDomain = (state) => state["auth"];

export const makeSelectAuthToken = () => createSelector(selectLoginDomain, (globalState) => globalState.token);

export const makeSelectAuthId = () => createSelector(selectLoginDomain, (globalState) => globalState.user.id);

export const makeSelectAuthRole = () => createSelector(selectLoginDomain, (globalState) => globalState.user.role);
