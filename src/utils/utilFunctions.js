import { toast } from "react-toastify";
import { getRecentSearchSuccess } from "redux/marketplace/actions";
import { CHAIN_IDS, RPC_URLS, NETWORKS_INFO } from "./constants";
import { ethers } from "ethers";
import contractABI from "../contractAbi/NFT.json";
import { SNACKBAR_OPEN } from "store/actions";
export const euMemberCountries = [
  "AT", // Austria
  "BE", // Belgium
  "BG", // Bulgaria
  "HR", // Croatia
  "CY", // Cyprus
  "CZ", // Czech Republic
  "DK", // Denmark
  "EE", // Estonia
  "FI", // Finland
  "FR", // France
  "DE", // Germany
  "GR", // Greece
  "HU", // Hungary
  "IE", // Ireland
  "IT", // Italy
  "LV", // Latvia
  "LT", // Lithuania
  "LU", // Luxembourg
  "MT", // Malta
  "NL", // Netherlands
  "PL", // Poland
  "PT", // Portugal
  "RO", // Romania
  "SK", // Slovakia
  "SI", // Slovenia
  "ES", // Spain
  "SE", // Sweden
  "GB" // United Kingdom
];

export const copyToClipboard = (textToCopy) => {
  if (textToCopy) {
    // Create a temporary textarea element
    const textarea = document.createElement("textarea");
    // Set the text content to the text you want to copy
    textarea.value = textToCopy;
    // Set the style to make it off-screen
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    // Append the textarea to the document
    document.body.appendChild(textarea);
    // Select the text in the textarea
    textarea.select();
    // Execute the copy command
    document.execCommand("copy");
    toast.success("Copied");
    // Remove the textarea from the DOM
    document.body.removeChild(textarea);
  }
};

export const countries = [
  { fullName: "Austria", shortName: "AT" },
  { fullName: "Belgium", shortName: "BE" },
  { fullName: "Bulgaria", shortName: "BG" },
  { fullName: "Croatia", shortName: "HR" },
  { fullName: "Cyprus", shortName: "CY" },
  { fullName: "Czech Republic", shortName: "CZ" },
  { fullName: "Denmark", shortName: "DK" },
  { fullName: "Estonia", shortName: "EE" },
  { fullName: "Finland", shortName: "FI" },
  { fullName: "France", shortName: "FR" },
  { fullName: "Germany", shortName: "DE" },
  { fullName: "Greece", shortName: "GR" },
  { fullName: "Hungary", shortName: "HU" },
  // { fullName: "India", shortName: "IN" },
  { fullName: "Ireland", shortName: "IE" },
  { fullName: "Italy", shortName: "IT" },
  { fullName: "Latvia", shortName: "LV" },
  { fullName: "Lithuania", shortName: "LT" },
  { fullName: "Luxembourg", shortName: "LU" },
  { fullName: "Malta", shortName: "MT" },
  { fullName: "Netherlands", shortName: "NL" },
  // { fullName: "Pakistan", shortName: "PK" },
  { fullName: "Poland", shortName: "PL" },
  { fullName: "Portugal", shortName: "PT" },
  { fullName: "Romania", shortName: "RO" },
  { fullName: "Slovakia", shortName: "SK" },
  { fullName: "Slovenia", shortName: "SI" },
  { fullName: "Spain", shortName: "ES" },
  { fullName: "Sweden", shortName: "SE" },
  { fullName: "United Kingdom", shortName: "GB" }
];

export const EU_countries = [
  { name: "Austria", code: "AT" },
  { name: "Belgium", code: "BE" },
  { name: "Bulgaria", code: "BG" },
  { name: "Croatia", code: "HR" },
  { name: "Cyprus", code: "CY" },
  { name: "Czech Republic", code: "CZ" },
  { name: "Denmark", code: "DK" },
  { name: "Estonia", code: "EE" },
  { name: "Finland", code: "FI" },
  { name: "France", code: "FR" },
  { name: "Germany", code: "DE" },
  { name: "Greece", code: "GR" },
  { name: "Hungary", code: "HU" },
  { name: "Ireland", code: "IE" },
  { name: "Italy", code: "IT" },
  { name: "Latvia", code: "LV" },
  { name: "Lithuania", code: "LT" },
  { name: "Luxembourg", code: "LU" },
  { name: "Malta", code: "MT" },
  { name: "Netherlands", code: "NL" },
  { name: "Poland", code: "PL" },
  { name: "Portugal", code: "PT" },
  { name: "Romania", code: "RO" },
  { name: "Slovakia", code: "SK" },
  { name: "Slovenia", code: "SI" },
  { name: "Spain", code: "ES" },
  { name: "Sweden", code: "SE" },
  { name: "United Kingdom", code: "GB" }
];

