import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Box } from "@mui/system";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  useTheme,
  DialogTitle,
  Grid,
  IconButton,
  InputLabel,
  TextField,
  Typography,
  Select,
  MenuItem,
  DialogContentText,
  Alert
} from "@mui/material";
import { Icons } from "shared/Icons/Icons";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getBrandActivityDetail,
  getBrandActivityStatus,
  updateBrandActivityStatus,
  updateDetailAndLinkActivity
} from "redux/brandActivityDashboard/actions";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import moment from "moment";
import { getAddressValuesString, getFullAddress, getUserEmail } from "utils/combineAddress";
import { useFormik } from "formik";
import CloseIcon from "@mui/icons-material/Close";
import * as Yup from "yup";
import { getDownloadReceiptPdf } from "redux/activity/actions";
import { ethers } from "ethers";
import GalileoEscrow from "contractAbi/GalileoEscrow.js";
import { toast } from "react-toastify";
import { getShippingMethod } from "utils/utilFunctions";
import { useWeb3 } from "utils/MagicProvider";
import { ParseHtmlToText } from "views/pages/user/productDetails/component/parseHtmlToText/parseHtmlToText";
import { loggerApi } from "utils/loggerApi";
import { BLOCKCHAIN_ACTIONS } from "utils/constants";

const ActivityMintDetail = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orderId } = useParams();
  const [loader, setLoader] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [trackLinkLoader, setTrackLinkLoader] = useState(false);
  const [statusLoader, setStatusLoader] = useState(false);
  const [detailLoader, setDetailLoader] = useState(false);
  const [isStatusDeliverModal, setIsStatusDeliverModal] = useState(false);
  const [isTrackingLinkOpen, setIsTrackinLinkOpen] = useState(false);
  const [nftData, setNftData] = useState({});
  const orderDetail = useSelector((state) => state.brandActivityReducer.brandActivityDetail);
  const activityStatusLoader = useSelector((state) => state.brandActivityReducer.activityStatusLoader);
  const orderDetailStatus = useSelector((state) => state.brandActivityReducer.brandActivityStatus);
  const { provider, signer } = useWeb3();
  const color = theme.palette.mode === "light" ? "black" : "white";
  const desiredStatuses = ["Order Placed", "Shipped", "Processing", "Delivered"];
  const returnStatuses = ["Processing Return", "Request Return", "Returned and Refunded", "Delivered"];
  const showOptions = !returnStatuses.includes(orderDetail?.singlePieceParcel[0]?.shipmentStatus);
  const walletAddress = useSelector((state) => state?.auth?.user?.walletAddress);
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
    fontFamily: theme?.typography.appText
  };
  let InputProps = {
    style: { borderRadius: 0, background: "inherit", border: "1px solid #757575" }
  };
  let inputStyles = {
    "& fieldset": { border: "none" },
    ".MuiInputBase-input": {
      padding: "10px",
      color: color
    }
  };
  const downloadReceiptHandler = () => {
    dispatch(getDownloadReceiptPdf(orderId));
  };
  const statusValidationSchema = Yup.object({
    status: Yup.string().required().max(42).min(3)
  });
  const statusSubmitHandler = () => {
    setStatusLoader(true);
    if (formik.values.status !== "Delivered") {
      formik.submitForm();
    } else {
      setIsStatusDeliverModal(true);
    }
  };
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      status: ""
    },
    validationSchema: statusValidationSchema,
    onSubmit: async (values) => {
      try {
        const dispatchRequest = {
          data: {
            orderItemIds: nftData.itemIds,
            shipmentStatus: values.status,
            orderNumber: orderDetail?.payments?.orderNumber,
            chainId: nftData.nft.chainId,
            contractAddress: orderDetail?.payments?.contractAddress,
            tokenIds: orderDetail?.payments?.tokenIds,
            middleware: true,
            blockchainAction: BLOCKCHAIN_ACTIONS.DELIVERED
          },
          setStatusLoader,
          setIsModalOpen,
          formik,
          setNftData
        };
        if (values.status === "Delivered") {
          const escrow = new ethers.Contract(GalileoEscrow.address, GalileoEscrow.abi, signer);
          // const response = await window?.ethereum?.request({ method: "eth_requestAccounts" });
          // const addressed = utils?.getAddress(response[0]);
          const addressed = await signer.getAddress();
          console.log("addressed", addressed);
          let asset = await escrow.getAssetData(
            orderDetail?.payments?.contractAddress,
            orderDetail?.payments?.tokenIds[0]
          );
          const escrowTime = Number(asset.time.toString());
          if (escrowTime !== 0) {
            toast.error("Item already delivered");
            setStatusLoader(false);
            return;
          }
          if (nftData.nft.isUpdateDeliveryStatus) {
            dispatch(updateBrandActivityStatus(dispatchRequest));
          } else {
            if (walletAddress.toLowerCase() !== addressed.toLowerCase()) {
              toast.error("please connect your registered wallet address");
              setStatusLoader(false);
              return;
            }
            const endpoint = "/update-shipment-status";
            const method = "POST";
            await loggerApi(endpoint, method, dispatchRequest?.data);
            const { hash: transactionHash, ...rest } = await escrow.setEscrowTime(
              orderDetail?.payments?.contractAddress,
              orderDetail?.payments?.tokenIds
            );
            dispatchRequest.data.transactionHash = transactionHash;
            delete dispatchRequest.data.middleware;
            dispatch(updateBrandActivityStatus(dispatchRequest));
            const frontEndReceipt = await rest.wait();
            const requiredReceiptData = {
              transactionHash: frontEndReceipt?.transactionHash,
              status: frontEndReceipt?.status
            };
            dispatchRequest.data.frontEndReceipt = requiredReceiptData;
            delete dispatchRequest.data.blockchainAction;
            dispatch(updateBrandActivityStatus(dispatchRequest));
          }
        } else {
          dispatch(updateBrandActivityStatus(dispatchRequest));
        }
      } catch (error) {
        setStatusLoader(false);
        if (provider?.provider?.isMagic && !error?.reason) return;
        toast.error(error.reason);
      }
    }
  });
  const detailValidationSchema = Yup.object({
    additionalDetails: Yup.string().trim().required().max(1000).min(3)
  });
  const formikAddistionalDetail = useFormik({
    enableReinitialize: true,
    initialValues: {
      additionalDetails: ""
    },
    validationSchema: detailValidationSchema,
    onSubmit: (values) => {
      setDetailLoader(true);
      dispatch(
        updateDetailAndLinkActivity({
          data: {
            orderNumber: orderDetail.payments.orderNumber,
            orderItemIds: nftData.itemIds,
            shipmentStatus: nftData.shipmentStatus,
            additionalDetails: values.additionalDetails,
            trackingLink: nftData.trackingLink
          },
          setIsModalOpen: setIsDetailModalOpen,
          formik: formikAddistionalDetail,
          setNftData,
          setDetailLoader
        })
      );
    }
  });
  const trackingValidationSchema = Yup.object({
    trackingLink: Yup.string()
      .required("Link is required")
      .matches(/^(ftp|http|https):\/\/[^ "]+$/, "Invalid URL format. Please enter a valid URL.")
  });
  const formikTrackingLink = useFormik({
    enableReinitialize: true,
    initialValues: {
      trackingLink: ""
    },
    validationSchema: trackingValidationSchema,
    onSubmit: (values) => {
      setTrackLinkLoader(true);
      dispatch(
        updateDetailAndLinkActivity({
          data: {
            orderNumber: orderDetail.payments.orderNumber,
            orderItemIds: nftData.itemIds,
            shipmentStatus: nftData.shipmentStatus,
            additionalDetails: nftData.additionalDetails,
            trackingLink: values.trackingLink
          },
          setIsModalOpen: setIsTrackinLinkOpen,
          formik: formikTrackingLink,
          setNftData,
          setTrackLinkLoader
        })
      );
    }
  });

  useEffect(() => {
    dispatch(getBrandActivityDetail({ orderId, setLoader }));
    dispatch(getBrandActivityStatus());
    // eslint-disable-next-line
  }, [orderId]);

  let totalPrice = () => {
    let price = orderDetail?.payments?.totalPrice ? Number(orderDetail.payments.totalPrice) : 0;
    let cost = orderDetail?.payments?.shippingCost ? Number(orderDetail.payments.shippingCost) : 0;
    let tax = orderDetail?.payments?.totalTax ? Number(orderDetail.payments.totalTax) : 0;
    return (price + cost + tax).toFixed(2);
  };

  const address = getFullAddress(orderDetail?.payments?.shippingAddress);

  return (
    <>
      <Dialog aria-labelledby="add-status-dialog" open={isModalOpen} maxWidth="sm" fullWidth={true}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="add-status-dialog" variant="h2" className="app-text">
          Add Status
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => {
            setIsModalOpen(false);
            formik.resetForm();
            setNftData({});
          }}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <InputLabel sx={{ color: color, marginBottom: "2px" }} className="app-text">
              {" "}
              New Status
            </InputLabel>
            <Select
              fullWidth
              name="status"
              id="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              error={formik.touched.status && Boolean(formik.errors.status)}
              sx={{ ...inputStyles }}
              inputProps={{ ...InputProps }}
              MenuProps={{ PaperProps: { style: { maxHeight: 250 } } }}
            >
              {orderDetailStatus &&
                orderDetailStatus
                  .filter((option) => desiredStatuses.includes(option))
                  .map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
            </Select>
          </DialogContent>

          <DialogActions sx={{ mr: 3 }}>
            {statusLoader ? (
              <CircularProgress />
            ) : (
              <Button autoFocus variant="contained" onClick={statusSubmitHandler} className="app-text">
                Save
              </Button>
            )}
          </DialogActions>
        </form>
      </Dialog>
      <Dialog aria-labelledby="add-status-dialog" open={isDetailModalOpen} maxWidth="sm" fullWidth={true}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="add-status-dialog" variant="h2" className="app-text">
          Add Detail
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => {
            setIsDetailModalOpen(false);
            formikAddistionalDetail.resetForm();
            setNftData({});
            setDetailLoader(false);
          }}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
        <form onSubmit={formikAddistionalDetail.handleSubmit}>
          <DialogContent>
            <InputLabel sx={{ color: color, marginBottom: "2px" }} className="app-text">
              {" "}
              Detail
            </InputLabel>
            <TextField
              sx={{ ...inputStyles }}
              InputProps={{ ...InputProps }}
              fullWidth
              name="additionalDetails"
              placeholder="Additional Detail"
              id="additionalDetails"
              value={formikAddistionalDetail.values.additionalDetails}
              onChange={formikAddistionalDetail.handleChange}
              error={
                formikAddistionalDetail.touched.additionalDetails &&
                Boolean(formikAddistionalDetail.errors.additionalDetails)
              }
              helperText={
                formikAddistionalDetail.touched.additionalDetails && formikAddistionalDetail.errors.additionalDetails
              }
            />
          </DialogContent>
          <DialogActions>
            {detailLoader ? (
              <CircularProgress />
            ) : (
              <Button type="submit" autoFocus variant="contained" className="app-text">
                Save
              </Button>
            )}
          </DialogActions>
        </form>
      </Dialog>
      <Dialog aria-labelledby="add-status-dialog" open={isTrackingLinkOpen} maxWidth="sm" fullWidth={true}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="add-status-dialog" variant="h2" className="app-text">
          Add Traking Link
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => {
            setIsTrackinLinkOpen(false);
            formikTrackingLink.resetForm();
            setNftData({});
          }}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
        <form onSubmit={formikTrackingLink.handleSubmit}>
          <DialogContent>
            <InputLabel sx={{ color: color, marginBottom: "2px" }} className="app-text">
              {" "}
              Tracking Link
            </InputLabel>
            <TextField
              sx={{ ...inputStyles }}
              InputProps={{ ...InputProps }}
              fullWidth
              name="trackingLink"
              placeholder="Tracking Link"
              id="trackingLink"
              value={formikTrackingLink.values.trackingLink}
              onChange={formikTrackingLink.handleChange}
              error={formikTrackingLink.touched.trackingLink && Boolean(formikTrackingLink.errors.trackingLink)}
              helperText={formikTrackingLink.touched.trackingLink && formikTrackingLink.errors.trackingLink}
            />
          </DialogContent>
          <DialogActions>
            <Button type="submit" autoFocus variant="contained" className="app-text">
              {trackLinkLoader ? "Saving..." : "Save"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog
        open={isStatusDeliverModal}
        onClose={() => setIsStatusDeliverModal(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm delivered?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This cannot be undone. make sure to set the status as delivered only after the item has successfully been
            delivered.
          </DialogContentText>
          <Alert severity="warning" sx={{ marginTop: "5px" }}>
            False status changes to “Delivered” may lead to consequences.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setIsStatusDeliverModal(false);
              setStatusLoader(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setIsStatusDeliverModal(false);
              formik.submitForm();
            }}
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Box sx={{ display: "flex", alignItems: "center" }} mt={2}>
        <ArrowBackIosIcon
          onClick={() => {
            navigate("/activity");
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
              <Grid item md={5}>
                <Box sx={{ ...styles, fontSize: "22px" }}>Details</Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }} mt={2}>
                  <Typography variant="body1" sx={{ fontWeight: "400", fontFamily: theme?.typography.appText }}>
                    Redeemed on {moment(orderDetail.payments.createdAt).format("DD MMMM YYYY")}
                  </Typography>
                  <Box as="span" sx={{ borderLeft: "1px solid #2FC1FF" }} ml={2}></Box>
                  <Typography variant="body1" sx={{ fontWeight: "400", fontFamily: theme?.typography.appText }}>
                    Order# {orderDetail.payments.orderNumber}
                  </Typography>
                </Box>
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
            <Grid item md={3} p={2.5}>
              <Box sx={{ ...styles, fontSize: "22px" }}>Billing Address</Box>
              <Typography mt={1.5} variant="body2">
                {getAddressValuesString(orderDetail?.payments?.billingAddress)}
              </Typography>
            </Grid>
            <Grid item md={3} p={2.5}>
              <Box sx={{ ...styles, fontSize: "22px" }}>Shipping Address</Box>
              <Typography mt={1.5} variant="body2">
                <p style={{ margin: 0 }}>{address.fullName}</p>
                <p style={{ margin: 0 }}>{getUserEmail(orderDetail)}</p>
                <p style={{ margin: 0 }}>{address.houseNoArea}</p>
                <p style={{ margin: 0 }}>{address.landmark}</p>
                <p style={{ margin: 0 }}>{address.cityStatePin}</p>
                <p style={{ margin: 0 }}>{address.country}</p>
                {/* {getShippingValuesString(
                  orderDetail?.payments?.shippingAddress,
                  orderDetail?.singlePieceParcel[0]?.user.email,
                  orderDetail?.singlePieceParcel[0]?.user?.firstName,
                  orderDetail?.singlePieceParcel[0]?.nft?.shippingCalculationMethod
                )} */}
              </Typography>
            </Grid>
            <Grid item md={2}></Grid>
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
                <Typography>Shipping {getShippingMethod(orderDetail)}</Typography>
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
          {orderDetail.singlePieceParcel.length > 0 &&
            orderDetail.singlePieceParcel.map((nft, index) => (
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
                      {nft?.shippingCost ? Number(nft?.shippingCost).toFixed(2) : 0} {nft.currency}
                    </Typography>
                  </Grid>
                  <Grid item md={1}></Grid>
                  <Grid item md={3}>
                    <Box sx={{ ...styles, fontSize: "22px" }}>Support Email </Box>
                    <Typography mt={1} variant="body1">
                      {nft.nft.BrandEmail}
                    </Typography>
                  </Grid>
                  <Grid item md={2}>
                    <Box sx={{ ...styles, fontSize: "22px" }}>Mobile </Box>
                    <Typography mt={1} variant="body1">
                      {nft.nft.BrandContactNumber}{" "}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container mt={1} p={2.5}>
                  <Grid item md={12} mb={2}>
                    {!activityStatusLoader ? (
                      <Box sx={{ ...styles, fontSize: "22px", display: "flex", alignItems: "center" }}>
                        {nft.shipmentStatus}
                        {showOptions && (
                          <Box
                            as="div"
                            ml={1}
                            sx={{ cursor: "pointer" }}
                            onClick={() => {
                              setIsModalOpen(true);
                              setNftData(nft);
                              formik.setFieldValue("status", nft.shipmentStatus);
                            }}
                          >
                            {Icons.activityEditIcon}
                          </Box>
                        )}
                      </Box>
                    ) : (
                      <Box mt={2} ml={3}>
                        <CircularProgress />
                      </Box>
                    )}

                    <Typography
                      mt={1}
                      sx={{ display: "flex", alignItems: "center", wordBreak: "break-all", textAlign: "justify" }}
                    >
                      {nft?.additionalDetails ? nft?.additionalDetails : "Add additional message"}
                      <Box
                        as="div"
                        ml={1}
                        sx={{ cursor: "pointer" }}
                        onClick={() => {
                          setIsDetailModalOpen(true);
                          setNftData(nft);
                          formikAddistionalDetail.setFieldValue("additionalDetails", nft.additionalDetails);
                        }}
                      >
                        {Icons.activityEditIcon}
                      </Box>
                    </Typography>
                  </Grid>
                  <Grid item md={1.6}>
                    <img src={nft.nft.asset} alt="recImage" loading="lazy" height="150px" width="150px" />
                  </Grid>
                  <Grid item md={7} ml={1}>
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
                    <Typography>
                      Bought On : {moment(orderDetail.payments.createdAt).format("DD MMMM YYYY")}{" "}
                    </Typography>
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
                      onClick={() => {
                        setIsTrackinLinkOpen(true);
                        setNftData(nft);
                        formikTrackingLink.setFieldValue("trackingLink", nft.trackingLink);
                      }}
                    >
                      Add Tracking Link
                    </Button>
                    {nft?.trackingLink ? (
                      <Box sx={{ textAlign: "center" }} mt={0.3}>
                        <Link to={nft.trackingLink} target="_blank" style={{ color: "white", marginTop: "5px" }}>
                          {" "}
                          Previous tracking link
                        </Link>
                      </Box>
                    ) : null}
                  </Grid>
                </Grid>
              </Box>
            ))}
          {orderDetail.multiPieceParcels.length > 0 &&
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
                  <Grid item md={1}></Grid>
                  <Grid item md={3}>
                    <Box sx={{ ...styles, fontSize: "22px" }}>Support Email </Box>
                    <Typography mt={1} variant="body1">
                      {nft.nft.BrandEmail}
                    </Typography>
                  </Grid>
                  <Grid item md={2}>
                    <Box sx={{ ...styles, fontSize: "22px" }}>Mobile </Box>
                    <Typography mt={1} variant="body1">
                      {nft.nft.BrandContactNumber}{" "}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container mt={1} p={2.5}>
                  <Grid item md={12} mb={2}>
                    {!activityStatusLoader ? (
                      <Box sx={{ ...styles, fontSize: "22px", display: "flex", alignItems: "center" }}>
                        {nft.shipmentStatus}
                        {!returnStatuses.includes(nft?.shipmentStatus) && (
                          <Box
                            as="div"
                            ml={1}
                            sx={{ cursor: "pointer" }}
                            onClick={() => {
                              setIsModalOpen(true);
                              setNftData(nft);
                              formik.setFieldValue("status", nft.shipmentStatus);
                            }}
                          >
                            {Icons.activityEditIcon}
                          </Box>
                        )}
                      </Box>
                    ) : (
                      <Box mt={2} ml={3}>
                        <CircularProgress />
                      </Box>
                    )}
                    <Typography mt={1} sx={{ display: "flex", alignItems: "center" }}>
                      {nft?.additionalDetails ? nft?.additionalDetails : "Add additional message"}
                      <Box
                        as="div"
                        ml={1}
                        sx={{ cursor: "pointer" }}
                        onClick={() => {
                          setIsDetailModalOpen(true);
                          setNftData(nft);
                          formikAddistionalDetail.setFieldValue("additionalDetails", nft.additionalDetails);
                        }}
                      >
                        {Icons.activityEditIcon}
                      </Box>
                    </Typography>
                  </Grid>
                  <Grid item md={1.6}>
                    <img src={nft.nft.asset} alt="recImage" loading="lazy" height="150px" width="150px" />
                  </Grid>
                  <Grid item md={7} ml={1}>
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
                    <Typography>
                      Bought On : {moment(orderDetail.payments.createdAt).format("DD MMMM YYYY")}{" "}
                    </Typography>
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
                      onClick={() => {
                        setIsTrackinLinkOpen(true);
                        setNftData(nft);
                        formikTrackingLink.setFieldValue("trackingLink", nft.trackingLink);
                      }}
                    >
                      Add Tracking Link
                    </Button>
                    {nft?.trackingLink ? (
                      <Box sx={{ textAlign: "center" }} mt={0.3}>
                        <Link to={nft.trackingLink} target="_blank" style={{ color: "white", marginTop: "5px" }}>
                          Previous tracking link
                        </Link>
                      </Box>
                    ) : null}
                  </Grid>
                </Grid>
              </Box>
            ))}
        </>
      )}
    </>
  );
};

export default ActivityMintDetail;
