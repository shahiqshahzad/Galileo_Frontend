import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Box } from "@mui/system";
import { Button, CircularProgress, Grid, Typography, useTheme } from "@mui/material";
import { Icons } from "shared/Icons/Icons";
import { getDownloadReceiptPdf, getOrderDetail } from "redux/activity/actions";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import moment from "moment";
import { getAddressValuesString, getFullAddress, getUserEmail } from "utils/combineAddress";
import ReturnItem from "./ReturnItem";
import { ethers } from "ethers";
// import GalileoEscrow from "./contractAbi/GalileoEscrow.js";
import GalileoEscrow from "../../../../../contractAbi/GalileoEscrow.js";
import { toast } from "react-toastify";
import { useWeb3 } from "utils/MagicProvider";
import { useSDK } from "@metamask/sdk-react";
import { checkWallet } from "utils/utilFunctions";
import { ParseHtmlToText } from "../../productDetails/component/parseHtmlToText/parseHtmlToText";
import { useActiveAccount } from "thirdweb/react";

const MyActivityDetailMint = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orderId } = useParams();
  const [loader, setLoader] = useState(true);
  const [escrowTimeLoader, setEscrowTimeLoader] = useState(false);
  const [openReturnModal, setOpenReturnModal] = useState(false);
  const [renderComponent, setRenderComponent] = useState(false);
  const [selectedNft, setSelectedNft] = useState([]);
  const { provider, signer } = useWeb3();
  const account = useActiveAccount();

  const orderDetail = useSelector((state) => state.allActivityReducer.orderDetail);
  const LoggedInWalletAddress = useSelector((state) => state.auth.user.walletAddress);
  const loginMethod = useSelector((state) => state.auth?.user?.signupMethod);
  const activityStatusLoader = useSelector((state) => state.brandActivityReducer.activityStatusLoader);
  const themeBgColor = {
    backgroundColor: theme.palette.mode === "dark" ? "#252B2F" : "#fff",

    borderRadius: "13px"
  };
  const themeBgColorP = {
    backgroundColor: theme.palette.mode === "dark" ? "#181C1F" : "#E8E8E8"
  };
  const styles = {
    color: theme.palette.mode === "dark" ? "#FFFFFF" : "#252B2F",
    fontWeight: "500",
    fontFamily: "DM Sans"
  };

  const downloadReceiptHandler = (orderId) => {
    dispatch(getDownloadReceiptPdf(orderId));
  };
  const checkEscrowTime = async (contractAddress, token, nft) => {
    setEscrowTimeLoader(true);
    if ((await checkWallet(provider, dispatch, account, LoggedInWalletAddress)) === null) {
      return;
    }

    const escrow = new ethers.Contract(GalileoEscrow.address, GalileoEscrow.abi, signer);

    let asset = await escrow.getAssetData(contractAddress, token[0]);
    asset = Number(asset.time.toString());
    let escrowTime = await escrow.getCollectionInfo(contractAddress);
    escrowTime = Number(escrowTime.toString());
    const endTime = escrowTime + asset;

    const currentTime = moment();

    const timestamp2 = moment.unix(endTime);
    const differenceInSeconds = timestamp2.diff(currentTime, "seconds");
    if (differenceInSeconds < 0) {
      toast.error("Escrow Time is over");
      setEscrowTimeLoader(false);
    } else {
      setSelectedNft(nft);
      returnItemModal();
      setEscrowTimeLoader(false);
    }
  };
  useEffect(() => {
    dispatch(getOrderDetail({ orderId, setLoader }));
    // eslint-disable-next-line
  }, [orderId, renderComponent]);

  // const isReturnEligible = (timestamp) => {
  //   if (!timestamp) return false;
  //   const deliveredAtDate = moment(timestamp);
  //   const currentDate = moment();
  //   const millisecondsDifference = deliveredAtDate.diff(currentDate);
  //   const daysDifference = Math.ceil(moment.duration(millisecondsDifference).asDays());

  //   return daysDifference >= 0 && daysDifference <= 14;
  // };
  const returnItemModal = () => {
    setOpenReturnModal(true);
  };

  let totalPrice = () => {
    let price = orderDetail?.payments?.totalPrice ? Number(orderDetail.payments.totalPrice) : 0;
    let cost = orderDetail?.payments?.shippingCost ? Number(orderDetail.payments.shippingCost) : 0;
    let tax = orderDetail?.payments?.totalTax ? Number(orderDetail.payments.totalTax) : 0;
    return (price + cost + tax).toFixed(2);
  };

  const address = getFullAddress(orderDetail?.payments?.shippingAddress);

  return (
    <Box sx={{ p: 2 }}>
      <ReturnItem
        setOpen={setOpenReturnModal}
        open={openReturnModal}
        orderId={orderId}
        setRenderComponent={setRenderComponent}
        nft={selectedNft}
      />
      <Box sx={{ display: "flex", alignItems: "center" }} mt={2}>
        <ArrowBackIosIcon
          onClick={() => {
            navigate("/myactivity");
          }}
          sx={{ color: "#2F53FF", cursor: "pointer" }}
        />
        <Typography variant="h2" color="info">
          Back
        </Typography>
      </Box>
      {loader ? (
        <Box mt={2} ml={3}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              backgroundColor: themeBgColorP,
              width: "98%",
              borderTopLeftRadius: "13px",
              borderTopRightRadius: "13px"
            }}
          >
            <Grid container sx={{ backgroundColor: themeBgColor }} mt={2} p={2.5}>
              <Grid item md={6}>
                {/* <Typography variant='h3' color={styles} >Details</Typography> */}
                <Box sx={{ ...styles, fontSize: "22px" }}>Details</Box>
                <Grid container mt={1.7}>
                  <Grid item md={4}>
                    <Typography variant="body1" sx={{ fontWeight: "400", fontFamily: theme?.typography.appText }}>
                      Bought on{" "}
                      {orderDetail?.payments?.createdAt &&
                        moment(orderDetail.payments.createdAt).format("DD MMMM YYYY")}
                    </Typography>
                  </Grid>
                  <Grid item md={0.5}>
                    <Box as="span" sx={{ borderLeft: "1px solid #2FC1FF" }}></Box>
                  </Grid>
                  <Grid item md={4}>
                    <Typography variant="body1" sx={{ fontWeight: "400", fontFamily: theme?.typography.appText }}>
                      Order# {orderDetail.payments.orderNumber}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={6} sx={{ marginLeft: "auto" }}>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }} mr={2}>
                  <Box width="40%">
                    <Link to={orderDetail.payments.transactionLink} style={{ textDecoration: "none" }} target="_blank">
                      <Typography
                        variant="h3"
                        sx={{
                          color: "#2F53FF",
                          fontWeight: "400",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        View Transaction {Icons?.hashSmallIcon}
                      </Typography>
                    </Link>
                    <Button
                      onClick={() => downloadReceiptHandler(orderDetail.payments.orderNumber)}
                      variant="outlined"
                      sx={{
                        width: "100%",
                        height: "30px",
                        color: styles,
                        fontFamily: theme?.typography.appText,
                        fontWeight: "500",
                        fontSize: "16px",
                        marginTop: "10px"
                      }}
                    >
                      Download Receipt
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Grid container width="98%" sx={{ backgroundColor: themeBgColorP }}>
            <Grid item md={2.5} p={2.5}>
              <Box sx={{ ...styles, fontSize: "22px" }}>Billing Address</Box>
              <Typography mt={1.5} variant="body2">
                {orderDetail.payments.billingAddress.tag}
              </Typography>
              <Typography variant="body2">{getAddressValuesString(orderDetail?.payments?.billingAddress)}</Typography>
            </Grid>
            <Grid item md={2.5} p={2.5}>
              <Box sx={{ ...styles, fontSize: "22px" }}>Shipping Address</Box>
              {/* <Typography mt={1.5} variant="body2">
                {orderDetail.payments.shippingAddress.tag}
              </Typography>

              <Typography variant="body2">{getAddressValuesString(orderDetail?.payments?.shippingAddress)}</Typography> */}
              <Typography mt={1.5} variant="body2">
                <p style={{ margin: 0 }}>{address.fullName}</p>
                <p style={{ margin: 0 }}>{getUserEmail(orderDetail)}</p>
                <p style={{ margin: 0 }}>{address.houseNoArea}</p>
                <p style={{ margin: 0 }}>{address.landmark}</p>
                <p style={{ margin: 0 }}>{address.cityStatePin}</p>
                <p style={{ margin: 0 }}>{address.country}</p>
              </Typography>
            </Grid>
            <Grid item md={3}></Grid>
            <Grid item md={4} p={2.5} marginLeft="0 auto">
              <Box sx={{ ...styles, fontSize: "18px" }}>Amount</Box>
              <Box mt={1} sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Items ({orderDetail.payments.quantity}) Subtotal</Typography>
                <Typography>
                  {orderDetail.payments.totalPrice} {orderDetail.payments.currency}{" "}
                </Typography>
              </Box>

              <Box mt={1} sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Taxes</Typography>
                <Typography>
                  {orderDetail.payments.totalTax} {orderDetail.payments.currency}
                </Typography>
              </Box>

              <Box mt={1} sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Shipping</Typography>
                <Typography>
                  {orderDetail.payments.shippingCost.toFixed(2)} {orderDetail.payments.currency}
                </Typography>
              </Box>

              <Box
                mt={1}
                p={2}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  backgroundColor: themeBgColor,
                  borderRadius: "8px"
                }}
              >
                <Typography>Total</Typography>
                <Typography>
                  {totalPrice()} {orderDetail.payments.currency}
                </Typography>
              </Box>
            </Grid>
          </Grid>
          {orderDetail.singlePieceParcel.map((nft, index) => (
            <Box
              key={index}
              sx={{
                backgroundColor: themeBgColorP,
                width: "98%",
                borderTopLeftRadius: "13px",
                borderTopRightRadius: "13px"
              }}
              mb={1}
            >
              <Grid container sx={{ backgroundColor: themeBgColor, justifyContent: "space-between" }} mt={2} p={2.5}>
                <Grid item md={3}>
                  <Box sx={{ ...styles, fontSize: "22px" }}>Sold by </Box>
                  <Link to={`/brand/${nft.brand.id}`} style={{ textDecoration: "none" }}>
                    <Typography mt={1} color={"#2F53FF"} variant="body1">
                      {nft.brand.name}{" "}
                    </Typography>
                  </Link>
                </Grid>
                <Grid item md={3}>
                  <Box sx={{ ...styles, fontSize: "22px" }}>Shipping Charges </Box>
                  <Typography mt={1} variant="body1">
                    {nft?.shippingCost ? Number(nft?.shippingCost * nft?.quantity).toFixed(2) : 0} {nft.currency}
                  </Typography>
                </Grid>
                <Grid item md={3}></Grid>
                <Grid item md={2}>
                  <Box sx={{ ...styles, fontSize: "22px" }}>Support Email </Box>
                  <Typography mt={1} variant="body1">
                    {nft.nft.BrandEmail}
                  </Typography>
                </Grid>
                <Grid item md={1}>
                  <Box sx={{ ...styles, fontSize: "22px" }}>Mobile </Box>
                  <Typography mt={1} variant="body1">
                    {nft.nft.BrandContactNumber}{" "}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container mt={1} p={2.5}>
                <Grid item md={12} mb={2}>
                  <Box sx={{ ...styles, fontSize: "22px" }}>{nft.shipmentStatus}</Box>
                  <Typography mt={0.5}>{nft.additionalDetails} </Typography>
                </Grid>
                <Grid item md={1.6}>
                  <img src={nft.nft.asset} alt="recImage" loading="lazy" height="150px" width="150px" />
                </Grid>
                <Grid item md={8}>
                  <Box sx={{ ...styles, fontSize: "18px" }}>{nft.nftName}</Box>
                  <ParseHtmlToText description={nft?.nft?.description} />
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }} mt={0.5}>
                    <Typography>Quantity : {nft.quantity}</Typography>
                    {nft.serialIds.map((serialId) => (
                      <Typography sx={{ color: "#2F53FF" }}>{serialId}</Typography>
                    ))}
                  </Box>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }} mt={0.2}>
                    <Typography>
                      Price : {nft.price} {nft.currency}{" "}
                    </Typography>
                    <Typography>
                      Taxes : {nft.tax} {nft.currency}{" "}
                    </Typography>
                  </Box>
                  <Typography>Bought On : {moment(orderDetail.payments.createdAt).format("DD MMMM YYYY")}</Typography>
                  {nft.deliveredAt &&
                    nft.returnRequestedAt === null &&
                    (activityStatusLoader || escrowTimeLoader ? (
                      <Box mt={2} ml={3}>
                        <CircularProgress />
                      </Box>
                    ) : (
                      <Button
                        variant="contained"
                        sx={{
                          height: "30px",
                          color: styles,
                          fontFamily: theme?.typography.appText,
                          fontWeight: "500",
                          fontSize: "10.73px",
                          marginTop: "6px",
                          backgroundColor: "#D20909",
                          "&:hover": {
                            backgroundColor: "#FF3333"
                          }
                        }}
                        onClick={() => {
                          checkEscrowTime(nft.contractAddress, nft.tokenIds, nft);
                        }}
                      >
                        Return Item
                      </Button>
                    ))}
                </Grid>
                {nft.trackingLink !== null && (
                  <Grid item md={2.4}>
                    <Link to={nft.trackingLink} target="_blank">
                      <Button
                        variant="contained"
                        sx={{
                          width: "100%",
                          height: "30px",
                          color: styles,
                          fontFamily: theme?.typography.appText,
                          fontWeight: "500",
                          fontSize: "16px",
                          marginTop: "10px"
                        }}
                      >
                        Track package
                      </Button>
                    </Link>
                  </Grid>
                )}
              </Grid>
            </Box>
          ))}

          {orderDetail.multiPieceParcels[0] &&
            orderDetail.multiPieceParcels[0].map((nft, index) => (
              <Box
                key={index}
                sx={{
                  backgroundColor: themeBgColorP,
                  width: "98%",
                  borderTopLeftRadius: "13px",
                  borderTopRightRadius: "13px"
                }}
                mb={1}
              >
                <Grid container sx={{ backgroundColor: themeBgColor, justifyContent: "space-between" }} mt={2} p={2.5}>
                  <Grid item md={3}>
                    <Box sx={{ ...styles, fontSize: "22px" }}>Sold by </Box>
                    <Link to={`/brand/${nft.brand.id}`} style={{ textDecoration: "none" }}>
                      <Typography mt={1} color={"#2F53FF"} variant="body1">
                        {nft.brand.name}{" "}
                      </Typography>
                    </Link>
                  </Grid>
                  <Grid item md={3}>
                    <Box sx={{ ...styles, fontSize: "22px" }}>Shipping Charges </Box>
                    <Typography mt={1} variant="body1">
                      {nft?.shippingCost ? Number(nft?.shippingCost * nft?.quantity).toFixed(2) : 0} {nft.currency}
                    </Typography>
                  </Grid>
                  <Grid item md={3}></Grid>
                  <Grid item md={2}>
                    <Box sx={{ ...styles, fontSize: "22px" }}>Support Email </Box>
                    <Typography mt={1} variant="body1">
                      {nft.nft.BrandEmail}
                    </Typography>
                  </Grid>
                  <Grid item md={1}>
                    <Box sx={{ ...styles, fontSize: "22px" }}>Mobile </Box>
                    <Typography mt={1} variant="body1">
                      {nft.nft.BrandContactNumber}{" "}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container mt={1} p={2.5}>
                  <Grid item md={12} mb={2}>
                    <Box sx={{ ...styles, fontSize: "22px" }}>{nft.status}</Box>
                    <Typography mt={0.5}>{nft.additionalDetails} </Typography>
                  </Grid>
                  <Grid item md={1.6}>
                    <img src={nft.nft.asset} alt="recImage" loading="lazy" height="150px" width="150px" />
                  </Grid>
                  <Grid item md={8}>
                    <Box sx={{ ...styles, fontSize: "18px" }}>{nft.nftName}</Box>
                    <ParseHtmlToText description={nft?.nft?.description} />
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }} mt={0.5}>
                      <Typography>Quantity : {nft.quantity}</Typography>
                      {nft.serialIds.map((serialId, index) => (
                        <Typography key={index} sx={{ color: "#2F53FF" }}>
                          {serialId}
                        </Typography>
                      ))}
                    </Box>
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }} mt={0.2}>
                      <Typography>
                        Price : {nft.price} {nft.currency}{" "}
                      </Typography>
                      <Typography>
                        Taxes : {nft.tax} {nft.currency}{" "}
                      </Typography>
                    </Box>
                    <Typography>
                      Bought On : {moment(orderDetail.payments.createdAt).format("DD MMMM YYYY")}{" "}
                    </Typography>
                    {nft.deliveredAt &&
                      nft.returnRequestedAt === null &&
                      (activityStatusLoader || escrowTimeLoader ? (
                        <Box mt={2} ml={3}>
                          <CircularProgress />
                        </Box>
                      ) : (
                        <Button
                          variant="contained"
                          sx={{
                            height: "30px",
                            color: styles,
                            fontFamily: theme?.typography.appText,
                            fontWeight: "500",
                            fontSize: "10.73px",
                            marginTop: "6px",
                            backgroundColor: "#D20909",
                            "&:hover": {
                              backgroundColor: "#FF3333"
                            }
                          }}
                          onClick={() => {
                            checkEscrowTime(nft.contractAddress, nft.tokenIds, nft);
                          }}
                        >
                          Return Item
                        </Button>
                      ))}
                  </Grid>

                  <Grid item md={2.4}>
                    <Button
                      variant="contained"
                      sx={{
                        width: "100%",
                        height: "30px",
                        color: styles,
                        fontFamily: theme?.typography.appText,
                        fontWeight: "500",
                        fontSize: "16px",
                        marginTop: "10px"
                      }}
                    >
                      Track package
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            ))}
        </>
      )}
    </Box>
  );
};

export default MyActivityDetailMint;
