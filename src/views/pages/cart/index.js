/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ethers, utils } from "ethers";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import checkUserKyc from "utils/checkKYC";

import { Icons } from "../../../shared/Icons/Icons";

import { styled, useTheme } from "@mui/material/styles";

import CartItem from "./components/CartItem";
import RecommendedProduct from "./components/Recommended";
import BuyDialog from "./components/BuyDialog";

import {
  getAllCartItems,
  getAllMarketplaceNftsByCategory,
  getAllSimilarProducts,
  getAllWishlistItems
} from "../../../redux/marketplace/actions";

import InfoCircle from "../../../assets/images/icons/info-circle.svg";
import BLOCKCHAIN from "../../../constants";

import { buyNftCart } from "redux/nftManagement/actions";

// import NFTAbi from "../../../contractAbi/NFT.json";
import MarketplaceAbi from "../../../contractAbi/Marketplace.json";
import MarketplaceAddress from "../../../contractAbi/Marketplace-address.js";
import Erc20 from "../../../contractAbi/Erc20.json";
import { SNACKBAR_OPEN } from "store/actions";
import { getAllAddresses } from "redux/addresses/actions";
import { calculateTotalShippingCost } from "utils/cartTotalShippingCost";
import BuyDialogConfirmation from "./components/BuyDialogConfirmation";
import { calculateShippingCost } from "./calucluteShippingCost";

const StyledCartBtn = styled(Button)(({ theme }) => ({
  fontFamily: theme?.typography.appText,
  fontSize: "16px",
  fontWeight: 700,
  lineHeight: "19px",
  letterSpacing: "0px",
  textAlign: "center",
  height: "2.875rem",
  color: "#ffffff"
}));

const StyledWishlistBtn = styled(Button)(({ theme }) => ({
  fontFamily: theme?.typography.appText,
  fontSize: "16px",
  fontWeight: 700,
  lineHeight: "19px",
  letterSpacing: "0px",
  textAlign: "center",
  height: "2.875rem",
  color: "#ffffff"
}));

const StyledCheckoutBtn = styled(Button)(({ theme }) => ({
  fontFamily: theme?.typography.appText,
  fontSize: "18px",
  fontWeight: 500,
  lineHeight: "18px",
  letterSpacing: "0em",
  textAlign: "center",
  height: "3.875rem",
  color: "#fff",
  borderRadius: "12px",
  background: "linear-gradient(138.3deg, #2F53FF -0.85%, #2FC1FF 131.63%)",
  "&:hover": { backgroundColor: "#2196f3", borderRadius: "12px" }
}));

const StyledContinueShoppingBtn = styled(Button)(({ theme }) => ({
  fontFamily: theme?.typography.appText,
  fontSize: "18px",
  fontWeight: 500,
  lineHeight: "18px",
  letterSpacing: "0em",
  textAlign: "center",
  height: "3.875rem",
  border: "2px solid #2FA3FF",
  borderRadius: "12px",
  color: `${theme.palette.mode === "dark" ? "#ffffff" : "black"}`,
  background: "rgba(0, 0, 0, 0)",
  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0)", borderRadius: "12px" }
}));

const StyledMainPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: `${theme.palette.mode === "dark" ? "#0D0F11" : "white"}`,
  padding: theme.spacing(2),
  borderRadius: "4px"
}));

const StyledSecondaryPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: `${theme.palette.mode === "dark" ? "#0D0F11" : "white"}`,
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  maxHeight: "120vh",
  borderRadius: "4px",
  overflow: "auto",
  "&::-webkit-scrollbar": {
    width: "5px"
  },
  "&::-webkit-scrollbar-track": {
    color: "#959798",
    boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
    webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)"
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#959798",
    outline: "1px solid slategrey"
  }
}));

