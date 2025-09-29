import produce from "immer";
import { GET_ALL_CURRENCIES_SUCCESS, GET_ALL_CHAIN_SUCCESS } from "./constants";

const INITIAL_STATE = {
  currencyList: [],

  chainList: []
};

const Currency = produce((draft, action) => {
  switch (action.type) {
    case GET_ALL_CURRENCIES_SUCCESS:
      draft.currencyList = action.payload;

      break;
    case GET_ALL_CHAIN_SUCCESS:
      draft.chainList = action.payload;

      break;

    default:
  }
}, INITIAL_STATE);

export default Currency;