export const formatEthereumAddress = (address) => {
  if (address) {
    const shortenedAddress = `${address.slice(0, 7)}...${address.slice(-4)}`;
    return `${shortenedAddress}`;
  }
};
// localStorage countries option
export const getLocalStorageData = (key) => {
  const selectedValue = localStorage.getItem(key);
  return selectedValue;
};

export const removeRecentDataById = (id, dispatch, setLoading) => {
  let recentStoredData = JSON.parse(localStorage.getItem("recentSearchArray")) || [];

  const index = recentStoredData.findIndex((item) => item.id === id);

  if (index !== -1) {
    recentStoredData.splice(index, 1);
    localStorage.setItem("recentSearchArray", JSON.stringify(recentStoredData));
  }
  dispatch(getRecentSearchSuccess(recentStoredData));
  setLoading(false);
};

export const removeAllRecentData = (dispatch, setLoading) => {
  let recentStoredData = [];
  localStorage.setItem("recentSearchArray", JSON.stringify(recentStoredData));
  dispatch(getRecentSearchSuccess(recentStoredData));
  setLoading(false);
};

// add currencies===================>

export const fetchCurrencySymbol = async (contractAddress, chainId) => {
  try {
    let url = "";
    if (chainId === CHAIN_IDS.POLYGON_CHAIN_ID) {
      url = RPC_URLS.POLYGON_RPC_URL;
    } else if (chainId === CHAIN_IDS.ETHEREUM_CHAIN_ID) {
      url = RPC_URLS.ETHEREUM_RPC_URL;
    } else {
      return { success: false, message: "Chain Id does not supported" };
    }
    const provider = new ethers.providers.JsonRpcProvider(url);
    const contract = new ethers.Contract(contractAddress, contractABI.abi, provider);
    let symbol = await contract.symbol();
    return { symbol, success: true, message: "Success " };
  } catch (error) {
    return { success: false, message: "Error in getting currency symbol! " };
  }
};

export const getNetworkName = async (chainId) => {
  try {
    let url = "";
    if (chainId === CHAIN_IDS.POLYGON_CHAIN_ID) {
      url = RPC_URLS.POLYGON_RPC_URL;
    } else if (chainId === CHAIN_IDS.ETHEREUM_CHAIN_ID) {
      url = RPC_URLS.ETHEREUM_RPC_URL;
    } else {
      return "Chain Id does not supported";
    }
    const provider = new ethers.providers.JsonRpcProvider(url);
    const network = await provider.getNetwork();
    return { success: true, message: "Success", chainId: network?.chainId };
  } catch (error) {
    console.error("Error:", error.message);
    return error;
  }
};

export const isContractAddress = async (address, chainId) => {
  try {
    let url = "";
    if (chainId === CHAIN_IDS.POLYGON_CHAIN_ID) {
      url = RPC_URLS.POLYGON_RPC_URL;
    } else if (chainId === CHAIN_IDS.ETHEREUM_CHAIN_ID) {
      url = RPC_URLS.ETHEREUM_RPC_URL;
    } else {
      return { success: false, message: "Chain Id does not supported" };
    }
    const provider = new ethers.providers.JsonRpcProvider(url);
    const code = await provider.getCode(address);
    if (code && code !== "0x") {
      return { success: true, message: "Success" };
    } else {
      return { success: false, message: "Invalid contract address" };
    }
  } catch (error) {
    return { success: false, message: "Invalid contract address" };
  }
};

export const roundValue = (x, digits) => {
  return Number.parseFloat(x).toFixed(digits);
};

export const getFinalValues = (totalNftPrice, quantity, userPrice) => {
  const perNftPrice = totalNftPrice / quantity;
  const subadminPrice = perNftPrice - userPrice;

  const fullRefundArrayUser = Array(quantity).fill(perNftPrice);
  const fullRefundArrayAdmin = Array(quantity).fill(0);

  const userPriceArray = Array(quantity).fill(userPrice / quantity);
  const adminPriceArray = Array(quantity).fill(subadminPrice / quantity);

  const total = userPriceArray.concat(adminPriceArray).reduce((a, b) => a + b, 0);

  if (totalNftPrice - total !== 0) {
    console.log(`The price is not right a difference of ${totalNftPrice - total} will be adjusted`);
  }

  adminPriceArray[adminPriceArray.length - 1] = adminPriceArray[adminPriceArray.length - 1] + (totalNftPrice - total);

  // const fullRefundArrayUser = Array(quantity).fill(perNftPrice)
  // const fullRefundArrayAdmin = Array(quantity).fill(0)

  return { userPriceArray, adminPriceArray, fullRefundArrayUser, fullRefundArrayAdmin };
};

