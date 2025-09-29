/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
// material-ui
import { styled, useTheme } from "@mui/material/styles";
import VerifiedIcon from "@mui/icons-material/Verified";
import axios from "utils/axios";
import { useParams } from "react-router-dom";
import { getnftData } from "redux/landingPage/actions";
import checkUserKyc from "utils/checkKYC";
import {
  Grid,
  Typography,
  Button,
  Alert,
  InputLabel,
  Select,
  FormControl,
  Box,
  MenuItem,
  Stack,
  ButtonGroup,
  Card,
  CardContent,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";

import React, { useEffect, useState } from "react";
import Avatar from "ui-component/extended/Avatar";
import { Icons } from "shared/Icons/Icons";

import { gridSpacing } from "store/constant";
import Modal from "@mui/material/Modal";

import { ethers, utils } from "ethers";
import NFTAbi from "../../../../../contractAbi/NFT.json";
import MarketplaceAbi from "../../../../../contractAbi/Marketplace.json";
import MarketplaceAddress from "../../../../../contractAbi/Marketplace-address.js";
import Erc20 from "../../../../../contractAbi/Erc20.json";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ReactGA from "react-ga4";
import ReactImageMagnify from "react-image-magnify";
import { buyNft, resellNft, redeemNft, getNftBuyer, mintLoaderNft, bulkBuyNft } from "redux/nftManagement/actions";
import CircularProgress from "@mui/material/CircularProgress";
import { SNACKBAR_OPEN } from "store/actions";
import FactoryAbi from "contractAbi/Factory.json";
import { addToCart, deleteWishlistItem, addToWishList } from "redux/marketplace/actions";
import FactoryAddress from "contractAbi/Factory-address.js";
import { ProofsDropdown } from "./ProofsDropdown";
import CarouselCard from "./carousal";
import VComponent from "../../../trackingTool/component/video";
import FullImage from "./fullImage";
import AddPrimaryImage from "./AddPrimaryImage";
import moment from "moment";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { Uploading3d } from "./Uploading3d";
import { Preview3dContainer } from "./Preview3dContainer";
import QuantityComponent from "./quantityComponent";
import usdt from "assets/images/USDT.jpg";
import InfoIcon from "@mui/icons-material/Info";

import { useSearchParams } from "react-router-dom";
import PermissionedDialog from "./permissioned";
import DropdownButton from "views/pages/cart/components/DropdownButton";
import likeIcon from "assets/images/image-action-icons/liked.svg";
import unLikeIcon from "assets/images/image-action-icons/unLike.svg";
import expandPicIcon from "assets/images/image-action-icons/expand-pic.svg";
import videoIcon from "assets/images/image-action-icons/video.svg";
import pictureIcon from "assets/images/image-action-icons/picture.svg";
import videoSelectedIcon from "assets/images/image-action-icons/video-selected.svg";
import imageSelectedIcon from "assets/images/image-action-icons/image-selected.svg";
import galileoLogo from "assets/images/galileo_logo.png";
import ResellDialog from "./resellDialog";
import ConfirmOrderDlg from "./BuyRedeemDlg/ConfirmOrderDlg";
import { BLOCKCHAIN_ACTIONS, CHAIN_IDS, RPC_URLS, NETWORKS_INFO } from "utils/constants";
import { loggerApi } from "utils/loggerApi";
import GalileoProtocol from "../../../../../contractAbi/NFT.json";
import { ParseHtmlToText } from "./parseHtmlToText/parseHtmlToText";
import { useWeb3 } from "utils/MagicProvider";
import { useSDK } from "@metamask/sdk-react";
import { checkWallet, formattedDecimals } from "utils/utilFunctions";
import { maxHeight, useMediaQuery } from "@mui/system";
import { useActiveAccount } from "thirdweb/react";
import EscrowAddress from "../../../../../contractAbi/GalileoEscrow.js";
// =============================|| LANDING - FEATURE PAGE ||============================= //
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const PropertiesView = ({ nftList }) => {
  const dispatch = useDispatch();
  const account = useActiveAccount();
  const { provider, signer } = useWeb3();
  let GeneralSettingAddress = nftList !== undefined && nftList?.nft?.currencyAddress;
  const checkLoader = useSelector((state) => state.nftReducer.mintNftLoader);
  const restrictApplication = useSelector((state) => state.auth.restrictApplication);
  const existsInCart = useSelector((state) => state.landingPageReducer?.nft?.existsInCart?.alreadyExists);
  const existsInWishlist = useSelector((state) => state.landingPageReducer?.nft?.existsInWishlist?.alreadyExists);

  const { nftTax } = useSelector((state) => state.landingPageReducer);

  const [buyRedeemAction, setBuyRedeemAction] = useState("Redeem");
  const [editAccess, seteditAccess] = useState(false);
  const [resell, setResell] = useState(false);
  const [bought, setBought] = useState(false);
  const [redeem, setRedeem] = useState(false);
  const [loader, setLoader] = useState(false);
  const [redeemLoader, setRedeemLoader] = useState(false);
  const [resellLoader, setResellLoader] = useState(false);
  const [lazyTokenId] = useState("");
  const [hasToShowModel, setHasToShowModel] = useState(false);
  const [hasToShowPreview, setHasToShowPreview] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [billingAddress, setBillingAddress] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(null);

  const [contractAddresses, setContractAddresses] = useState([]);
  const [handleToggle, setHandleToggle] = useState(false);

  const buyerNft = useSelector((state) => state.nftReducer.nftBuyer);
  const [toggleImage, setToggleImage] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [viewFullIamge, setViewFullImage] = useState(0);
  const [isShown, setIsShown] = useState(false);
  const [slidershow, setSlidershow] = useState(true);
  const [videoshow, setVideo] = useState(false);
  const [like, setLike] = useState(false);
  const [openBuyRedeemDlg, setOpenBuyRedeemDlg] = useState(false);
  const [approvalModal, SetApprovalModal] = useState(false);
  const [approvalLoader, SetApprovalLoader] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { id: productId } = useParams();

  const [searchParams] = useSearchParams();
  const isBuyTrue = searchParams.get("buy");

  //  let searchParams = nftList?.nft?.id;

  const [age, setAge] = useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };
  const theme = useTheme();
  useEffect(() => {
    if (existsInWishlist) {
      setLike(true);
    }
  }, [existsInWishlist]);

  const [open, setOpen] = React.useState(false);
  const [rprice, setRprice] = React.useState(0);

  const buyNftResolve = () => {
    setBought(true);
    setLoader(false);
  };

  const redeemNftResolve = () => {
    setRedeem(true);
    setRedeemLoader(false);
  };

  const resellNftResolve = () => {
    setResell(true);
    setResellLoader(false);
    setOpen(false);
  };
  const [token, setToken] = useState();
  const [addres, setAddres] = useState();
  const userToken = useSelector((state) => state.auth.token);
  const headers = { headers: { Authorization: `Bearer ${userToken}` } };

  const loginMethod = useSelector((state) => state.auth?.user?.signupMethod);
  const userAddresses = useSelector((state) => state.addresses.addressesList);

  useEffect(() => {
    if (userAddresses?.length) {
      const kycAddressObject = userAddresses.find((obj) => obj.isKycAddress);
      setBillingAddress(kycAddressObject);
    }
  }, [userAddresses]);

  const searchSerial = async (serialId) => {
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const signer = provider.getSigner();
    const factoryAddr = new ethers.Contract(FactoryAddress.address, FactoryAbi.abi, signer);
    let res = await factoryAddr.serials(serialId);
    let address = res[0].toLowerCase();
    setAddres(address);
    let tokenId = parseInt(res[1]._hex);
    tokenId = tokenId.toString();
    setToken(tokenId);

    navigate("/tracking/" + serialId, {
      state: {
        tokenId: tokenId,
        address: address
      }
    });
  };
  const [magnifyImage, setMagnifyImage] = useState();
  const stopMintNftLoader = () => {
    dispatch(mintLoaderNft(false));
  };

  const ApprovalHandler = async () => {
    SetApprovalLoader(true);

    let tax = Number((nftTax || 0) * quantity);
    let price = nftList?.nft?.price * quantity;
    let shippingPrice = nftList?.nft?.shippingCost || 0;
    const totalPrice = (price + tax + shippingPrice).toString();

    try {
      let approvePrice = ethers.utils.parseUnits("100000", 6);
      if (totalPrice > 100000) {
        approvePrice = ethers.utils.parseUnits(totalPrice, 6);
      }
      let erc20Address = GeneralSettingAddress;
      // const signer = provider.getSigner();
      const token = new ethers.Contract(erc20Address, Erc20.abi, signer);
      const address = await signer.getAddress();
      let approvalAmount = await token.allowance(address, EscrowAddress.address);
      await (await token.approve(EscrowAddress.address, 0)).wait();
      await (await token.approve(EscrowAddress.address, approvePrice)).wait();
      SetApprovalLoader(false);
      SetApprovalModal(false);
      let isAutoRedeem = true;
      if (nftList?.nft?.bulkId !== undefined && nftList?.nft?.bulkId) {
        handleBuyBulkNft(isAutoRedeem);
      } else {
        handleSingleNft(isAutoRedeem);
      }
    } catch (error) {
      setLoader(false);
      toast.error(error?.reason || error?.response?.data?.data?.message || "Error");
      SetApprovalLoader(false);
      SetApprovalModal(false);
      dispatch(mintLoaderNft(false));
    }
  };

  const handleBuyBulkNft = async (isAutoRedeem) => {
    dispatch(mintLoaderNft(true));
    setTotalQuantity(quantity);
    const contractAddress = nftList?.nft?.contractAddress;
    let nftPrice = nftList?.nft?.price.toString();
    const addresses = Array(quantity).fill(contractAddress);
    const Prices = Array(quantity).fill(nftPrice);

    setContractAddresses(addresses);
    const Addressed = addresses.map((adress) => adress);

    try {
      let nfttokens = nftList?.nft?.bulkId !== undefined && nftList?.nft?.bulkId;
      let nftId = nftList?.nft?.id;

      const url = `/nft/availableNftTokens/${nfttokens}/${nftId}?quantity=${quantity}`;
      const response = await axios.get(url);

      let tokenID = response.data?.data?.nfts?.map((token) => parseInt(token?.tokenId, 10));
      let nftIDs = response.data?.data?.nfts?.map((token) => parseInt(token?.id, 10));
      let serialIds = response.data?.data?.nfts?.map((token) => token.serialId);

      const availableNFTUrl = `/nft/checkNFTavailability/${nftList?.nft?.id}`;
      const availableNFTUrlResponse = await axios.get(availableNFTUrl);

      let availableNftId = availableNFTUrlResponse?.data?.data?.availableNftId;

      if (availableNftId && !isBuyTrue) {
        dispatch(getnftData({ id: availableNftId }));

        const currentPath = window.location.pathname;
        const newPath = currentPath.replace(
          `/productDetails/${nftList?.nft?.id}`,
          `/productDetails/${availableNftId}?buy=true`
        );
        window.history.replaceState({}, "", newPath); // Update the URL without a full page reload
        window.location.reload(); // Reload the page
      } else {
        if (user == null) {
          navigate("/login");
          dispatch(mintLoaderNft(false));
        } else {
          const validateKyc = checkUserKyc(user?.UserKyc);
          if (!validateKyc) {
            dispatch(mintLoaderNft(false));
            return;
          }
          if (nftList?.nft?.mintType === "directMint" && !isAutoRedeem) {
            try {
              setLoader(true);
              // let erc20Address = BLOCKCHAIN.USDT_ERC20;
              let erc20Address = GeneralSettingAddress;
              let contractAddressArray = Addressed;
              let price = ethers.utils.parseUnits(nftList?.nft?.price.toString(), 6);
              let tax = nftTax || 0;
              let taxAmount = ethers.utils.parseUnits(tax.toString(), 6);
              let shipPrice = 0;
              let shipmentPrice = ethers.utils.parseUnits(shipPrice.toString(), 6);

              const provider = new ethers.providers.Web3Provider(window.ethereum);
              // const signer = provider.getSigner();
              const address = await signer.getAddress();

              const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer);

              const token = new ethers.Contract(erc20Address, Erc20.abi, signer);

              let balance = await token.balanceOf(address);
              if (balance.lt(price)) {
                toast.error("Insufficient Balance");
                setLoader(false);
                dispatch(mintLoaderNft(false));
                return;
              }
              let approvalAmount = await token.allowance(address, MarketplaceAddress.address);
              await (await token.approve(MarketplaceAddress.address, 0)).wait();

              let approvePrice = ethers.utils.parseUnits("100000", 6);
              if (approvalAmount.toString() < price.toString()) {
                await (await token.approve(MarketplaceAddress.address, approvePrice)).wait();
              }

              const priceArray = [];
              for (let i = 1; i <= quantity; i++) {
                priceArray.push(price.toString());
              }
              const taxArray = [];
              for (let i = 1; i <= quantity; i++) {
                taxArray.push(taxAmount.toString());
              }
              const vouchersArray = [];
              for (let i = 0; i < response.data?.data?.nfts?.length; i++) {
                vouchersArray.push({
                  tokenId: parseInt(response.data?.data?.nfts[i]?.tokenId),
                  price: price,
                  tax: taxAmount,
                  shipment: shipmentPrice,
                  uri: "",
                  collectionAddress: nftList?.nft?.contractAddress,
                  buyer: address
                });
              }

              const voucherResponse = await axios.post(`/voucher/sign`, { vouchers: vouchersArray }, headers);

              const { from: buyerAddress, hash: transactionHash } = await marketplace.buyNFTs(
                voucherResponse?.data?.data?.vouchers
              );

              const dispatchRequest = {
                nftId: nftIDs,
                nftToken: tokenID,
                buyerAddress,
                contractAddress: contractAddress,
                buyNftResolve: buyNftResolve,
                transactionHash,
                autoRedeem: false,
                tax: tax,
                shippingCost: 0,
                shippoObjectId: nftList?.nft?.rateObjectId,
                billingAddress: shippingAddress?.value,
                shippingAddress: shippingAddress?.value
              };
              dispatch(buyNft(dispatchRequest));
            } catch (error) {
              setLoader(false);
              toast.error(error?.reason || error?.response?.data?.data?.message);
              dispatch(mintLoaderNft(false));
            }
          } else if (nftList?.nft?.mintType === "lazyMint") {
            try {
              setLoader(true);
              let erc20Address = GeneralSettingAddress;
              let contractAddress = nftList?.nft?.contractAddress;

              const provider = new ethers.providers.Web3Provider(window.ethereum);
              // const signer = provider.getSigner();
              const address = await signer.getAddress();

              const nfts = new ethers.Contract(contractAddress, NFTAbi.abi, signer);
              let nftPrice = nftList?.nft?.price.toString();
              let profitPercentage = nftList?.nft?.profitPercentage;

              let prices = ethers.utils.parseUnits(nftPrice, 6);

              let voucher = {
                uri: nftList?.nft?.tokenUri,
                price: prices.toString(),
                token: erc20Address,
                time: nftList?.nft?.lazyVoucherTimeStamp,
                signature: nftList?.nft?.NFTTokens[0].signature
              };
              const token = new ethers.Contract(erc20Address, Erc20.abi, signer);

              let balance = await token.balanceOf(address);
              if (balance.lt(prices)) {
                toast.error("Insufficient Balance");
                dispatch(mintLoaderNft(false));
              }
              let approvalAmount = await token.allowance(address, contractAddress);

              let approvePrice = ethers.utils.parseUnits("100000", 6);
              if (approvalAmount.toString() < voucher.price) {
                await (await token.approve(contractAddress, approvePrice)).wait();
              }

              try {
                const voucherArray = [];
                const minterAddresses = [];
                voucherArray.push(voucher);
                minterAddresses.push(nftList?.nft?.minterAddress);

                // dispatch(
                //   buyNft({
                //     nftId: nftList?.nft?.id,
                //     nftToken: nftList?.nft?.NFTTokens[0].id,
                //     buyerAddress,
                //     contractAddress: contractAddress,
                //     buyNftResolve: buyNftResolve,
                //     transactionHash
                //   })
                // );

                const { hash: transactionHash, ...mintedNFT } = await nfts.buyNft(voucherArray, minterAddresses);

                dispatch(
                  buyNft({
                    nftId: nftList?.nft?.id,
                    nftToken: nftList?.nft?.NFTTokens[0].id,
                    buyerAddress: mintedNFT.from,
                    contractAddress: nftList?.nft?.contractAddress,
                    serialId: null,
                    buyNftResolve: buyNftResolve,
                    transactionHash,
                    changeLazyToken: true
                  })
                );
              } catch (error) {
                dispatch(mintLoaderNft(false));
                if (provider?.provider?.isMagic && !error?.reason) return;
                toast.error(error.reason);
              }
            } catch (error) {
              setLoader(false);
              dispatch(mintLoaderNft(false));
              if (provider?.provider?.isMagic && !error?.reason) return;
              toast.error(error.reason);
            }
          } else if (nftList?.nft?.mintType === "directMint" && isAutoRedeem) {
            try {
              setLoader(true);
              let erc20Address = GeneralSettingAddress;
              let contractAddressArray = Addressed;
              let price = ethers.utils.parseUnits(nftList?.nft?.price.toString(), 6);
              const provider = new ethers.providers.Web3Provider(window.ethereum);

              let tax = Number(nftTax || 0);
              let totalTax = Number((nftTax || 0) * quantity);
              let taxAmount = ethers.utils.parseUnits(tax.toString(), 6);
              let shippingPrice = Number(nftList?.nft?.shippingCost || 0);
              let flatRateShippingCost = nftList?.nft?.flatRateShippingCost || 0;
              const totalPrice = (nftList?.nft?.price * quantity + totalTax + shippingPrice).toString();
              const totalPriceCiel = Math.ceil(totalPrice).toString();
              const totalPriceEthers = ethers.utils.parseUnits(totalPriceCiel, 6);

              // const signer = provider.getSigner();
              const address = await signer.getAddress();

              // const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer);
              const galileoProtocol = new ethers.Contract(nftList?.nft?.contractAddress, GalileoProtocol.abi, signer);

              const token = new ethers.Contract(erc20Address, Erc20.abi, signer);
              // await (await token.approve(nftList?.nft?.contractAddress, 0)).wait();

              let balance = await token.balanceOf(address);
              if (balance.lt(ethers.utils.parseUnits(totalPriceCiel, 6))) {
                toast.error("Insufficient Balance");
                setLoader(false);
                dispatch(mintLoaderNft(false));
                return;
              }

              let approvalAmount = await token.allowance(address, nftList?.nft?.contractAddress);
              let approvePrice = ethers.utils.parseUnits("100000", 6);
              if (totalPrice > 100000) {
                approvePrice = ethers.utils.parseUnits(totalPriceCiel, 6);
              }
              if (approvalAmount.lt(totalPriceEthers)) {
                if (approvalAmount === 0) {
                  await (await token.approve(nftList?.nft?.contractAddress, approvePrice)).wait();
                  handleBuyBulkNft(true);
                  return;
                } else {
                  SetApprovalModal(true);
                  return;
                }
              }
              // if (approvalAmount.lt(price)) {
              //   SetApprovalModal(true);
              //   return;
              // }
              // ============Bulk token Uri ===============
              let nftData = nftList?.nft;
              let image = nftData.ipfsUrl;
              let priceTokenUri = nftData.price;
              let animation_url = nftData.animation_url;
              let name = nftData.name;
              let description = nftData.description;
              let projectName = "Galelio";
              let mintedDate = new Date().valueOf();
              let categoryName = nftData.Category.name;
              let brandName = nftData.Brand.name;
              let metaData = nftData.NFTMetaData;
              let poa = nftData.NFTMetaFiles;
              let external_url = nftData.NFTMetaFiles[0].fieldValue;

              let attributes = [];
              for (let i = 0; i < nftData.NFTMetaData.length; i++) {
                attributes.push({
                  trait_type: nftData.NFTMetaData[i]?.trait_type,
                  value: nftData.NFTMetaData[i]?.value,
                  countryCode: nftData.NFTMetaData[i]?.countryCode,
                  display_type: nftData.NFTMetaData[i]?.display_type,
                  primaryLocation: nftData.NFTMetaData[i]?.primaryLocation,
                  editRequested: nftData.NFTMetaData[i]?.editRequested,
                  editId: nftData.NFTMetaData[i]?.editId,
                  NftId: nftData.NFTMetaData[i]?.NftId,
                  isEditable: nftData.NFTMetaData[i]?.isEditable,
                  proofRequired: nftData.NFTMetaData[i]?.proofRequired,
                  Proofs: nftData.NFTMetaData[i]?.Proofs
                });
              }
              if (!image || !priceTokenUri || !name || !description) return;

              let tokenUriArray = [];
              let tokenUris = [];
              for (let i = 0; i < quantity; i++) {
                const serialId = attributes.findIndex((item) => item.trait_type === "Serial ID");
                if (serialId !== -1) {
                  attributes[serialId].value = serialIds[i];
                }
                const objForIpfsClient = JSON.stringify({
                  projectName,
                  brandName,
                  animation_url,
                  categoryName,
                  image,
                  name,
                  description,
                  price: priceTokenUri,
                  mintedDate,
                  attributes: [
                    ...attributes,
                    {
                      trait_type: "Redeemed",
                      value: "true",
                      countryCode: null,
                      display_type: "Text",
                      primaryLocation: null,
                      editRequested: false,
                      editId: null,
                      NftId: nftIDs[i],
                      isEditable: false,
                      proofRequired: false,
                      Proofs: null
                    }
                  ],
                  poa,
                  external_url
                });
                const result = await axios.post(`${REACT_APP_API_URL}ipfs/client`, { objForIpfsClient }, headers);
                tokenUriArray.push(`https://galileoprotocol.infura-ipfs.io/ipfs/${result.data?.path}`);
                tokenUris.push({
                  nftId: nftIDs[i],
                  uri: `https://galileoprotocol.infura-ipfs.io/ipfs/${result.data?.path}`
                });
              }
              // ===============================
              const vouchersArray = [];
              let shipPriceSum = 0;
              for (let i = 0; i < response.data?.data?.nfts?.length; i++) {
                let shipPrice = 0;

                if (nftData?.shippingCalculationMethod === "FS") {
                  shipPrice = 0;
                }

                if (nftData?.shippingCalculationMethod === "CCS") {
                  shipPrice += shippingPrice / quantity;
                  shipPriceSum += shippingPrice / quantity;
                }

                if (nftData?.shippingCalculationMethod === "FRS") {
                  if (nftData.noExternalCostForMultipleCopies) {
                    shipPrice += flatRateShippingCost / quantity;
                    shipPriceSum += flatRateShippingCost / quantity;
                  } else {
                    shipPrice += flatRateShippingCost;
                    shipPriceSum += flatRateShippingCost;
                  }
                }
                let data = {
                  nftId: nftList?.nft?.id,
                  tokenId: parseInt(response.data?.data?.nfts[i]?.tokenId),
                  price: price,
                  tax: taxAmount,
                  shipmentFee: ethers.utils.parseUnits(shipPrice.toString(), 6),
                  uri: tokenUriArray[i],
                  collectionAddress: nftList?.nft?.contractAddress,
                  buyer: address
                };

                vouchersArray.push(data);
              }
              const voucherResponse = await axios.post(`/voucher/sign`, { vouchers: vouchersArray }, headers);
              const dispatchRequest = {
                nftId: nftIDs,
                nftToken: tokenID,
                contractAddress: contractAddress,
                buyNftResolve: buyNftResolve,
                autoRedeem: true,
                tax: tax,
                shippingCost: shipPriceSum,
                shippoObjectId: nftList?.nft?.rateObjectId,
                billingAddress: shippingAddress?.value,
                shippingAddress: shippingAddress?.value,
                shippingProvider: nftList?.nft?.provider?.providerName,
                uri: tokenUris,
                middleware: true,
                blockchainAction: BLOCKCHAIN_ACTIONS.BUY_AND_REDEEM
              };
              // making api call to store the logs
              const endpoint = "/users/nftOperation";
              const method = "POST";
              await loggerApi(endpoint, method, dispatchRequest);

              const {
                from: buyerAddress,
                hash: transactionHash,
                ...rest
              } = await galileoProtocol.buyNFTs(
                voucherResponse?.data?.data?.vouchers,
                voucherResponse?.data?.data?.subAdmins
              );
              dispatchRequest.transactionHash = transactionHash;
              dispatchRequest.buyerAddress = buyerAddress;
              delete dispatchRequest.middleware;
              delete dispatchRequest.blockchainAction;
              dispatch(buyNft(dispatchRequest));

              const receipt = await rest.wait();

              dispatchRequest.currentNftId = productId;
              dispatchRequest.frontEndReceipt = receipt;
              dispatchRequest.stopMintNftLoader = stopMintNftLoader;

              dispatch(bulkBuyNft(dispatchRequest));
            } catch (error) {
              setLoader(false);
              dispatch(mintLoaderNft(false));
              toast.error(error?.reason || error?.response?.data?.data?.message || "Error");
            }
          }
        }
      }
    } catch (error) {
      // Handle the error here
      setLoader(false);
      dispatch(mintLoaderNft(false));
    }
  };

  useEffect(() => {
    if (isBuyTrue && nftList && nftList?.nft?.id === productId) {
      handleBuyBulkNft(nftList?.nft?.autoRedeem);
    }
  }, [isBuyTrue, searchParams, nftList]);

  const callCheckWallet = async () => {
    if ((await checkWallet(provider, dispatch, account, user.walletAddress)) !== null) {
      return true;
    } else {
      return false;
    }
  };

  const handleSingleNft = async (isAutoRedeem) => {
    if (user == null) {
      navigate("/login");
    } else {
      const validateKyc = checkUserKyc(user?.UserKyc);
      if (!validateKyc) {
        return;
      }
      if (nftList?.nft?.mintType === "directMint" && !isAutoRedeem) {
        try {
          dispatch(mintLoaderNft(true));
          setLoader(true);
          let erc20Address = GeneralSettingAddress;
          // let tokenId = parseInt(nftList?.nft?.NFTTokens[0].tokenId);
          let contractAddress = nftList?.nft?.contractAddress;
          let price = ethers.utils.parseUnits(nftList?.nft?.price.toString(), 6);
          let tax = nftTax || 0;
          let taxAmount = ethers.utils.parseUnits(tax.toString(), 6);

          let shipPrice = 0;
          let shipmentPrice = ethers.utils.parseUnits(shipPrice.toString(), 6);

          const provider = new ethers.providers.Web3Provider(window.ethereum);
          // const signer = provider.getSigner();
          const address = await signer.getAddress();

          const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer);

          const token = new ethers.Contract(erc20Address, Erc20.abi, signer);

          let balance = await token.balanceOf(address);
          if (balance.lt(price)) {
            toast.error("Insufficient Balance");
            setLoader(false);
            dispatch(mintLoaderNft(false));
            return;
          }
          let approvalAmount = await token.allowance(address, MarketplaceAddress.address);

          let approvePrice = ethers.utils.parseUnits("100000", 6);
          if (approvalAmount.toString() < price.toString()) {
            await (await token.approve(MarketplaceAddress.address, approvePrice)).wait();
          }

          // const tokenIdArray = [];
          const contractAddressArray = [];
          const priceArray = [];
          const taxArray = [];

          // tokenIdArray.push(tokenId);
          contractAddressArray.push(contractAddress);
          priceArray.push(price);
          taxArray.push(taxAmount);

          const voucher = {
            // tokenId,
            price: price,
            tax: taxAmount,
            shipment: shipmentPrice,
            uri: "",
            collectionAddress: nftList?.nft?.contractAddress,
            buyer: address
          };

          const voucherResponse = await axios.post(`/voucher/sign`, { vouchers: [voucher] }, headers);

          const {
            from: buyerAddress,
            hash: transactionHash,
            ...rest
          } = await marketplace.buyNFTs(voucherResponse?.data?.data?.vouchers);

          const dispatchRequest = {
            nftId: nftList?.nft?.id,
            nftToken: nftList?.nft?.NFTTokens[0].id,
            nftTokenId: nftList?.nft?.NFTTokens[0]?.tokenId,
            buyerAddress,
            contractAddress: contractAddress,
            buyNftResolve: buyNftResolve,
            transactionHash,
            autoRedeem: false,
            tax: tax,
            shippingCost: 0,
            shippoObjectId: nftList?.nft?.rateObjectId,
            billingAddress: shippingAddress?.value,
            shippingAddress: shippingAddress?.value
          };

          dispatch(buyNft(dispatchRequest));

          let receipt = await rest.wait();

          dispatchRequest.frontEndReceipt = receipt;

          dispatch(buyNft(dispatchRequest));
        } catch (error) {
          setLoader(false);
          toast.error(error?.reason || error?.response?.data?.data?.message || "Error");
          dispatch(mintLoaderNft(false));
        }
      } else if (nftList?.nft?.mintType === "lazyMint") {
        try {
          setLoader(true);
          dispatch(mintLoaderNft(true));
          let erc20Address = GeneralSettingAddress;
          let contractAddress = nftList?.nft?.contractAddress;

          const provider = new ethers.providers.Web3Provider(window.ethereum);
          // const signer = provider.getSigner();
          const address = await signer.getAddress();

          const nfts = new ethers.Contract(contractAddress, NFTAbi.abi, signer);
          let nftPrice = nftList?.nft?.price.toString();
          let profitPercentage = nftList?.nft?.profitPercentage;

          let prices = ethers.utils.parseUnits(nftPrice, 6);

          let voucher = {
            uri: nftList?.nft?.tokenUri,
            price: prices.toString(),
            token: erc20Address,
            time: nftList?.nft?.lazyVoucherTimeStamp,
            signature: nftList?.nft?.NFTTokens[0].signature
          };
          const token = new ethers.Contract(erc20Address, Erc20.abi, signer);

          let balance = await token.balanceOf(address);
          if (balance.lt(prices)) {
            toast.error("Insufficient Balance");
            setLoader(false);
            dispatch(mintLoaderNft(false));
            return;
          }
          let approvalAmount = await token.allowance(address, EscrowAddress.address);

          let approvePrice = ethers.utils.parseUnits("100000", 6);
          if (approvalAmount.lt(prices)) {
            await (await token.approve(contractAddress, approvePrice)).wait();
          }

          try {
            const voucherArray = [];
            const minterAddresses = [];
            voucherArray.push(voucher);
            minterAddresses.push(nftList?.nft?.minterAddress);

            // dispatch(
            //   buyNft({
            //     nftId: nftList?.nft?.id,
            //     nftToken: nftList?.nft?.NFTTokens[0].id,
            //     buyerAddress,
            //     contractAddress: contractAddress,
            //     buyNftResolve: buyNftResolve,
            //     transactionHash
            //   })
            // );

            const { hash: transactionHash, ...mintedNFT } = await nfts.buyNft(voucherArray, minterAddresses);

            dispatch(
              buyNft({
                nftId: nftList?.nft?.id,
                nftToken: nftList?.nft?.NFTTokens[0].id,
                buyerAddress: mintedNFT.from,
                contractAddress: nftList?.nft?.contractAddress,
                serialId: null,
                buyNftResolve: buyNftResolve,
                transactionHash,
                changeLazyToken: true
              })
            );
          } catch (error) {
            dispatch(mintLoaderNft(false));
            if (provider?.provider?.isMagic && !error?.reason) return;
            toast.error(error.reason);
          }
        } catch (error) {
          setLoader(false);
          dispatch(mintLoaderNft(false));
          if (provider?.provider?.isMagic && !error?.reason) return;
          toast.error(error.reason);
        }
      } else if (nftList?.nft?.mintType === "directMint" && isAutoRedeem) {
        try {
          setLoader(true);
          dispatch(mintLoaderNft(true));
          // let erc20Address = BLOCKCHAIN.USDT_ERC20;
          let erc20Address = GeneralSettingAddress;
          // let tokenId = parseInt(nftList?.nft?.NFTTokens[0].tokenId);
          let contractAddress = nftList?.nft?.contractAddress;

          let nftPrice = nftList?.nft?.salePrice || nftList?.nft?.price;
          let prices = ethers.utils.parseUnits(nftPrice.toString(), 6);

          let tax = Number(nftTax || 0);
          let totalTax = Number((nftTax || 0) * quantity);
          let taxAmount = ethers.utils.parseUnits(tax.toString(), 6);
          let shippingPrice = Number(nftList?.nft?.shippingCost || 0);
          let shippingCost = ethers.utils.parseUnits(shippingPrice.toString(), 6);
          const totalPrice = (nftList?.nft?.price * quantity + totalTax + shippingPrice).toString();
          const totalPriceCiel = Math.ceil(totalPrice).toString();
          const totalPriceEthers = ethers.utils.parseUnits(totalPriceCiel, 6);
          let address = await signer.getAddress();

          const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer);
          const galileoProtocol = new ethers.Contract(nftList?.nft?.contractAddress, GalileoProtocol.abi, signer);

          const token = new ethers.Contract(erc20Address, Erc20.abi, signer);

          if (Array.isArray(address) && address.length ) { address = address[0] }

          let balance = await token.balanceOf(address);
          if (balance.lt(ethers.utils.parseUnits(totalPriceCiel, 6))) {
            toast.error("Insufficient Balance");
            setLoader(false);
            dispatch(mintLoaderNft(false));
            return;
          }
          let approvalAmount = await token.allowance(address, EscrowAddress.address);
          let approvalAmountNumber = approvalAmount.toNumber();

          let approvePrice = ethers.utils.parseUnits("100000", 6);

          if (totalPrice > 100000) {
            approvePrice = ethers.utils.parseUnits(totalPriceCiel, 6);
          }
          if (approvalAmount.lt(totalPriceEthers)) {
            if (approvalAmountNumber === 0) {
              await (await token.approve(EscrowAddress.address, approvePrice)).wait();
              handleSingleNft(true);
              return;
            } else {
              SetApprovalModal(true);
              return;
            }
          }
          // const tokenIdArray = [];
          const contractAddressArray = [];
          const priceArray = [];
          const taxArray = [];
          const shippingArray = [];

          // tokenIdArray.push(tokenId);
          contractAddressArray.push(contractAddress);
          priceArray.push(prices);

          taxArray.push(taxAmount);
          shippingArray.push(shippingCost);

          let nftData = nftList?.nft;
          let image = nftData.ipfsUrl;
          let price = nftData.price;
          let name = nftData.name;
          let description = nftData.description;
          let projectName = "Galelio";
          let mintedDate = new Date().valueOf();
          let categoryName = nftData.Category.name;
          let brandName = nftData.Brand.name;
          let metaData = nftData.NFTMetaData;
          let poa = nftData.NFTMetaFiles;
          let external_url = nftData.NFTMetaFiles[0].fieldValue;

          let attributes = [];
          for (let i = 0; i < nftData.NFTMetaData.length; i++) {
            attributes.push({
              trait_type: nftData.NFTMetaData[i]?.trait_type,
              value: nftData.NFTMetaData[i]?.value,
              countryCode: nftData.NFTMetaData[i]?.countryCode,
              display_type: nftData.NFTMetaData[i]?.display_type,
              primaryLocation: nftData.NFTMetaData[i]?.primaryLocation,
              editRequested: nftData.NFTMetaData[i]?.editRequested,
              editId: nftData.NFTMetaData[i]?.editId,
              NftId: nftData.NFTMetaData[i]?.NftId,
              isEditable: nftData.NFTMetaData[i]?.isEditable,
              proofRequired: nftData.NFTMetaData[i]?.proofRequired
            });
          }
          // attributes.push({
          //   LastUpdated: nftData?.updatedAt,
          //   Minted: nftData?.createdAt,
          //   SerialNo: nftData.NFTTokens?.[0]?.serialId,
          //   Redeemed: "True"
          // });
          attributes.push({
            trait_type: "Redeemed",
            value: "true",
            countryCode: "",
            display_type: "Text",
            primaryLocation: false,
            editRequested: false,
            editId: null,
            NftId: nftData.id,
            isEditable: false,
            proofRequired: false,
            Proofs: null
          });

          // setLoader(true);
          if (!image || !price || !name || !description) return;

          let tokenUriArray;

          for (let i = 0; i < nftData?.NFTTokens?.length; i++) {
            const ipfsObj = JSON.stringify({
              projectName,
              brandName,
              categoryName,
              image,
              name,
              description,
              price,
              mintedDate,
              attributes,
              poa,
              external_url
            });

            const result = await axios.post(`${REACT_APP_API_URL}ipfs/client`, { objForIpfsClient: ipfsObj }, headers);
            tokenUriArray = `https://galileoprotocol.infura-ipfs.io/ipfs/${result?.data?.path}`;
          }

          // const voucher = {
          //   tokenId,
          //   nftId: nftList?.nft?.id,
          //   price: prices,
          //   tax: taxAmount,
          //   shipmentFee: shippingCost,
          //   // uri: nftList?.nft?.tokenUri,
          //   uri: tokenUriArray,
          //   collectionAddress: nftList?.nft?.contractAddress,
          //   buyer: address
          // };
          const ShippingCostPerNft = (shippingPrice / quantity).toFixed(2);
          const shippingCostEthers = ethers.utils.parseUnits(ShippingCostPerNft.toString(), 6);
          const voucher = {
            nftId: nftList?.nft?.id,
            price: prices,
            tax: taxAmount,
            shipmentFee: shippingCostEthers,
            collectionAddress: nftList?.nft?.contractAddress,
            buyer: address,
            chainId: nftList?.nft?.chainId
          };
          const voucherResponse = await axios.post(`/voucher/sign`, { voucher: voucher, quantity }, headers);

          let nftTokenArray = [];

          const voucherResponseArray = voucherResponse.data.data.vouchers;
          if (voucherResponseArray.length > 0) {
            for (let i = 0; i < voucherResponseArray.length; i++) {
              nftTokenArray.push({ tokenId: voucherResponseArray[i].tokenId, tokenUri: voucherResponseArray[i].uri });
            }
          }
          const dispatchRequest = {
            nftId: nftList?.nft?.id,
            nftToken: nftTokenArray,
            nftTokenId: nftList?.nft?.NFTTokens[0]?.tokenId,
            uri: tokenUriArray,
            contractAddress: contractAddress,
            buyNftResolve: buyNftResolve,
            autoRedeem: true,
            tax: tax,
            shippingCost: shippingPrice / quantity,
            shippoObjectId: nftList?.nft?.rateObjectId,
            billingAddress: shippingAddress?.value,
            shippingAddress: shippingAddress?.value,
            middleware: true,
            blockchainAction: BLOCKCHAIN_ACTIONS.BUY_AND_REDEEM,
            shippingProvider: nftList?.nft?.provider?.providerName
          };
          // making api call to store the logs
          const endpoint = "/users/nftOperation";
          const method = "POST";
          await loggerApi(endpoint, method, dispatchRequest);
          // const {
          //   from: buyerAddress,
          //   hash: transactionHash,
          //   ...rest
          // } = await marketplace.buyAndRedeem(voucherResponse?.data?.data?.vouchers);
          const {
            from: buyerAddress,
            hash: transactionHash,
            ...rest
          } = await galileoProtocol.buyNFTs(
            voucherResponse?.data?.data?.vouchers,
            voucherResponse?.data?.data?.subAdmins
          );
          dispatchRequest.transactionHash = transactionHash;
          dispatchRequest.buyerAddress = buyerAddress;
          delete dispatchRequest.middleware;
          delete dispatchRequest.blockchainAction;

          dispatch(buyNft(dispatchRequest));

          const receipt = await rest.wait();
          const requiredReceiptData = {
            transactionHash: receipt?.transactionHash,
            status: receipt?.status
          };
          dispatchRequest.currentNftId = productId;
          dispatchRequest.frontEndReceipt = requiredReceiptData;
          dispatchRequest.stopMintNftLoader = stopMintNftLoader;

          dispatch(buyNft(dispatchRequest));
        } catch (error) {
          console.log({ error }, "/////////////////////");
          setLoader(false);
          dispatch(mintLoaderNft(false));
          if (provider?.provider?.isMagic && !error?.reason) return;
          toast.error(error?.reason || error?.response?.data?.data?.message || "Error");
        }
      }
    }
  };
  const handleResellNft = async () => {
    if (user == null) {
      navigate("/login");
    } else if (await callCheckWallet()) {
      const validateKyc = checkUserKyc(user?.UserKyc);
      if (!validateKyc) {
        return;
      }
      if (nftList?.nft?.mintType === "directMint") {
        try {
          setResellLoader(true);
          dispatch(mintLoaderNft(true));
          let erc20Address = GeneralSettingAddress;
          let tokenId = parseInt(nftList?.nft?.NFTTokens[0].tokenId);
          let contractAddress = nftList?.nft?.contractAddress;

          let rrprice = ethers.utils.parseUnits(rprice.toString(), 6);

          // const provider = new ethers.providers.Web3Provider(window.ethereum);
          // const signer = provider.getSigner();

          const nfts = new ethers.Contract(contractAddress, NFTAbi.abi, signer);
          const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer);

          await (await nfts.approve(MarketplaceAddress.address, tokenId)).wait();

          const { from: buyerAddress, hash: transactionHash } = await marketplace.resellNFT(
            tokenId,
            rrprice,
            contractAddress
          );
          dispatch(
            resellNft({
              rprice: rprice,
              nftId: nftList?.nft?.id,
              nftToken: nftList?.nft?.NFTTokens[0]?.id,
              nftTokenId: nftList?.nft?.NFTTokens[0]?.tokenId,
              buyerAddress: buyerAddress,
              contractAddress: contractAddress,
              resellNftResolve: resellNftResolve,
              transactionHash
            })
          );

          // await (await marketplace.resellItem(tokenId, contractAddress, rrprice))
          //   .wait()
          //   .then((data) => {
          //     dispatch(
          //       resellNft({
          //         rprice: rprice,
          //         nftId: nftList?.nft?.id,
          //         nftToken: nftList?.nft?.NFTTokens[0].id,
          //         buyerAddress: data.from,
          //         contractAddress: contractAddress,
          //         resellNftResolve: resellNftResolve
          //       })
          //     );
          //     toast.success('NFT is Resold');
          //   })
          //   .catch((error) => {
          //     toast.error(error.reason);
          //   });
        } catch (error) {
          setResellLoader(false);
          dispatch(mintLoaderNft(false));
          setOpen(false);
          if (provider?.provider?.isMagic && !error?.reason) return;
          toast.error(error.reason);
        }
      } else if (nftList?.nft?.mintType === "lazyMint") {
        try {
          setResellLoader(true);
          dispatch(mintLoaderNft(true));
          let erc20Address = GeneralSettingAddress;
          let tokenId;
          if (lazyTokenId === "") {
            tokenId = parseInt(nftList?.nft?.NFTTokens[0].tokenId);
          } else {
            tokenId = parseInt(lazyTokenId);
          }
          let contractAddress = nftList?.nft?.contractAddress;
          let nftPrice = nftList?.nft?.price.toString();
          let rrprice = ethers.utils.parseUnits(nftPrice, 6);
          rrprice = rrprice.toString();
          let buyer = buyerNft?.buyer?.buyerAddress;

          // const provider = new ethers.providers.Web3Provider(window.ethereum);
          // const signer = provider.getSigner();
          const nfts = new ethers.Contract(contractAddress, NFTAbi.abi, signer);
          const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer);

          const { from: buyerAddress, hash: transactionHash } = await marketplace.makeItem(
            erc20Address,
            tokenId,
            contractAddress,
            rrprice
          );
          dispatch(
            resellNft({
              nftId: nftList?.nft?.id,
              nftToken: nftList?.nft?.NFTTokens[0].id,
              buyerAddress,
              contractAddress: contractAddress,
              resellNftResolve: resellNftResolve,
              transactionHash
            })
          );

          // await (await marketplace.makeItem(erc20Address, tokenId, contractAddress, rrprice))
          //   .wait()
          //   .then((data) => {
          //     dispatch(
          //       resellNft({
          //         nftId: nftList?.nft?.id,
          //         nftToken: nftList?.nft?.NFTTokens[0].id,
          //         buyerAddress: data.from,
          //         contractAddress: contractAddress,
          //         resellNftResolve: resellNftResolve
          //       })
          //     );

          //     toast.success('NFT is Resold');
          //   })
          //   .catch((error) => {
          //     toast.error(error.reason);
          //   });
          setOpen(false);
        } catch (error) {
          dispatch(mintLoaderNft(false));
          setResellLoader(false);
          if (provider?.provider?.isMagic && !error?.reason) return;
          toast.error(error.reason);
        }
      }
    }
  };

  const redeemedList = async (tokenUriArray) => {
    if (user == null) {
      dispatch(mintLoaderNft(false));
      navigate("/login");
    } else if (await callCheckWallet()) {
      const validateKyc = checkUserKyc(user?.UserKyc);
      if (!validateKyc) {
        return;
      }
      if (nftList?.nft?.mintType === "directMint") {
        try {
          setRedeemLoader(true);
          let nftData = nftList?.nft;
          let contractAddress =
            nftData?.brandContractAddress ||
            nftData?.contractAddress ||
            nftData?.Category?.BrandCategories[0]?.contractAddress;
          if (!contractAddress) {
            dispatch({
              type: SNACKBAR_OPEN,
              open: true,
              message: "No Contract Address found for this NFT",
              variant: "alert",
              alertSeverity: "info"
            });
          }
          // const provider = new ethers.providers.Web3Provider(window.ethereum);
          // const signer = provider.getSigner();
          const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer);
          let tokenId = parseInt(nftList?.nft?.NFTTokens[0].tokenId);
          let price = ethers.utils.parseUnits(nftList?.nft?.price.toString(), 6);
          let tax = nftTax || 0;
          let taxAmount = ethers.utils.parseUnits(tax.toString(), 6);
          let shippingPrice = nftList?.nft?.shippingCost || 0;
          let shippingCost = ethers.utils.parseUnits(shippingPrice.toString(), 6);
          const address = await signer.getAddress();

          const voucher = {
            tokenId,
            price: price,
            tax: taxAmount,
            shipment: shippingCost,
            uri: nftList?.nft?.tokenUri,
            collectionAddress: nftList?.nft?.contractAddress,
            buyer: address
          };

          const voucherResponse = await axios.post(`/voucher/sign`, { vouchers: [voucher] }, headers);

          const { from: buyerAddress, hash: transactionHash } = await marketplace.redeem(
            voucherResponse?.data?.data?.vouchers[0]
          );

          dispatch(
            redeemNft({
              nftId: nftList?.nft?.id,
              nftToken: nftList?.nft?.NFTTokens[0]?.id,
              nftTokenId: nftList?.nft?.NFTTokens[0]?.tokenId,
              buyerAddress: buyerAddress,
              contractAddress: contractAddress,
              transactionHash,
              tax: 0,
              shippingCost: shippingPrice,
              shippoObjectId: nftList?.nft?.rateObjectId,
              billingAddress: shippingAddress?.value,
              shippingAddress: shippingAddress?.value
            })
          );

          setRedeemLoader(false);
        } catch (error) {
          setRedeemLoader(false);
          toast.error(error?.reason || error?.response?.data?.data?.message || "Error");
          dispatch(mintLoaderNft(false));
        }
      } else if (nftList?.nft?.mintType === "lazyMint") {
        try {
          setRedeemLoader(true);
          let nftData = nftList?.nft;
          let nftTokens = nftData.NFTTokens[0]?.tokenId;
          let contractAddress =
            nftData?.brandContractAddress ||
            nftData?.contractAddress ||
            nftData?.Category?.BrandCategories[0]?.contractAddress;
          if (!contractAddress) {
            dispatch({
              type: SNACKBAR_OPEN,
              open: true,
              message: "No Contract Address found for this NFT",
              variant: "alert",
              alertSeverity: "info"
            });
          }
          // const provider = new ethers.providers.Web3Provider(window.ethereum);
          // const signer = provider.getSigner();
          const address = await signer.getAddress();
          const nft = new ethers.Contract(contractAddress, NFTAbi.abi, signer);

          const { from: buyerAddress, hash: transactionHash } = await nft.updateUri(nftTokens, tokenUriArray);

          dispatch(
            redeemNft({
              nftId: nftList?.nft?.id,
              nftToken: nftList?.nft?.NFTTokens[0].id,
              buyerAddress: buyerAddress,
              contractAddress: contractAddress,
              transactionHash
            })
          );

          // await (await nft.updateUri(nftTokens, tokenUriArray))
          //   .wait()

          //   .then((data) => {
          //     dispatch(
          //       redeemNft({
          //         nftId: nftList?.nft?.id,
          //         nftToken: nftList?.nft?.NFTTokens[0].id,
          //         buyerAddress: data.from,
          //         contractAddress: contractAddress
          //       })
          //     );
          //     dispatch(
          //       addDeliveryNft({
          //         status: 'Pending',
          //         TokenId: nftList?.nft?.NFTTokens[0].id,
          //         WalletAddress: data.from,
          //         NftId: nftList?.nft?.id,
          //         UserId: user.id,
          //         redeemNftResolve: redeemNftResolve
          //       })
          //     );

          //     toast.success('NFT Redeem successfully');
          //   })
          //   .catch((error) => {
          //     toast.error(error.reason);
          //   });
          setRedeemLoader(false);
        } catch (error) {
          setRedeemLoader(false);
          dispatch(mintLoaderNft(false));
          if (provider?.provider?.isMagic && !error?.reason) return;
          toast.error(error.reason);
        }
      }
    }
  };

  const handleRedeemNft = async () => {
    dispatch(mintLoaderNft(true));
    let nftData = nftList?.nft;

    let image = nftData.ipfsUrl;
    let price = nftData.price;
    let name = nftData.name;
    let description = nftData.description;
    let projectName = "Galelio";
    let mintedDate = new Date().valueOf();
    let categoryName = nftData.Category.name;
    let brandName = nftData.Brand.name;
    let metaData = nftData.NFTMetaData;
    let poa = nftData.NFTMetaFiles;
    let external_url = nftData.NFTMetaFiles[0].fieldValue;

    let attributes = [];
    for (let i = 0; i < nftData.NFTMetaData.length; i++) {
      attributes.push({
        trait_type: nftData.NFTMetaData[i]?.trait_type,
        value: nftData.NFTMetaData[i]?.value,
        countryCode: nftData.NFTMetaData[i]?.countryCode,
        display_type: nftData.NFTMetaData[i]?.display_type,
        primaryLocation: nftData.NFTMetaData[i]?.primaryLocation,
        editRequested: nftData.NFTMetaData[i]?.editRequested,
        editId: nftData.NFTMetaData[i]?.editId,
        NftId: nftData.NFTMetaData[i]?.NftId,
        isEditable: nftData.NFTMetaData[i]?.isEditable,
        proofRequired: nftData.NFTMetaData[i]?.proofRequired
      });
    }
    attributes.push({
      LastUpdated: nftData?.updatedAt,
      Minted: nftData?.createdAt,
      SerialNo: nftData.NFTTokens?.[0]?.serialId,
      Redeemed: "True"
    });

    // setLoader(true);
    if (!image || !price || !name || !description) return;

    let tokenUriArray;

    try {
      for (let i = 0; i < nftData?.NFTTokens?.length; i++) {
        const ipfsObj = JSON.stringify({
          projectName,
          brandName,
          categoryName,
          image,
          name,
          description,
          price,
          mintedDate,
          attributes,
          poa,
          external_url
        });
        const result = await axios.post(`${REACT_APP_API_URL}ipfs/client`, { objForIpfsClient: ipfsObj }, headers);
        tokenUriArray = `https://galileoprotocol.infura-ipfs.io/ipfs/${result?.data?.path}`;
      }

      setLoader(true);
      redeemedList(tokenUriArray);
    } catch (error) {
      toast.error(error?.reason);
      dispatch(mintLoaderNft(false));
      setLoader(false);
      setOpen(false);
    }
  };

  useEffect(() => {
    if (user) {
      dispatch(
        getNftBuyer({
          walletAddress: user?.walletAddress,
          NFTTokenId: nftList?.nft?.NFTTokens[0]?.id ? nftList?.nft?.NFTTokens[0]?.tokenId : 0,
          NftId: nftList?.nft?.id ? nftList?.nft?.id : 0
        })
      );
    }
    setMagnifyImage(
      nftList?.nft?.NFTImages[0].useBackGroundRemoved
        ? nftList?.nft?.NFTImages[0].backgroundRemovedPath
        : nftList?.nft?.NFTImages[0].asset
    );
  }, [useSelector, dispatch, resell, bought, redeem, nftList]);

  const Slides = () => {
    setVideo(false);
    setSlidershow(true);
  };
  const VideoAnimation = () => {
    setSlidershow(false);
    if (nftList?.nft?.animation_url) {
      setVideo(true);
    } else {
      setSlidershow(true);
    }
  };

  // const handleShow3D = () => {
  //   setHasToShowModel(true);
  // };
  const handleClose = () => setHasToShowModel(false);
  const handleShow3D = () => {
    setHasToShowModel(true);
  };

  const handleCloseBtnClick = () => {
    setHasToShowModel(false);
    setHasToShowPreview(false);
    localStorage.removeItem("3d-hint-view");
  };

  const StyledBuyBtn = styled(Button)(({ theme }) => ({
    fontFamily: theme?.typography.appText,
    fontSize: "16px",
    fontWeight: 600,
    lineHeight: "18.8px",
    letterSpacing: "0em",
    textAlign: "center",
    height: "3.25rem",
    color: "#fff",
    borderRadius: "12px",
    background: "linear-gradient(138.3deg, #2F53FF -0.85%, #2FC1FF 131.63%)",
    "&:hover": { backgroundColor: "#2196f3", borderRadius: "12px" }
  }));

  const StyledAddToCartBtn = styled(Button)(({ theme }) => ({
    fontFamily: theme?.typography.appText,
    fontSize: "16px",
    fontWeight: 600,
    lineHeight: "18.8px",
    letterSpacing: "0em",
    textAlign: "center",
    height: "3.25rem",
    border: "2px solid #2FA3FF",
    borderRadius: "12px",
    color: `${theme.palette.mode === "dark" ? "#ffffff" : "black"}`,
    background: "rgba(0, 0, 0, 0)",
    "&:hover": { backgroundColor: "rgba(0, 0, 0, 0)", borderRadius: "12px" }
  }));

  const handleLike = (id) => {
    if (!like) {
      dispatch(addToWishList({ NftId: id, setLike }));
      // setLike(!like)
    }
    if (like) {
      dispatch(deleteWishlistItem({ id, NftId: id, setLike }));
      // setLike(!like)
    }
  };
  const matchesRange = useMediaQuery("(min-width: 910px) and (max-width: 1361px)");

  return (
    <>
      <FullImage
        setOpen={setViewFullImage}
        open={viewFullIamge}
        image={nftList?.nft?.NFTImages}
        imageIndex={imageIndex}
        setImageIndex={setImageIndex}
      />
      <AddPrimaryImage
        toggleImage={toggleImage}
        setToggleImage={setToggleImage}
        id={nftList?.nft?.id}
        contractAddress={nftList?.nft?.contractAddress}
      />
      {buyerNft?.status?.includes("Redeem") && (
        <PermissionedDialog nftList={nftList} NftId={nftList?.nft?.id} open={editAccess} setOpen={seteditAccess} />
      )}
      <Grid container-fluid="true" spacing={gridSpacing} sx={{ margin: "15px" }}>
        <Dialog
          open={approvalModal}
          // onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Approval required</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              You need to provide approval for the adequate amount of {nftList?.nft?.currencyType} for a successful
              purchase. Please proceed with the next 2 transactions, to successfully approve the funds.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            {approvalLoader ? (
              <CircularProgress disableShrink />
            ) : (
              <Button variant="contained" onClick={() => ApprovalHandler()} className="app-text">
                Continue
              </Button>
            )}
          </DialogActions>
        </Dialog>
        <Grid item xs={12}>
          <Grid container justifyContent="center" spacing={gridSpacing} sx={{ textAlign: "center" }}>
            <Grid item md={6}>
              <Grid container>
                <Grid item md={1.5}>
                  <Stack m={0.5}>
                    {nftList?.nft?.NFTImages.map((img, index) => (
                      <Box mb={1}>
                        <img
                          src={img.useBackGroundRemoved ? img?.backgroundRemovedPath : img.asset}
                          alt={index}
                          key={index}
                          height={"45px"}
                          width={"45px"}
                          onClick={() =>
                            setMagnifyImage(img.useBackGroundRemoved ? img?.backgroundRemovedPath : img.asset)
                          }
                          style={{
                            border:
                              img?.asset === magnifyImage || img?.backgroundRemovedPath === magnifyImage
                                ? "3px solid #007185"
                                : "none",
                            borderRadius: "3px",
                            // objectFit: "contain",
                            background: "radial-gradient(circle, rgba(255,255,255,1) -10%, rgba(0,0,0,1) 170%)"
                          }}
                        />
                      </Box>
                    ))}
                  </Stack>
                </Grid>
                <Grid
                  item
                  md={10.5}
                  sx={{
                    overFlow: "hidden"
                  }}
                >
                  <Stack as="div" sx={{ position: "relative", height: "500px" }}>
                    {slidershow === true && (
                      <Box sx={{ height: "400px !important", zIndex: "30" }} className="img-maggify-wrap">
                        <ReactImageMagnify
                          {...{
                            smallImage: {
                              alt: "Wristwatch by Ted Baker London",
                              src: magnifyImage,
                              sizes: "(max-width: 480px) 100vw, (max-width: 1200px) 30vw, 360px ",
                              height: 500,
                              width: 550
                            },
                            largeImage: {
                              src: magnifyImage,
                              width: 2000,
                              height: 2000
                            },
                            enlargedImageContainerDimensions: {
                              width: 720,
                              height: "100%"
                            },
                            enlargedImageStyle: {
                              backgroundColor: "white"
                            },
                            imageStyle: {
                              background: "radial-gradient(circle, rgba(255,255,255,1) -10%, rgba(0,0,0,1) 170%)",
                              objectFit: "contain",
                              overFlow: "hidden"
                            }
                          }}
                        />
                        {/* <CarouselCard image={nftList?.nft?.NFTImages} setImageIndex={setImageIndex} /> */}
                      </Box>
                    )}

                    <Stack
                      as="div"
                      className="addImage-3dButton"
                      sx={{ position: "absolute", left: "0px ", bottom: { md: "-17px" }, zIndex: "40" }}
                    >
                      {nftList?.nft?.threeDModelUrl && (
                        <Grid item md={6} sm={12} sx={{ alignSelf: "end" }} onClick={handleShow3D}>
                          {Icons?.ThreeDimageIcon}
                        </Grid>
                      )}

                      <Tooltip placement="top" title="Add image" sx={{ cursor: "pointer !important" }}>
                        {buyerNft?.status?.includes("Redeem") && (
                          <Grid item md={4} sm={12} onClick={() => setToggleImage(true)}>
                            {Icons?.addImage}
                          </Grid>
                        )}
                      </Tooltip>
                    </Stack>

                    {videoshow === true && (
                      <VComponent
                        vid={nftList?.nft?.animation_url}
                        handleToggle={handleToggle}
                        setHandleToggle={setHandleToggle}
                      />
                    )}

                    <Box
                      component={"div"}
                      sx={{ display: "flex", position: "absolute", top: "4%", right: "3%", zIndex: "40" }}
                    >
                      {nftList?.nft?.animation_url && (
                        <ButtonGroup
                          sx={{ background: "white", height: "42px", boxShadow: "0px 5px 20px 0px #DDDDDD" }}
                        >
                          {slidershow === true ? (
                            <button
                              style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "3px",
                                border: "none",
                                backgroundColor: "white",
                                cursor: "pointer",
                                borderRadius: "4px"
                              }}
                              onClick={() => Slides()}
                            >
                              <img src={imageSelectedIcon} style={{ width: "35px", height: "35px" }} alt="" />
                            </button>
                          ) : (
                            <button
                              style={{
                                display: "flex",
                                alignItems: "center",
                                border: "none",
                                backgroundColor: "white",
                                cursor: "pointer",
                                borderRadius: "4px"
                              }}
                              onClick={() => Slides()}
                            >
                              <img src={pictureIcon} style={{ width: "25px" }} alt="" />
                            </button>
                          )}

                          {videoshow === true ? (
                            <button
                              style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "3px",
                                border: "none",
                                backgroundColor: "white",
                                cursor: "pointer",
                                borderRadius: "4px"
                              }}
                              onClick={() => VideoAnimation()}
                            >
                              <img src={videoSelectedIcon} style={{ width: "35px", height: "35px" }} alt="" />
                            </button>
                          ) : (
                            <button
                              style={{
                                display: "flex",
                                alignItems: "center",
                                border: "none",
                                backgroundColor: "white",
                                cursor: "pointer",
                                borderRadius: "4px"
                              }}
                              onClick={() => VideoAnimation()}
                            >
                              <img src={videoIcon} style={{ width: "25px" }} alt="" />
                            </button>
                          )}
                        </ButtonGroup>
                      )}
                      <ButtonGroup sx={{}}>
                        {videoshow === true ? (
                          <ButtonGroup
                            sx={{
                              background: "white",
                              marginLeft: "10px",
                              height: "42px",
                              boxShadow: "0px 5px 20px 0px #DDDDDD"
                            }}
                          >
                            <button
                              onClick={() => setHandleToggle(true)}
                              style={{
                                border: "none",
                                cursor: "pointer"
                              }}
                            >
                              <img src={expandPicIcon} style={{ width: "25px", marginTop: "3px" }} alt="" />
                            </button>
                          </ButtonGroup>
                        ) : (
                          <ButtonGroup
                            sx={{
                              background: "white",
                              marginLeft: "10px",
                              borderRadius: "none",
                              height: "42px",
                              boxShadow: "0px 5px 20px 0px #DDDDDD"
                            }}
                          >
                            {/* <button
                              onClick={() => setViewFullImage(true)}
                              style={{
                                border: "none",
                                cursor: "pointer"
                              }}
                            >
                              <img src={expandPicIcon} style={{ width: "25px", marginTop: "3px" }} alt="" />
                            </button> */}
                          </ButtonGroup>
                        )}
                      </ButtonGroup>
                    </Box>
                    {restrictApplication?.isInEU && process.env.REACT_APP_ENVIRONMENT === "development" && (
                      <Box component={"div"} sx={{ position: "absolute", top: "13%", right: "3%" }}>
                        <ButtonGroup
                          sx={{
                            background: "white",
                            marginLeft: "10px",
                            borderRadius: "none",
                            height: "40px",
                            boxShadow: "0px 5px 20px 0px #DDDDDD"
                          }}
                        >
                          <button
                            className="app-text"
                            onClick={() => {
                              if (user === null) {
                                navigate("/login");
                              } else {
                                handleLike(nftList?.nft?.id);
                              }
                            }}
                            style={{
                              border: "none",
                              color: "red",
                              backgroundColor: "white",
                              cursor: "pointer",
                              borderRadius: "4px"
                            }}
                          >
                            {/* {like ? <FavoriteIcon /> : <FavoriteBorderIcon />} */}
                            {like ? (
                              <img src={likeIcon} style={{ width: "25px", marginTop: "3px" }} alt="" />
                            ) : (
                              <img src={unLikeIcon} style={{ width: "25px", marginTop: "3px" }} alt="" />
                            )}
                          </button>
                        </ButtonGroup>
                      </Box>
                    )}
                    {videoshow === false && (
                      <Stack
                        onMouseEnter={() => setIsShown(true)}
                        onMouseLeave={() => setIsShown(false)}
                        as="div"
                        sx={{ position: "absolute", right: "3%", bottom: { xs: "6.8%", md: "4.5%" }, zIndex: "999" }}
                      >
                        {/* <img src={InfoIcon} height={'20px'} width={'20px'} /> */}
                        {/* <InfoIcon sx={{ color: "#ffffff" }} /> */}
                      </Stack>
                    )}
                    {isShown && (
                      <Stack as="div" sx={{ position: "absolute", right: { xs: "12%", md: "8%" }, bottom: "2%" }}>
                        <Card sx={{ minWidth: 235, width: "205px", height: "110px", backgroundColor: "white" }}>
                          <CardContent>
                            <Box mt={-1} sx={{ display: "flex", alignItems: "center" }}>
                              {nftList?.nft?.NFTImages[imageIndex]?.User && (
                                <Avatar
                                  alt="User name"
                                  sx={{ border: "1px solid #5498CB", width: "34px", height: "34px" }}
                                  src={nftList?.nft?.NFTImages[imageIndex]?.User?.UserProfile?.profileImg}
                                />
                              )}
                              <Typography className="icon-text" sx={{ marginLeft: 1 }}>
                                {nftList?.nft?.NFTImages[imageIndex]?.User?.firstName}
                              </Typography>
                            </Box>
                            <Typography mt={1.5} className="image-changed" variant="body2">
                              Image Changed
                            </Typography>
                            <Typography mt={0.5} className="date-time-on-hover" variant="body2">
                              {moment(nftList?.nft?.NFTImages[imageIndex]?.createdAt).format(
                                "ddd DD MMM YYYY [at] h:mmA"
                              )}
                            </Typography>
                            <ArrowRightIcon
                              style={{
                                color: "white",
                                position: "absolute",
                                right: "-8%",
                                bottom: "2%",
                                fontSize: "42px"
                              }}
                            />
                          </CardContent>
                        </Card>
                      </Stack>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </Grid>

            <Grid item md={6} sx={{ zIndex: "10" }}>
              <Grid item xs={12}>
                <Grid container>
                  <Grid container spacing={2}>
                    <Grid mt={4} ml={2} item xs={12}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item>
                          <Avatar
                            alt="User 1"
                            src={nftList?.nft?.isSoldByGalileo ? galileoLogo : nftList?.nft?.Brand?.image}
                            sx={{ width: 56, height: 56, objectFit: "fill", background: "black", cursor: "pointer" }}
                            onClick={() => {
                              navigate("/brand/" + nftList?.nft?.Brand?.id);
                            }}
                          />
                        </Grid>
                        <Grid item xs sx={{ textDecoration: "none" }}>
                          <Typography
                            sx={{ cursor: "pointer", width: "fit-content" }}
                            align="left"
                            fontWeight={600}
                            variant="h2"
                            className="brand"
                            onClick={() => {
                              navigate("/brand/" + nftList?.nft?.Brand?.id);
                            }}
                          >
                            {nftList?.nft?.Brand?.name}
                          </Typography>
                          <Typography align="left" variant="h3" className="creator">
                            {nftList?.nft?.Category?.name}
                          </Typography>
                        </Grid>
                        {/* {buyerNft?.status?.includes("Redeem") && (
                            <Grid item>
                              <Button
                                variant="contained"
                                className="edit-access"
                                onClick={() => {
                                  seteditAccess(true);
                                }}
                              >
                                Edit access
                              </Button>

                              <Button variant="outlined" ml={4} className="transfer-nft">
                                Transfer Nft
                              </Button>
                            </Grid>
                          )} */}
                      </Grid>
                    </Grid>

                    <Grid item mt={2} xs={12}>
                      <Typography
                        className="Lux"
                        color={theme.palette.mode === "dark" ? "white" : "black"}
                        variant="h3"
                      >
                        {nftList?.nft?.name}{" "}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} ml={1.8}>
                      {/* <Typography className="productdescription" variant="body2">
                        {nftList?.nft?.description}
                      </Typography> */}
                      {nftList?.nft?.description?.length && (
                        // <TruncatedText text={nftList?.nft?.description} limit={300} />
                        <ParseHtmlToText description={nftList?.nft?.description || ""} />
                      )}
                    </Grid>

                    <Grid item xs={12}>
                      <Stack direction="row" spacing={0.5}>
                        <Stack direction="column" spacing={0.5}>
                          <Typography
                            color={theme.palette.mode === "light" ? "black" : "#CDCDCD"}
                            sx={{ paddingLeft: { md: "15px" }, textAlign: { xs: "left" } }}
                            className="NFT-Price-Quantity"
                            variant="body2"
                          >
                            In Stock : {nftList?.nft?.quantity ? nftList?.nft?.quantity : "1"}
                          </Typography>

                          {nftList?.nft?.NFTTokens.length === 1 && (
                            <>
                              {nftList?.nft?.NFTTokens.map((option, i) =>
                                nftList?.nft?.mintType === "lazyMint" ? (
                                  <Typography
                                    key={i}
                                    // onClick={() => {
                                    //   searchSerial(option?.serialId);
                                    // }}
                                    className="serialId-price-QuantityValue"
                                    variant="body2"
                                    sx={{
                                      cursor: "pointer",
                                      color: "#2194FF !important",
                                      marginTop: "23px !important",
                                      paddingLeft: { md: "15px" },
                                      textAlign: { xs: "left" }
                                    }}
                                  >
                                    {nftList?.nft?.mintType === "lazyMint" && option?.serialId
                                      ? option?.serialId
                                      : "Lazy Mint"}
                                  </Typography>
                                ) : (
                                  <Typography
                                    key={i}
                                    // onClick={() => {
                                    //   searchSerial(option?.serialId);
                                    // }}
                                    className="serialId-price-QuantityValue"
                                    variant="body2"
                                    sx={{
                                      cursor: "pointer",
                                      color: "#2196f3 !important",
                                      marginTop: "23px !important",
                                      paddingLeft: { md: "15px" },
                                      textAlign: { xs: "left" }
                                    }}
                                  >
                                    {option?.serialId ? option?.serialId : "Draft"}
                                    {/* VX328472 */}
                                  </Typography>
                                )
                              )}
                            </>
                          )}
                        </Stack>

                        <Stack direction="column" spacing={0.5} sx={{ position: "relative" }}>
                          <Typography
                            color={theme.palette.mode === "light" ? "black" : "#CDCDCD"}
                            sx={{ paddingLeft: { md: "50px" }, textAlign: { xs: "left" } }}
                            className="NFT-Price-Quantity"
                            variant="body2"
                          >
                            Price
                          </Typography>

                          <Typography
                            className="serialId-price-QuantityValue"
                            color={theme.palette.mode === "dark" ? "white" : "#262626"}
                            sx={{
                              marginTop: "15px !important",
                              paddingLeft: { md: "50px" },
                              textAlign: { md: "left" },
                              display: "flex"
                            }}
                            variant="h4"
                          >
                            {/*  */}
                            {nftList?.nft?.currencyType === "USDT" ? (
                              <Box>{Icons.price}</Box>
                            ) : (
                              <Avatar
                                alt="User name"
                                sx={{ border: "1px solid #5498CB", width: "28px", height: "28px" }}
                                src={usdt}
                              />
                            )}

                            {nftList?.nft?.salePrice ? (
                              <span className="alignment" style={{ display: "flex", alignItems: "center" }}>
                                {nftList?.nft?.price && (
                                  <span
                                    style={{
                                      color: "#4DA9FF",
                                      backgroundColor: "#093157",
                                      padding: "5px 10px 5px 10px",
                                      borderRadius: "15px",
                                      fontWeight: 500,
                                      fontSize: "14px",
                                      position: "absolute",
                                      right: "0",
                                      top: "0"
                                    }}
                                  >
                                    {formattedDecimals(
                                      (
                                        ((nftList?.nft?.price - nftList?.nft?.salePrice) / nftList?.nft?.price) *
                                        100
                                      ).toFixed(2)
                                    )}
                                    % off
                                  </span>
                                )}
                                {nftList?.nft?.salePrice
                                  ? formattedDecimals(Number(nftList?.nft?.salePrice).toFixed(2))
                                  : 0}{" "}
                                {nftList?.nft?.currencyType}{" "}
                                {nftList?.nft?.price && (
                                  <span
                                    style={{
                                      fontSize: "14px",
                                      color: "#B7B9BA",
                                      fontWeight: 500,
                                      textDecoration: "line-through",
                                      paddingLeft: "10px"
                                    }}
                                  >
                                    {formattedDecimals(Number(nftList?.nft?.price).toFixed(2))}{" "}
                                    {nftList?.nft?.currencyType}
                                  </span>
                                )}
                              </span>
                            ) : (
                              <span className="alignment">
                                {nftList?.nft?.currencyType}{" "}
                                {nftList?.nft?.price ? formattedDecimals(Number(nftList?.nft?.price).toFixed(2)) : 0}
                              </span>
                            )}
                          </Typography>
                        </Stack>
                        {user?.role === "User" && (
                          <>
                            {nftList?.nft?.quantity !== undefined && nftList?.nft?.quantity && (
                              <Stack direction="column" spacing={0.5}>
                                <Typography
                                  sx={{
                                    paddingLeft: { md: "50px" },
                                    textAlign: { xs: "left" },
                                    color: theme.palette.mode === "dark" ? "#CDCDCD" : "black"
                                  }}
                                  className="NFT-Price-Quantity"
                                  variant="body2"
                                >
                                  Quantity
                                </Typography>

                                <Typography
                                  className="serialId-price-QuantityValue"
                                  color={theme.palette.mode === "dark" ? "white" : "#262626"}
                                  sx={{
                                    marginTop: "18px !important",
                                    paddingLeft: { md: "50px" },
                                    textAlign: { md: "left" }
                                  }}
                                  variant="h4"
                                >
                                  <QuantityComponent
                                    bulkcount={nftList?.nft?.quantity}
                                    quantity={quantity}
                                    setQuantity={setQuantity}
                                  />
                                </Typography>
                              </Stack>
                            )}
                          </>
                        )}
                      </Stack>
                    </Grid>

                    {nftList?.nft?.NFTTokens.length > 1 && nftList?.nft?.status === "MINTED" && (
                      <Grid item xs={12}>
                        <Box sx={{ borderRadius: "4px", width: "95%", margin: "0 auto", textAlign: "left" }}>
                          <Box sx={{ minWidth: 120 }}>
                            <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-label">Serial Id :</InputLabel>
                              <Select
                                variant="standard"
                                // labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={age}
                                // label="Age"
                                onChange={handleChange}
                                fullWidth
                                displayEmpty
                                inputProps={{ "aria-label": "Without label" }}
                              >
                                {nftList?.nft?.NFTTokens.map((option, i) => (
                                  <MenuItem
                                    key={i}
                                    onClick={() => {
                                      searchSerial(option?.serialId);
                                    }}
                                  >
                                    {option?.serialId ? option?.serialId : "No Serial Id"}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Box>
                        </Box>
                      </Grid>
                    )}
                    <Grid item xs={12} mb={3}>
                      <Box
                        sx={{
                          borderRadius: "4px",
                          width: { md: "95%" },
                          margin: { md: "0 auto" },
                          textAlign: "left"
                        }}
                      >
                        {nftList?.nft?.NFTMetaFiles?.length && <ProofsDropdown proofs={nftList?.nft?.NFTMetaFiles} />}
                      </Box>
                    </Grid>
                    <Grid item sx={{ mt: "4em", ml: "1.5em", mb: 2 }}>
                      {nftList?.nft?.isSoldByGalileo && (
                        <Typography
                          className="app-text"
                          variant="h4"
                          sx={{ display: "flex", alignItems: "center", gap: "5px" }}
                        >
                          {Icons.verifiedIcon} Digitally Authenticated, Refurbished And Resold by Galileo Protocol
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12} sx={{ paddingTop: "5px !important" }}>
                      <Grid container>
                        {checkLoader || nftList?.nft?.isInTransaction ? (
                          <Grid item display={"flex"} justifyContent="center" sx={{ width: "100%", mt: 3, mb: 3 }}>
                            <CircularProgress disableShrink />
                          </Grid>
                        ) : (
                          <>
                            {bought === true && (
                              <>
                                <Grid item md={0.2}></Grid>
                                <Grid item md={7.7} xs={12} sm={12} textAlign="center">
                                  <Typography
                                    variant="h4"
                                    className="app-text"
                                    sx={{ display: "flex", alignItems: "center", gap: "5px" }}
                                  >
                                    {Icons.verifiedIcon} Purchase successful
                                  </Typography>
                                </Grid>
                              </>
                            )}
                            {nftList?.nft?.isSold === true ? (
                              <>
                                <Grid item md={0.2}></Grid>
                                <Grid item md={7.7} xs={12} sm={12} textAlign="center">
                                  <Typography
                                    variant="h4"
                                    className="app-text"
                                    sx={{ display: "flex", alignItems: "center", gap: "5px" }}
                                  >
                                    {Icons.verifiedIcon} The item has already been purchased
                                  </Typography>
                                </Grid>
                              </>
                            ) : (
                              <>
                                {buyerNft?.founded ? (
                                  <>
                                    <>
                                      <Grid item md={12} sx={{ display: "flex", marginLeft: "15px" }}>
                                        {buyerNft?.status?.includes("Redeem") || redeem ? (
                                          <>
                                            <Grid
                                              item
                                              md={12}
                                              xs={12}
                                              sm={12}
                                              textAlign="center"
                                              sx={{
                                                width: "99%",
                                                marginLeft: "6px"
                                              }}
                                            >
                                              <Alert
                                                severity="success"
                                                className="alet-redeem"
                                                sx={{
                                                  background: theme.palette.mode === "dark" ? "#181c1f" : "white"
                                                }}
                                              >
                                                <b>
                                                  Purchase successful, view details in{" "}
                                                  <span
                                                    onClick={() => navigate("/myactivity")}
                                                    style={{ cursor: "pointer", color: "#2196f3" }}
                                                  >
                                                    My Activity
                                                  </span>
                                                </b>
                                              </Alert>
                                            </Grid>
                                          </>
                                        ) : (
                                          <>
                                            {buyerNft?.status !== "Resell" && redeem !== true && (
                                              <>
                                                <Grid
                                                  item
                                                  md={12}
                                                  xs={12}
                                                  sm={12}
                                                  textAlign="center"
                                                  sx={{ marginTop: { md: "30px", xs: "10px" } }}
                                                >
                                                  {resellLoader ? (
                                                    ""
                                                  ) : (
                                                    <Button
                                                      sx={{ width: "97% !important", marginRight: "0 !important" }}
                                                      className="buy"
                                                      variant="contained"
                                                      size="large"
                                                      onClick={() => {
                                                        // handleRedeemNft();
                                                        setBuyRedeemAction("Redeem");
                                                        setOpenBuyRedeemDlg(true);
                                                      }}
                                                    >
                                                      {redeemLoader ? (
                                                        <CircularProgress sx={{ color: "white" }} size={28} />
                                                      ) : (
                                                        <span>Redeem</span>
                                                      )}
                                                    </Button>
                                                  )}
                                                </Grid>
                                              </>
                                            )}
                                          </>
                                        )}

                                        {buyerNft?.status === "Resell" || resell === true ? (
                                          <>
                                            <Grid
                                              item
                                              md={12}
                                              xs={12}
                                              sm={12}
                                              textAlign="center"
                                              sx={{ marginLeft: "5px" }}
                                            >
                                              <Alert
                                                severity="info"
                                                className="alet-redeem"
                                                sx={{
                                                  background: theme.palette.mode === "dark" ? "#181c1f" : "white"
                                                }}
                                              >
                                                <b>This item is resold by you!</b>
                                              </Alert>
                                            </Grid>
                                          </>
                                        ) : (
                                          <>
                                            {!buyerNft?.status?.includes("Redeem") && redeem === false && (
                                              <>
                                                <Grid
                                                  item
                                                  md={12}
                                                  xs={12}
                                                  sm={12}
                                                  textAlign="center"
                                                  sx={{ marginTop: "29px" }}
                                                >
                                                  {resellLoader ? (
                                                    <CircularProgress sx={{ color: "blue", ml: 3 }} />
                                                  ) : redeemLoader ? (
                                                    ""
                                                  ) : // TODO: FIX THIS
                                                  // <Button
                                                  //   sx={{ width: '97% !important', marginRight: '0 !important' }}
                                                  //   className="buy"
                                                  //   variant="contained"
                                                  //   size="large"
                                                  //   onClick={() => {
                                                  //     if (nftList?.nft?.mintType == 'directMint') {
                                                  //       setRprice(nftList?.nft?.price);
                                                  //       setOpen(true);
                                                  //     } else if (nftList?.nft?.mintType == 'lazyMint') {
                                                  //       handleResellNft();
                                                  //     }
                                                  //   }}
                                                  // >
                                                  //   Resell
                                                  // </Button>
                                                  null}
                                                </Grid>
                                              </>
                                            )}
                                          </>
                                        )}
                                      </Grid>
                                    </>
                                  </>
                                ) : (
                                  <>
                                    {user?.role !== "Super Admin" &&
                                      user?.role !== "Sub Admin" &&
                                      user?.role !== "Brand Admin" &&
                                      restrictApplication?.isInEU && (
                                        <>
                                          {bought !== true &&
                                            nftList?.nft?.isSold === false &&
                                            nftList?.nft?.editStatus !== "temp" && (
                                              <Grid
                                                item
                                                md={12}
                                                xs={12}
                                                sm={12}
                                                sx={{ marginTop: { md: "-10px", lg: "-10px" } }}
                                                textAlign="center"
                                              >
                                                <Stack direction="row" spacing={1} sx={{ paddingLeft: "20px" }}>
                                                  {/* If nft is autoRedeem only show buy & redeem button */}
                                                  {nftList?.nft?.autoRedeem ? (
                                                    <StyledBuyBtn
                                                      disabled={loader}
                                                      onClick={async () => {
                                                        if (user === null) {
                                                          navigate("/login");
                                                        } else if (await callCheckWallet()) {
                                                          const validateKyc = checkUserKyc(user?.UserKyc);
                                                          if (!validateKyc) {
                                                            return;
                                                          } else {
                                                            setBuyRedeemAction("Checkout");
                                                            setOpenBuyRedeemDlg(true);
                                                          }
                                                        }
                                                      }}
                                                      variant="filled"
                                                      aria-label="Cart"
                                                      fullWidth
                                                    >
                                                      {loader ? (
                                                        <CircularProgress className="circul" />
                                                      ) : (
                                                        <span>Buy & Redeem </span>
                                                      )}
                                                    </StyledBuyBtn>
                                                  ) : (
                                                    // If nft is not autoRedeem show both buy and buy&redeem buttons
                                                    <DropdownButton
                                                      defaultOption={"buy"}
                                                      handleBuy={(value) => {
                                                        if (user === null) {
                                                          navigate("/login");
                                                        } else {
                                                          if (value === "buyRedeem") {
                                                            const validateKyc = checkUserKyc(user?.UserKyc);
                                                            if (!validateKyc) {
                                                              return;
                                                            } else {
                                                              setBuyRedeemAction("Checkout");
                                                              setOpenBuyRedeemDlg(true);
                                                            }
                                                          } else {
                                                            if (
                                                              nftList?.nft?.bulkId !== undefined &&
                                                              nftList?.nft?.bulkId
                                                            ) {
                                                              handleBuyBulkNft(nftList?.nft?.autoRedeem);
                                                            } else {
                                                              handleSingleNft(nftList?.nft?.autoRedeem);
                                                            }
                                                          }
                                                        }
                                                      }}
                                                    />
                                                  )}
                                                  {process.env.REACT_APP_ENVIRONMENT === "development" &&
                                                    !existsInCart &&
                                                    nftList?.nft?.mintType === "directMint" && (
                                                      <StyledAddToCartBtn
                                                        onClick={() =>
                                                          dispatch(
                                                            addToCart({
                                                              NftId: nftList?.nft?.id,
                                                              selectedQuantity: quantity
                                                            })
                                                          )
                                                        }
                                                        variant="outlined"
                                                        size="lg"
                                                        aria-label="Continue"
                                                        fullWidth
                                                      >
                                                        <span>Add to cart</span>
                                                      </StyledAddToCartBtn>
                                                    )}
                                                  {existsInCart && (
                                                    <StyledAddToCartBtn
                                                      variant="outlined"
                                                      size="lg"
                                                      aria-label="Continue"
                                                      fullWidth
                                                    >
                                                      <span
                                                        style={{
                                                          display: "flex",
                                                          alignItems: "center",
                                                          justifyContent: "flex-end",
                                                          gap: "0.25rem"
                                                        }}
                                                      >
                                                        <VerifiedIcon sx={{ color: "#2F8BFF" }} />
                                                        Added to cart
                                                      </span>
                                                    </StyledAddToCartBtn>
                                                  )}
                                                </Stack>
                                                {/*       {nftList?.nft?.autoRedeem && (
                                                    <Stack
                                                      direction="row"
                                                      alignItems="center"
                                                      sx={{ pl: "22px", textAlign: "left", fontSize: "12px", mt: 2 }}
                                                    >
                                                      <InfoIcon
                                                        sx={{
                                                          color: theme.palette.mode === "dark" ? "#CDCDCD" : "#4a4848"
                                                        }}
                                                      />

                                                      <Typography variant="body2" mx={1}>
                                                        This is an Auto-Redeem item, it will be redeemed immediately
                                                        after buying and you cannot add this for resale.
                                                      </Typography>
                                                    </Stack>
                                                  )} */}
                                              </Grid>
                                            )}
                                        </>
                                      )}
                                  </>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </Grid>
                      {/* 
                                            <Button onClick={()=>{
                                                setBought(true)
                                            }}>Set Bought True</Button>
                                            <Button onClick={()=>{
                                                setBought(false)
                                            }}>Set Bought False</Button> */}
                    </Grid>

                    {nftList?.nft?.buyingItemCount > 0 && (
                      <Grid item xs={12} className="productBMW">
                        <Typography
                          sx={{
                            fontWeight: 400,
                            color: theme.palette.mode === "dark" ? "#CDCDCD" : "#4a4848",
                            // color: '#9498aa',
                            fontSize: "16px",
                            textAlign: "left",
                            padding: "0 15px",
                            lineHeight: "34px",
                            fontStyle: "normal",
                            letterSpacing: "0.02em",
                            fontFamily: theme?.typography.appText,
                            textTransform: "math-auto",
                            overflow: "auto",
                            maxHeight: "200px"
                          }}
                        >
                          {nftList?.nft?.buyingItemCount > 1
                            ? `${nftList?.nft?.buyingItemCount} person is buying this NFT`
                            : `${nftList?.nft?.buyingItemCount} persons are buying this NFT`}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Modal
        open={hasToShowModel}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          {hasToShowModel && (
            <div className="backdrop">
              <Preview3dContainer
                showModelQltyOf={"low"}
                handleCloseBtnClick={handleCloseBtnClick}
                className={hasToShowPreview ? "" : "hide"}
                setHasToShowPreview={setHasToShowPreview}
                threedModelSrc={nftList?.nft?.threeDModelUrl}
              />
              <Uploading3d className={hasToShowPreview ? "hide" : ""} />
            </div>
          )}
        </Box>
      </Modal>
      {/* <BuyRedeemDialog
        nft={nftList?.nft}
        quantity={quantity}
        productId={productId}
        action={buyRedeemAction}
        openDialog={openBuyRedeemDlg}
        shippingAddress={shippingAddress}
        setShippingAddress={setShippingAddress}
        handleClose={() => setOpenBuyRedeemDlg(false)}
        handleSubmit={() => {
          if (buyRedeemAction === "Redeem") {
            handleRedeemNft();
          } else {
            let isAutoRedeem = true;
            if (nftList?.nft?.bulkId != undefined && nftList?.nft?.bulkId) {
              handleBuyBulkNft(isAutoRedeem);
            } else {
              handleSingleNft(isAutoRedeem);
            }
          }
          setOpenBuyRedeemDlg(false);
        }}
      /> */}
      <ConfirmOrderDlg
        nft={nftList?.nft}
        quantity={quantity}
        productId={productId}
        action={buyRedeemAction}
        openDialog={openBuyRedeemDlg}
        shippingAddress={shippingAddress}
        setShippingAddress={setShippingAddress}
        handleClose={() => setOpenBuyRedeemDlg(false)}
        handleSubmit={async () => {
          if (await callCheckWallet()) {
            if (buyRedeemAction === "Redeem") {
              handleRedeemNft();
            } else {
              let isAutoRedeem = true;
              if (nftList?.nft?.bulkId !== undefined && nftList?.nft?.bulkId) {
                handleBuyBulkNft(isAutoRedeem);
              } else {
                handleSingleNft(isAutoRedeem);
              }
            }
            setOpenBuyRedeemDlg(false);
          }
        }}
      />
      <ResellDialog
        open={open}
        handleClose={() => setOpen(false)}
        rprice={rprice}
        setRprice={setRprice}
        handleResellNft={handleResellNft}
      />
    </>
  );
};

export default PropertiesView;
