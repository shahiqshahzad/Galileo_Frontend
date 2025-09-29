export const CHAIN_IDS = {
  POLYGON_CHAIN_ID: process.env.REACT_APP_MAINNET === "1" ? "137" : "80002",
  ETHEREUM_CHAIN_ID: process.env.REACT_APP_MAINNET === "1" ? "1" : "11155111"
};
export const WRONG_CHAIN_MESSAGES = {
  POLYGON:
    process.env.REACT_APP_MAINNET === "1"
      ? "Please switch to polygon network from your metamask"
      : "Please switch to testnet polygon amoy network from your metamask",
  ETHEREUM:
    process.env.REACT_APP_MAINNET === "1"
      ? "Please switch to etherium network from your metamask"
      : "Please switch to testnet etherium network from your metamask"
};
export const RPC_URLS = {
  POLYGON_RPC_URL:
    process.env.REACT_APP_MAINNET === "1"
      ? "https://polygon-mainnet.infura.io/v3/bc5edcc83ccd4cffa15588c293c9c637"
      : "https://polygon-amoy.infura.io/v3/bc5edcc83ccd4cffa15588c293c9c637",
  ETHEREUM_RPC_URL:
    process.env.REACT_APP_MAINNET === "1"
      ? "https://mainnet.infura.io/v3/bc5edcc83ccd4cffa15588c293c9c637"
      : "https://sepolia.infura.io/v3/bc5edcc83ccd4cffa15588c293c9c637"
};
export const BLOCK_EXPLORER_URL =
  process.env.REACT_APP_MAINNET === "1" ? "https://polygonscan.com/" : "https://amoy.polygonscan.com/";

export const BLOCKCHAIN_ACTIONS = {
  BUY_AND_REDEEM: "Buy and Redeem",
  RETURN_REQUEST: "Return Request",
  MINT: "Mint",
  MAKE_DECISION: "Make Decision",
  DELIVERED: "Delivered"
};

export const NETWORKS_INFO = {
  chainName: process.env.REACT_APP_MAINNET === "1" ? "Polygon Mainnet" : "Amoy Testnet",
  chainId: process.env.REACT_APP_MAINNET === "1" ? "0x89" : "0x13882",
  rpcUrls: process.env.REACT_APP_MAINNET === "1" ? "https://polygon-rpc.com/" : "https://rpc-amoy.polygon.technology/",
  blockExplorerUrl: process.env.REACT_APP_MAINNET === "1" ? "https://polygon-rpc.com/" : "https://www.oklink.com/amoy"
};

export const GOOGLE_ANALYTICS_EVENTS = {
  PURCHASE: "purchase",
  VIEW_ITEM: "view_item",
  REFUND_ITEM: "refund",
  BEGIN_CHECKOUT: "begin_checkout",
  ADDING_SHIPPING: "add_shipping_info",
  SIGNUP: "sign_up",
}

export const SIGNUP_METHODS = {
  ORGANIC: "organic",
  REFERAL: "Referal",
}