export const allowPhoneNumberKeys = (e) => {
  const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "+"];
  const isNumberKey = e.key >= "0" && e.key <= "9";

  if (!isNumberKey && !allowedKeys.includes(e.key)) {
    e.preventDefault();
  }
};

export const preventSpecialKeys = (e) => {
  if (e.key === "-" || e.key === "+" || e.key === "_" || e.key === "=" || e.key === "." || e.key === "e") {
    e.preventDefault();
  }
};

export const preventSpecialKeys2 = (e) => {
  // this function allows user to type "."
  if (e.key === "-" || e.key === "+" || e.key === "_" || e.key === "=" || e.key === "e") {
    e.preventDefault();
  }
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2); // Adding 1 because getMonth() returns zero-based month index
  const day = ("0" + date.getDate()).slice(-2);
  const hours = ("0" + date.getUTCHours()).slice(-2);
  const minutes = ("0" + date.getUTCMinutes()).slice(-2);
  const seconds = ("0" + date.getUTCSeconds()).slice(-2);
  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds} UTC`;
  return formattedDate;
};

export const getShippingMethod = (orderDetail) => {
  const getMethod = (parcel) => {
    if (!parcel) return "";
    if (parcel.shippingProvider === "Free Shipping") return "(Free)";
    if (parcel.shippingProvider === "Flat Rate Shipping") return "(Flat rate)";
    return `(CCS ${parcel.shippingProvider})`;
  };

  if (orderDetail?.singlePieceParcel?.length > 0) {
    return getMethod(orderDetail.singlePieceParcel[0]);
  }

  if (orderDetail?.multiPieceParcels?.length > 0) {
    const firstParcelGroup = orderDetail.multiPieceParcels[0];
    if (firstParcelGroup?.length > 0) {
      return getMethod(firstParcelGroup[0]);
    }
  }

  return "";
};

export const checkWallet = async (provider, dispatch, account, walletAddress) => {
  if (!account) {
    toast.error("Please connect your wallet");
    return null;
  } else {
    const address = account.address;
    if (address.toLowerCase() !== walletAddress.toLowerCase()) {
      dispatch({
        type: SNACKBAR_OPEN,
        open: true,
        message: "Please connect your registered Wallet Address",
        variant: "alert",
        alertSeverity: "info"
      });
      return null;
    } else {
      return address;
    }
  }

  // if (["DIRECT", "GOOGLE"].includes(loginMethod) && !connected) {
  //   try {
  //     await sdk.connect();
  //   } catch (error) {
  //     console.error(error);
  //     return null;
  //   }
  //   if (connected) {
  //     setProvider(new ethers.providers.Web3Provider(window.ethereum));
  //   }
  // } else if (
  //   ["DIRECT", "GOOGLE"].includes(loginMethod) &&
  //   window?.ethereum?.networkVersion !== CHAIN_IDS.POLYGON_CHAIN_ID
  // ) {
  //   dispatch({
  //     type: SNACKBAR_OPEN,
  //     open: true,
  //     message: `Please switch to ${NETWORKS_INFO.chainName} network from your metamask`,
  //     variant: "alert",
  //     alertSeverity: "info"
  //   });
  // } else {
  // if (provider?.provider?.isMagic || connected) {
  //   try {
  //     const signer = provider.getSigner();
  //     const address = await signer.getAddress();
  //     if (address.toLowerCase() !== walletAddress.toLowerCase()) {
  //       dispatch({
  //         type: SNACKBAR_OPEN,
  //         open: true,
  //         message: "Please connect your registered Wallet Address",
  //         variant: "alert",
  //         alertSeverity: "info"
  //       });
  //       // if(setLoader) setLoader(false);
  //       // dispatch(mintLoaderNft(false));
  //       return null;
  //     } else {
  //       return address;
  //     }
  //   } catch (error) {}
  // }
  // }
};

export const formattedDecimals = (value) => {
  return value % 1 === 0 ? parseInt(value) : value;
};