const routes = ["/cart", "/wishlist"];

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.marketplaceReducer.cartItems);
  const wishlist = useSelector((state) => state.marketplaceReducer.wishlist);
  const recommendedNfts = useSelector((state) => state.marketplaceReducer.similarProductNfts);

  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const theme = useTheme();
  const location = useLocation();
  const activeTab = location.pathname;

  const [loading, setLoading] = useState(true);
  const [loader, setLoader] = useState(false);
  const [groupedCartItems, setGroupedCartItems] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState();
  const [ccsCartItems, setCcsCartItems] = useState([]);
  const [otherCartItems, setOtherCartItems] = useState([]);
  const [fetchShippingPriceLoading, setFetchShippingPriceLoading] = useState(false);
  const [showBuyConfirmationDialog, setShowBuyConfirmationDialog] = useState(false);

  const headers = { headers: { Authorization: `Bearer ${token}` } };

  function calculateCartTotal(cartItems) {
    let totalTax = 0;
    let totalPrice = 0;
    let totalProducts = 0;

    for (const item of cartItems) {
      if (item.Nft && item.Nft.price) {
        totalPrice += item.Nft.price;
        totalProducts++;
      }
      if (item?.taxAmount) {
        totalTax += item.taxAmount;
      }
    }
    totalPrice = parseFloat(totalPrice.toFixed(2));
    let totalShippingCost = calculateTotalShippingCost(cartItems);
    let totalPriceToPay = parseFloat(totalPrice + totalShippingCost).toFixed(2);

    return { totalTax, totalPrice, totalProducts, totalPriceToPay };
  }

  useEffect(() => {
    dispatch(getAllAddresses());
  }, []);

  useEffect(() => {
    let timeoutId;

    if (activeTab === "/cart") {
      const fetchCartItems = () => {
        if (selectedAddress?.value) {
          dispatch(getAllCartItems({ userAddressId: selectedAddress.value, setLoading, setFetchShippingPriceLoading }));
        } else {
          dispatch(getAllCartItems({ setLoading, setFetchShippingPriceLoading }));
        }
        timeoutId = setTimeout(fetchCartItems, 60000);
      };

      fetchCartItems();
    }
    if (activeTab === "/wishlist") {
      dispatch(getAllWishlistItems({ setLoading }));
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [activeTab, dispatch, selectedAddress, setLoading]);

  const [openBuyDialog, setOpenBuyDialog] = useState(false);

  const handleBuyOpen = () => {
    if (groupedCartItems.some((item) => item?.Nft?.errorMessage)) {
      toast.error("Please update your cart before checkout!");
    } else {
      setSelectedAddress();
      setOpenBuyDialog(true);
    }
  };
  const checkWallet = async () => {
    const response = await window?.ethereum?.request({ method: "eth_requestAccounts" });
    let connectWallet = await window?.ethereum._metamask.isUnlocked();

    if ((window.ethereum && connectWallet) === false) {
      dispatch({
        type: SNACKBAR_OPEN,
        open: true,
        message: "No crypto wallet found. Please connect one",
        variant: "alert",
        alertSeverity: "info"
      });
      setLoader(false);
      return;
      // toast.error('No crypto wallet found. Please install it.');
    } else if (utils?.getAddress(response[0]) !== user.walletAddress) {
      dispatch({
        type: SNACKBAR_OPEN,
        open: true,
        message: "Please connect your registered Wallet Address",
        variant: "alert",
        alertSeverity: "info"
      });
      setLoader(false);
      return;
    } else {
      console.log("checkedd wallet");

      return true;
    }
  };

  // useEffect(() => {
  //   const updatedGroupedCartItems = {};

  //   cartItems.forEach((item) => {
  //     const bulkId = item.Nft.bulkId;

  //     if (!updatedGroupedCartItems[bulkId]) {
  //       updatedGroupedCartItems[bulkId] = {
  //         ...item,
  //         Nft: { ...item.Nft },
  //       };
  //     } else {
  //       updatedGroupedCartItems[bulkId].selectedQuantity += item.selectedQuantity;

  //       updatedGroupedCartItems[bulkId].quantity = Math.max(
  //         updatedGroupedCartItems[bulkId].quantity,
  //         item.quantity
  //       );
  //       if (item.Nft.errorMessage) {
  //         updatedGroupedCartItems[bulkId].Nft.errorMessage = item.Nft.errorMessage;
  //       }
  //     }
  //   });

  //   const updatedGroupedCartItemsArray = Object.values(updatedGroupedCartItems);

  //   setGroupedCartItems(updatedGroupedCartItemsArray);
  // }, [cartItems]);

  useEffect(() => {
    // Create an object to store grouped cart items
    const updatedGroupedCartItems = {};

    // Iterate through the cartItems
    cartItems.forEach((item) => {
      const bulkId = item.Nft.bulkId;

      // If the bulkId is null or undefined, use a unique key to group such items
      const groupKey = bulkId || `uniqueKey_${item.id}`;

      // If the groupKey is not in the updatedGroupedCartItems, add it with the item
      if (!updatedGroupedCartItems[groupKey]) {
        // Clone the item and Nft objects
        updatedGroupedCartItems[groupKey] = {
          ...item,
          Nft: { ...item.Nft }
        };
      } else {
        // If the groupKey is already in the updatedGroupedCartItems, update the selectedQuantity
        updatedGroupedCartItems[groupKey].selectedQuantity += item.selectedQuantity;

        // Update the quantity with the biggest value
        updatedGroupedCartItems[groupKey].quantity = Math.max(
          updatedGroupedCartItems[groupKey].quantity,
          item.quantity
        );

        // Update the errorMessage property from the Nft object if it exists
        if (item.Nft.errorMessage) {
          updatedGroupedCartItems[groupKey].Nft.errorMessage = item.Nft.errorMessage;
        }
      }
    });
    // Convert the updatedGroupedCartItems object back to an array if needed
    const updatedGroupedCartItemsArray = Object.values(updatedGroupedCartItems);
    setGroupedCartItems(updatedGroupedCartItemsArray);

    let ccsItems = {};
    let otherItems = [];

    updatedGroupedCartItemsArray.forEach((item) => {
      const rateObjectId = item.Nft?.rateObjectId;

      if (rateObjectId) {
        if (!ccsItems[rateObjectId]) {
          ccsItems[rateObjectId] = [];
        }
        // Add the object to the group
        ccsItems[rateObjectId].push(item);
      } else {
        otherItems.push(item);
      }
    });
    setOtherCartItems([...otherItems]);
    setCcsCartItems(Object.values(ccsItems));
  }, [cartItems, dispatch]);

  const handleBuyClose = async () => {
    // setLoader(true);

    let nftList = { nft: cartItems[0].Nft };
    if (user == null) {
      navigate("/login");
    } else if (await checkWallet()) {
      const validateKyc = checkUserKyc(user?.UserKyc);
      if (!validateKyc) {
        return;
      }
      if (nftList?.nft?.mintType === "directMint") {
        try {
          setLoader(true);

          const response = await checkIsAlreadySold();
          if (!response) {
            setLoader(false);
            return;
          }
          if (response.data.isAlreadySold === false) {
            let erc20Address = BLOCKCHAIN.USDC_ERC20;
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer);
            const token = new ethers.Contract(erc20Address, Erc20.abi, signer);
            let balance = await token.balanceOf(address);
            let price = ethers.utils.parseUnits(nftList?.nft?.price.toString(), 6);
            let price2 = ethers.utils.parseUnits(calculateCartTotal(cartItems).totalPrice.toString(), 6);
            if (balance.lt(price2)) {
              toast.error("Insufficient Balance");
              setLoader(false);
              return;
            }
            let approvalAmount = await token.allowance(address, MarketplaceAddress.address);

            let approvePrice = ethers.utils.parseUnits("10000000000000", 6);
            if (approvalAmount.toString() < price.toString()) {
              await (await token.approve(MarketplaceAddress.address, approvePrice)).wait();
            }

            const nftIdArray = [];
            const nftTokenId = [];
            const tokenIdArray = [];
            const contractAddressArray = [];
            const priceArray = [];
            const nftDataArray = [];
            const vouchersArray = [];

            // Loop through the cartItems array to add NFTs to the purchase arrays
            for (const cartItem of cartItems) {
              if (cartItem.Nft?.mintType === "directMint") {
                const balance = await token.balanceOf(address);
                const tokenId = parseInt(cartItem.Nft.NFTTokens[0].id);
                const contractAddress = cartItem.Nft.contractAddress;
                const price = ethers.utils.parseUnits(cartItem.Nft.price.toString(), 6);

                let tax = cartItem.Nft?.taxAmount || 0;
                let taxAmount = ethers.utils.parseUnits(tax.toString(), 6);
                let shipmentPrice = 0;
                let shipmentCost = ethers.utils.parseUnits(shipmentPrice.toString(), 6);

                if (balance.lt(price)) {
                  toast.error("Insufficient Balance");
                  setLoader(false);
                  return;
                }
                const approvalAmount = await token.allowance(address, MarketplaceAddress.address);
                const approvePrice = ethers.utils.parseUnits("10000000000000", 6);
                if (approvalAmount.toString() < price.toString()) {
                  await (await token.approve(MarketplaceAddress.address, approvePrice)).wait();
                }
                nftIdArray.push(cartItem.Nft?.id);
                nftTokenId.push(cartItem.Nft?.NFTTokens[0].tokenId);
                tokenIdArray.push(tokenId);
                contractAddressArray.push(contractAddress);
                priceArray.push(price);

                let shipCost = 0;

                if (cartItem.Nft?.shippingCalculationMethod === "CCS") {
                  shipCost = +cartItem.Nft?.shippingCost;
                }

                if (cartItem.Nft?.shippingCalculationMethod === "FRS") {
                  if (cartItem.Nft?.bulkId) {
                    let matchingObjects = cartItems.filter((obj) => obj.Nft?.bulkId === cartItem.Nft?.bulkId);

                    if (matchingObjects?.length) {
                      if (matchingObjects[0]?.Nft?.noExternalCostForMultipleCopies) {
                        shipCost = +matchingObjects[0]?.Nft?.flatRateShippingCost / +matchingObjects?.length;
                      } else {
                        shipCost = +matchingObjects[0]?.Nft?.flatRateShippingCost;
                      }
                    }
                  } else {
                    shipCost = +cartItem.Nft?.flatRateShippingCost;
                  }
                }

                nftDataArray.push({
                  token: tokenId,
                  shippingCost: shipCost,
                  nftId: cartItem.Nft?.id,
                  tax: cartItem.Nft?.taxAmount,
                  nftBulkId: cartItem.Nft?.bulkId || null,
                  nftTokenId: cartItem.Nft?.NFTTokens[0].tokenId,
                  shippoObjectId: cartItem.Nft?.rateObjectId || null
                });

                let data = {
                  tokenId: cartItem.Nft?.NFTTokens[0].tokenId,
                  price,
                  tax: taxAmount,
                  shipment: shipmentCost,
                  uri: "",
                  tokenAddress: cartItem.Nft?.contractAddress,
                  buyer: address
                };

                vouchersArray.push(data);
              }
            }

            const voucherResponse = await axios.post(
              `${process.env.REACT_APP_API_URL}/voucher/sign`,
              { vouchers: vouchersArray },
              headers
            );

            const { from: buyerAddress, hash: transactionHash } = await marketplace.buyNFTs(
              voucherResponse?.data?.data?.vouchers
            );

            dispatch(
              buyNftCart({
                nftIdArray,
                tokenIdArray,
                nftTokenId,
                buyerAddress,
                contractAddressArray: contractAddressArray,
                buyNftResolve: buyNftResolve,
                transactionHash,
                autoRedeem: false,
                nftDataArray
              })
            );
            setOpenBuyDialog(false);
          } else {
            toast.error(response.message);
            setLoader(false);
          }
        } catch (error) {
          setLoader(false);
          toast.error(error.reason);
        }
      }
    }
  };

  const handleBuyAndRedeem = async () => {
    let nftList = { nft: cartItems[0].Nft };
    if (user == null) {
      navigate("/login");
    } else if (await checkWallet()) {
      const validateKyc = checkUserKyc(user?.UserKyc);
      if (!validateKyc) {
        return;
      }
      if (nftList?.nft?.mintType === "directMint") {
        try {
          setLoader(true);

          const response = await checkIsAlreadySold();
          if (!response) {
            setLoader(false);
            return;
          }
          if (response.data.isAlreadySold === false) {
            let erc20Address = BLOCKCHAIN.USDC_ERC20;
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer);
            const token = new ethers.Contract(erc20Address, Erc20.abi, signer);
            let balance = await token.balanceOf(address);
            let price = ethers.utils.parseUnits(nftList?.nft?.price.toString(), 6);
            let price2 = ethers.utils.parseUnits(calculateCartTotal(cartItems).totalPrice.toString(), 6);

            if (balance.lt(price2)) {
              toast.error("Insufficient Balance");
              setLoader(false);
              return;
            }
            let approvalAmount = await token.allowance(address, MarketplaceAddress.address);

            let approvePrice = ethers.utils.parseUnits("10000000000000", 6);
            if (approvalAmount.toString() < price.toString()) {
              await (await token.approve(MarketplaceAddress.address, approvePrice)).wait();
            }

            const nftIdArray = [];
            const nftTokenId = [];
            const tokenIdArray = [];
            const contractAddressArray = [];
            const priceArray = [];
            const nftDataArray = [];
            const vouchersArray = [];

            // Loop through the cartItems array to add NFTs to the purchase arrays
            for (const cartItem of cartItems) {
              if (cartItem.Nft?.mintType === "directMint") {
                const balance = await token.balanceOf(address);
                const tokenId = parseInt(cartItem.Nft.NFTTokens[0].id);
                const contractAddress = cartItem.Nft.contractAddress;
                const price = ethers.utils.parseUnits(cartItem.Nft.price.toString(), 6);

                let tax = cartItem.Nft?.taxAmount || 0;
                let taxAmount = ethers.utils.parseUnits(tax.toString(), 6);

                if (balance.lt(price)) {
                  toast.error("Insufficient Balance");
                  setLoader(false);
                  return;
                }
                const approvalAmount = await token.allowance(address, MarketplaceAddress.address);
                const approvePrice = ethers.utils.parseUnits("10000000000000", 6);
                if (approvalAmount.toString() < price.toString()) {
                  await (await token.approve(MarketplaceAddress.address, approvePrice)).wait();
                }
                nftIdArray.push(cartItem.Nft?.id);
                nftTokenId.push(cartItem.Nft?.NFTTokens[0].tokenId);
                tokenIdArray.push(tokenId);
                contractAddressArray.push(contractAddress);
                priceArray.push(price);

                let shipCost = 0;

                if (cartItem.Nft?.shippingCalculationMethod === "CCS") {
                  shipCost = +cartItem.Nft?.shippingCost;
                }

                if (cartItem.Nft?.shippingCalculationMethod === "FRS") {
                  if (cartItem.Nft?.bulkId) {
                    let matchingObjects = cartItems.filter((obj) => obj.Nft?.bulkId === cartItem.Nft?.bulkId);

                    if (matchingObjects?.length) {
                      if (matchingObjects[0]?.Nft?.noExternalCostForMultipleCopies) {
                        shipCost = +matchingObjects[0]?.Nft?.flatRateShippingCost / +matchingObjects?.length;
                      } else {
                        shipCost = +matchingObjects[0]?.Nft?.flatRateShippingCost;
                      }
                    }
                  } else {
                    shipCost = +cartItem.Nft?.flatRateShippingCost;
                  }
                }

                nftDataArray.push({
                  token: tokenId,
                  shippingCost: shipCost,
                  nftId: cartItem.Nft?.id,
                  tax: cartItem.Nft?.taxAmount,
                  nftBulkId: cartItem.Nft?.bulkId || null,
                  nftTokenId: cartItem.Nft?.NFTTokens[0].tokenId,
                  shippoObjectId: cartItem.Nft?.rateObjectId || null
                });

                let shipPrice = calculateShippingCost(cartItem, cartItems);
                let data = {
                  tokenId: cartItem.Nft?.NFTTokens[0].tokenId,
                  price,
                  tax: taxAmount,
                  shipment: ethers.utils.parseUnits(shipPrice.toString(), 6),
                  uri: cartItem.Nft?.tokenUri,
                  tokenAddress: cartItem.Nft?.contractAddress,
                  buyer: address
                };

                vouchersArray.push(data);
              }
            }

            const voucherResponse = await axios.post(
              `${process.env.REACT_APP_API_URL}/voucher/sign`,
              { vouchers: vouchersArray },
              headers
            );

            const { from: buyerAddress, hash: transactionHash } = await marketplace.buyAndRedeem(
              voucherResponse?.data?.data?.vouchers
            );

            dispatch(
              buyNftCart({
                nftIdArray,
                tokenIdArray,
                nftTokenId,
                buyerAddress,
                contractAddressArray: contractAddressArray,
                buyNftResolve: buyNftResolve,
                transactionHash,
                autoRedeem: true,
                nftDataArray
              })
            );
            setOpenBuyDialog(false);
          } else {
            toast.error(response.message);
            setLoader(false);
          }
        } catch (error) {
          setLoader(false);
          toast.error(error.reason);
        }
      }
    }
  };

  const closeDialog = () => {
    setOpenBuyDialog(false);
  };

  const buyNftResolve = () => {
    // setBought(true);
    setLoader(false);
  };
  const checkIsAlreadySold = async () => {
    const uploadUrl = `${process.env.REACT_APP_API_URL}/users/cart/check-is-already-sold`;

    let nftIdArray = [];
    for (const cartItem of cartItems) {
      if (cartItem.Nft?.mintType === "directMint") {
        nftIdArray.push(cartItem.Nft?.id);
      }
    }
    const body = {
      nftIdArray
    };
    try {
      const { data } = await axios.post(uploadUrl, body, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return data;
    } catch (error) {
      toast.error(error.response?.data?.data?.message);
      return;
    }
  };

  const getSimilarNfts = async () => {
    // let nftIdArray = []
    // let bulkIdArray = []
    // if (activeTab === "/cart") {
    //   for (const cartItem of cartItems) {
    //     nftIdArray.push(cartItem.Nft?.id);
    //     if (cartItem?.Nft?.bulkId) {
    //       bulkIdArray.push(cartItem.Nft?.bulkId);
    //     }
    //   }

    // }
    // if (activeTab === "/wishlist") {
    //   for (const cartItem of wishlist) {
    //     nftIdArray.push(cartItem.Nft?.id);
    //     if (cartItem?.Nft?.bulkId) {
    //       bulkIdArray.push(cartItem.Nft?.bulkId);
    //     }
    //   }
    // }
    dispatch(getAllSimilarProducts({ activeTab, page: 1, limit: 10 }));
  };
  useEffect(() => {
    getSimilarNfts();
    // if (cartItems && cartItems.length > 0 && activeTab === '/cart') {
    // getSimilarNfts()

    // }
    // if (wishlist && wishlist.length > 0 && activeTab === "/wishlist") {
    //   getSimilarNfts()
    // }
    dispatch(
      getAllMarketplaceNftsByCategory({
        page: 1,
        limit: 20,
        categoryIds: [],
        brandIds: []
      })
    );
  }, [cartItems, wishlist, activeTab]);

  useEffect(() => {
    if (user?.role !== "User") {
      navigate("/");
    }
  }, [user]);

  const memoizedBuyDialog = useCallback(
    <BuyDialog
      calculateCartTotal={calculateCartTotal}
      cartData={cartItems}
      groupedCartItems={groupedCartItems}
      openBuyDialog={openBuyDialog}
      handleBuyClose={handleBuyClose}
      handleBuyAndRedeem={handleBuyAndRedeem}
      loader={loader}
      closeDialog={closeDialog}
      cartLength={cartItems.length}
      selectedAddress={selectedAddress}
      setSelectedAddress={setSelectedAddress}
      ccsCartItems={ccsCartItems}
      otherCartItems={otherCartItems}
      fetchShippingPriceLoading={fetchShippingPriceLoading}
      setFetchShippingPriceLoading={setFetchShippingPriceLoading}
      setShowBuyConfirmationDialog={setShowBuyConfirmationDialog}
    />,
    [
      cartItems,
      groupedCartItems,
      openBuyDialog,
      loader,
      setShowBuyConfirmationDialog,
      selectedAddress,
      ccsCartItems,
      otherCartItems,
      fetchShippingPriceLoading
    ] // Add other dependencies as needed
  );
  return (
    <Container maxWidth="100%" sx={{ margin: "1rem 0" }}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }} justifyContent={"space-between"}>
          <Grid item xs={12} sm={12} md={12} lg={8.3}>
            <StyledMainPaper>
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "8px",
                  background: `${theme.palette.mode === "dark" ? "#16191C" : "gray"}`
                }}
              >
                <StyledCartBtn
                  variant="filled"
                  size="lg"
                  sx={{
                    background: `${activeTab === "/cart" ? "linear-gradient(138.3deg, #2F53FF -0.85%, #2FC1FF 131.63%)" : "#16191C"}`,
                    "&:hover": {
                      background: `${activeTab === "/cart" ? "linear-gradient(138.3deg, #2F53FF -0.85%, #2FC1FF 131.63%)" : "#16191C"}`
                    }
                  }}
                  aria-label="Cart"
                  fullWidth
                  component={Link}
                  to={routes[0]}
                  props={activeTab}
                >
                  Cart
                </StyledCartBtn>
                <StyledWishlistBtn
                  variant="filled"
                  size="lg"
                  sx={{
                    background: `${activeTab === "/wishlist" ? "linear-gradient(138.3deg, #2F53FF -0.85%, #2FC1FF 131.63%)" : "#16191C"}`,
                    "&:hover": {
                      background: `${activeTab === "/wishlist" ? "linear-gradient(138.3deg, #2F53FF -0.85%, #2FC1FF 131.63%)" : "#16191C"}`
                    }
                  }}
                  aria-label="Wishlist"
                  fullWidth
                  component={Link}
                  to={routes[1]}
                  activeTab
                  disabled={loader}
                >
                  Wishlist
                </StyledWishlistBtn>
              </Stack>

              <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                {activeTab === "/cart" && cartItems && cartItems.length > 0 && (
                  <>
                    <Typography
                      sx={{
                        fontFamily: theme?.typography.appText,
                        fontWeight: "500",
                        fontSize: "22px",
                        lineHeight: "22px",
                        letterSpacing: 0,
                        textAlign: "left",
                        color: `${theme.palette.mode === "dark" ? "#ffffff" : "black"}`,
                        mr: 1
                      }}
                    >
                      Shopping Cart
                    </Typography>
                    <IconButton aria-label="favorite">
                      <img
                        src={InfoCircle}
                        alt="Info Circle"
                        style={{
                          background: `${theme.palette.mode === "dark" ? "transparent" : "black"}`,
                          borderRadius: "50%"
                        }}
                      />
                    </IconButton>
                  </>
                )}
                {activeTab === "/wishlist" && wishlist && wishlist.length > 0 && (
                  <>
                    <Typography
                      sx={{
                        fontFamily: theme?.typography.appText,
                        fontWeight: "500",
                        fontSize: "22px",
                        lineHeight: "22px",
                        letterSpacing: 0,
                        textAlign: "left",
                        color: `${theme.palette.mode === "dark" ? "#ffffff" : "black"}`,
                        mr: 1
                      }}
                    >
                      Wishlist
                    </Typography>
                    <IconButton aria-label="favorite">
                      <img
                        src={InfoCircle}
                        alt="Info Circle"
                        style={{
                          background: `${theme.palette.mode === "dark" ? "transparent" : "black"}`,
                          borderRadius: "50%"
                        }}
                      />
                    </IconButton>
                  </>
                )}
              </Box>

              {/* =========================>> Cart item component <<========================= */}
              {loading ? (
                <Grid container justifyContent="center" sx={{ width: "80%", m: "15px auto " }}>
                  <Grid item>
                    <CircularProgress disableShrink size={"4rem"} />
                  </Grid>
                </Grid>
              ) : activeTab === "/cart" && cartItems && cartItems.length > 0 ? (
                groupedCartItems.map((item, index) => {
                  return (
                    <>
                      <CartItem key={index} item={item} cartLength={cartItems.length} isLoading={loader} />
                      <Divider variant="middle" />
                    </>
                  );
                })
              ) : activeTab === "/wishlist" && wishlist && wishlist.length > 0 ? (
                wishlist.map((item, index) => {
                  return (
                    <>
                      <CartItem key={index} item={item} activeTab={activeTab} isLoading={loader} />
                      <Divider variant="middle" />
                    </>
                  );
                })
              ) : (
                <>
                  {activeTab === "/cart" ? (
                    <Stack sx={{ gap: "1rem" }}>
                      <Typography
                        sx={{ paddingTop: "20px" }}
                        variant="subtitle1"
                        component="h2"
                        className="CartWishlist"
                      >
                        {Icons?.cartIcon}
                      </Typography>
                      <Typography variant="subtitle1" component="h2" className="CartWishlist">
                        Oops! Your cart is empty. Time to fill it up with awesome stuff
                      </Typography>
                      <StyledCartBtn
                        className="CartWishlist"
                        variant="filled"
                        size="small"
                        sx={{
                          background: "linear-gradient(138.3deg, #2F53FF -0.85%, #2FC1FF 131.63%)"
                        }}
                        aria-label="Cart"
                        fullWidth
                        onClick={() => navigate("/marketplace")}
                      >
                        Continue Shopping
                      </StyledCartBtn>
                    </Stack>
                  ) : (
                    <Stack sx={{ gap: "1rem" }}>
                      <Typography
                        sx={{ paddingTop: "20px" }}
                        variant="subtitle1"
                        component="h2"
                        className="CartWishlist"
                      >
                        {Icons?.WishlistIcon}
                      </Typography>
                      <Typography variant="subtitle1" component="h2" className="CartWishlist">
                        Oops! Your wishlist is empty. Time to fill it up with awesome stuff
                      </Typography>
                      <StyledCartBtn
                        className="CartWishlist"
                        variant="filled"
                        size="small"
                        sx={{
                          background: "linear-gradient(138.3deg, #2F53FF -0.85%, #2FC1FF 131.63%)"
                        }}
                        aria-label="Cart"
                        fullWidth
                        onClick={() => navigate("/marketplace")}
                      >
                        Continue Shopping
                      </StyledCartBtn>
                    </Stack>
                  )}
                </>
              )}

              {activeTab === "/cart" && cartItems && cartItems.length > 0 && (
                <Stack
                  direction="row"
                  alignItems={"center"}
                  justifyContent={"flex-end"}
                  spacing={1}
                  width={"100%"}
                  marginTop={3}
                >
                  <Typography
                    sx={{
                      fontFamily: theme?.typography.appText,
                      fontWeight: "400",
                      fontSize: "16px",
                      lineHeight: "18.8px",
                      letterSpacing: 0,
                      textAlign: "left",
                      color: `${theme.palette.mode === "dark" ? "#ffffff" : "black"}`
                    }}
                  >
                    Subtotal ({`${cartItems.length ? calculateCartTotal(cartItems).totalProducts : 0}`} items):
                  </Typography>
                  <Stack direction="row" alignItems={"center"} justifyContent={"flex-end"} spacing={0}>
                    <Typography
                      sx={{
                        fontFamily: theme?.typography.appText,
                        fontWeight: "700",
                        fontSize: "25px",
                        lineHeight: "29.38px",
                        letterSpacing: 0,
                        textAlign: "left",
                        color: `${theme.palette.mode === "dark" ? "#ffffff" : "black"}`
                      }}
                    >
                      {cartItems.length ? calculateCartTotal(cartItems).totalPrice : 0}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: theme?.typography.appText,
                        fontWeight: "700",
                        fontSize: "18px",
                        lineHeight: "21.15px",
                        letterSpacing: 0,
                        textAlign: "left",
                        background: "linear-gradient(97.63deg, #657DE0 0%, #66EAE2 108.44%, #62C4E2 108.45%)",
                        WebkitTextFillColor: "transparent",
                        WebkitBackgroundClip: "text",
                        color: "#ffffff",
                        paddingLeft: 0.5
                      }}
                    >
                      USD
                    </Typography>
                  </Stack>
                </Stack>
              )}
            </StyledMainPaper>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={3.7}>
            <Stack spacing={1}>
              {cartItems.length > 0 && activeTab === "/cart" && (
                <StyledCheckoutBtn variant="filled" aria-label="Cart" fullWidth onClick={handleBuyOpen}>
                  Proceed to checkout
                </StyledCheckoutBtn>
              )}
              <Link style={{ pointerEvents: `${loader && "none"}` }} to="/marketplace">
                <StyledContinueShoppingBtn
                  disabled={loader}
                  variant="outlined"
                  size="lg"
                  aria-label="Continue"
                  fullWidth
                >
                  Continue shopping
                </StyledContinueShoppingBtn>
              </Link>
            </Stack>

            <StyledSecondaryPaper>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "no-wrap",
                  gap: "1rem"
                }}
              >
                <Typography
                  sx={{
                    fontFamily: theme?.typography.appText,
                    fontWeight: "600",
                    fontSize: "20px",
                    lineHeight: "30px",
                    letterSpacing: 0,
                    textAlign: "left",
                    color: `${theme.palette.mode === "dark" ? "#ffffff" : "black"}`
                    // width: '75%'
                  }}
                >
                  Recommended based on your shopping trends
                </Typography>
                <Button
                  variant="outlined"
                  size="md"
                  aria-label="View all"
                  sx={{
                    color: `${theme.palette.mode === "dark" ? "#ffffff" : "black"}`,
                    border: "1px solid #7F82F3",
                    alignSelf: "center",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    textAlign: "center"
                  }}
                  onClick={() => navigate("/marketplace")}
                  disabled={loader}
                >
                  View all
                </Button>
              </Box>

              {/* =========================>> Recommended item component <<========================= */}
              {recommendedNfts.nfts && recommendedNfts.nfts.length > 0 ? (
                recommendedNfts.nfts.map((nft, index) => {
                  return (
                    <>
                      <RecommendedProduct loader={loader} nft={nft} activeTab={activeTab} />
                      <Divider variant="middle" />
                    </>
                  );
                })
              ) : (
                //  : marketplaceNfts?.nfts?.rows.length > 0 ? marketplaceNfts.nfts.rows.map((nft, index) => {
                //   return (
                //     <>
                //       <RecommendedProduct nft={nft} activeTab={activeTab} />
                //       <Divider variant="middle" />
                //     </>
                //   )
                // })
                <></>
              )}
            </StyledSecondaryPaper>
          </Grid>
        </Grid>
        {memoizedBuyDialog}
        <BuyDialogConfirmation
          cartItems={cartItems}
          handleBuy={handleBuyAndRedeem}
          open={showBuyConfirmationDialog}
          setSelectedAddress={setSelectedAddress}
          handleClose={() => setShowBuyConfirmationDialog(false)}
        />
      </Box>
    </Container>
  );
}
