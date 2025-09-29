import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  useTheme,
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  IconButton,
  InputLabel,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Select,
  MenuItem
} from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getMyActivitySubAdminDetail } from "redux/subAdmin/actions";
import { Icons } from "shared/Icons/Icons";
import { useFormik } from "formik";
import { getAddressValuesString } from "utils/combineAddress";
import MyActivityReturnDialog from "./MyActivityReturnDialog";
import moment from "moment";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CloseIcon from "@mui/icons-material/Close";
import * as Yup from "yup";
import { updateBrandActivityStatus } from "redux/brandActivityDashboard/actions";

const MyActivityDetailCard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(true);
  const [refundModal, setRefundModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [parcelToShow, setParcelToShow] = useState({});

  const color = theme.palette.mode === "light" ? "black" : "white";
  const orderDetail = useSelector((state) => state.subAdminReducer.myActivitySubadminDetail);
  const activityStatusLoader = useSelector((state) => state.brandActivityReducer.activityStatusLoader);

  // eslint-disable-next-line no-unused-vars
  const [nftData, setNftData] = useState([]);
  let inputStyles = {
    "& fieldset": { border: "none" },
    ".MuiInputBase-input": {
      padding: "10px",
      color: color,
      fontFamily: theme?.typography.appText
    }
  };
  let InputProps = {
    style: { borderRadius: 0, background: "inherit", border: "1px solid #757575" }
  };
  const styles = {
    color: theme.palette.mode === "dark" ? "#FFFFFF" : "#252B2F",
    fontWeight: "500",
    fontFamily: theme?.typography.appText
  };
  const themeBgColorP = {
    backgroundColor: theme.palette.mode === "dark" ? "#181C1F" : "#E8E8E8"
  };
  const themeBgColor = {
    backgroundColor: theme.palette.mode === "dark" ? "#252B2F" : "#fff",
    borderRadius: "13px"
  };
  const statusValidationSchema = Yup.object({
    status: Yup.string().required().max(42).min(3)
  });
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      status: ""
    },
    validationSchema: statusValidationSchema,
    onSubmit: (values) => {
      dispatch(
        updateBrandActivityStatus({
          data: {
            orderItemIds: parcelToShow?.itemIds,
            shipmentStatus: values.status,
            orderNumber: orderDetail?.payments?.orderNumber
          },
          setIsModalOpen,
          formik,
          setNftData
        })
      );
    }
  });
  const CustomTableCell = ({ children }) => (
    <TableCell
      style={{
        color: "#fff",
        fontSize: "16px",
        paddingTop: "6px",
        paddingBottom: "6px",
        paddingLeft: "0px",
        margin: "0",
        border: "none"
      }}
    >
      {children}
    </TableCell>
  );
  useEffect(() => {
    dispatch(getMyActivitySubAdminDetail({ orderId, setLoader }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  useEffect(() => {
    if (!loader && orderDetail?.singlePieceParcel?.length) {
      setParcelToShow(orderDetail?.singlePieceParcel[0]);
    }

    if (!loader && orderDetail?.multiPieceParcels?.length) {
      let parcel = orderDetail?.multiPieceParcels[0];
      setParcelToShow(parcel[0]);
    }
  }, [loader, orderDetail]);

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }} mt={2}>
        <ArrowBackIosIcon
          onClick={() => {
            navigate("/activity");
          }}
          sx={{ color: "#2F53FF", cursor: "pointer" }}
        />
        <Typography variant="h2" color="info" className="app-text">
          Back
        </Typography>
      </Box>
      {loader ? (
        <Box mt={2} ml={3}>
          <CircularProgress />
        </Box>
      ) : (
        parcelToShow?.id && (
          <Box
            sx={{
              backgroundColor: themeBgColorP,
              width: "98%",
              borderTopLeftRadius: "13px",
              borderTopRightRadius: "13px"
            }}
            mb={1}
          >
            <Dialog aria-labelledby="add-status-dialog" open={isModalOpen} maxWidth="sm" fullWidth={true}>
              <DialogTitle sx={{ m: 0, p: 2 }} id="add-status-dialog" variant="h2" className="app-text">
                Add Status
              </DialogTitle>
              <IconButton
                aria-label="close"
                onClick={() => {
                  setIsModalOpen(false);
                  formik.resetForm();
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
                    {parcelToShow?.shipmentStatus === "Processing Return" ? (
                      <MenuItem value="Request Return" className="app-text">
                        Request Return
                      </MenuItem>
                    ) : parcelToShow?.shipmentStatus === "Request Return" ? (
                      <MenuItem value="Processing Return" className="app-text">
                        Processing Return
                      </MenuItem>
                    ) : (
                      <MenuItem></MenuItem>
                    )}
                  </Select>
                </DialogContent>
                <DialogActions>
                  <Button type="submit" autoFocus variant="contained" className="app-text">
                    Save
                  </Button>
                </DialogActions>
              </form>
            </Dialog>
            <MyActivityReturnDialog open={refundModal} setOpen={setRefundModal} nft={parcelToShow} />
            <Grid
              container
              sx={{ backgroundColor: themeBgColor, justifyContent: "space-between" }}
              mt={2}
              px={2.5}
              pb={2}
              pt={3}
            >
              <Grid item md={2}>
                <Box sx={{ ...styles, fontSize: "22px" }}>Sold by </Box>
                <Link to={`/brand/${parcelToShow?.BrandId}`} style={{ textDecoration: "none" }}>
                  <Typography mt={2} color={"#2F53FF"} variant="body1" className="app-text">
                    {parcelToShow?.brand.name}
                  </Typography>
                </Link>
              </Grid>
              <Grid item md={3}>
                <Box sx={{ ...styles, fontSize: "22px" }}>Shipping Charges </Box>
                <Typography mt={2} variant="body1" className="app-text">
                  {orderDetail?.payments?.shippingCost ? Number(orderDetail?.payments?.shippingCost).toFixed(2) : 0}{" "}
                  {orderDetail?.payments?.currency}
                </Typography>
              </Grid>
              <Grid item md={3}>
                <Box sx={{ ...styles, fontSize: "22px" }}>Purchased Date </Box>
                <Typography mt={2} variant="body1" className="app-text">
                  {orderDetail?.payments?.createdAt && moment(orderDetail.payments.createdAt).format("DD MMMM YYYY")}
                </Typography>
              </Grid>
              <Grid item md={3}>
                <Box sx={{ ...styles, fontSize: "22px" }}>Return Request </Box>
                <Typography mt={2} variant="body1" className="app-text">
                  {parcelToShow?.deliveredAt && moment(parcelToShow?.deliveredAt).format("DD MMMM YYYY")}
                </Typography>
              </Grid>
            </Grid>
            <Grid container mt={1} p={2.5} pr={0}>
              <Grid item md={12} mb={2}>
                <Box sx={{ ...styles, fontSize: "22px", display: "flex", alignItems: "center" }}>
                  {parcelToShow?.shipmentStatus}
                  {parcelToShow?.shipmentStatus === "Returned and Refunded" ? null : (
                    <Box
                      as="div"
                      ml={1}
                      sx={{ cursor: "pointer" }}
                      onClick={() => {
                        setIsModalOpen(true);
                      }}
                    >
                      {Icons.activityEditIcon}
                    </Box>
                  )}
                </Box>
                <Typography variant="subtitle2" mt={1} className="app-text">
                  {parcelToShow?.additionalDetails}
                </Typography>
              </Grid>
              <Grid item md={2} lg={1.5}>
                <img src={parcelToShow?.nft?.asset} alt="recImage" loading="lazy" width="100%" />
              </Grid>
              <Grid item md={6} ml={1} lg={5.5}>
                <Box sx={{ ...styles, fontSize: "18px" }}>{parcelToShow?.nft?.name}</Box>
                <Typography variant="subtitle2" mt={2} className="app-text">
                  {parcelToShow?.nft?.description}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }} mt={0.5}>
                  <Typography variant="subtitle2" className="app-text">
                    Quantity : {parcelToShow?.quantity}
                  </Typography>
                  {parcelToShow?.serialIds.map((serialId, index) => (
                    <Typography key={index} variant="subtitle2" sx={{ color: "#2F53FF" }} className="app-text">
                      {serialId}
                    </Typography>
                  ))}
                </Box>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }} mt={0.2}>
                  <Typography variant="subtitle2" className="app-text">
                    Price : {parcelToShow?.price} {parcelToShow?.currency}
                  </Typography>
                  <Typography variant="subtitle2" className="app-text">
                    Taxes : {parcelToShow?.tax} {parcelToShow?.currency}
                  </Typography>
                </Box>
                {/* <Typography variant="subtitle2" className='app-text'>
    Bought On : {moment(orderDetail.payments.createdAt).format("DD MMMM YYYY")}{" "}
  </Typography> */}
              </Grid>

              <Grid item md={3} lg={4}>
                <Typography variant="h3" fontSize="20px" fontWeight="400" pb={1} className="app-text">
                  Requested By
                </Typography>
                <Typography variant="h3" fontSize="20px" fontWeight="450" color="#fff" pb={1} className="app-text">
                  {parcelToShow?.user?.firstName} {parcelToShow?.user?.lastName}
                </Typography>
                <Typography
                  variant="h3"
                  fontSize="20px"
                  fontWeight="450"
                  color="#fff"
                  pb={1}
                  sx={{ wordBreak: "break-word" }}
                  className="app-text"
                >
                  {parcelToShow?.user?.email}
                </Typography>

                <Typography
                  className="app-text"
                  variant="h3"
                  fontSize="20px"
                  fontWeight="450"
                  color="#fff"
                  sx={{ wordBreak: "break-word" }}
                >
                  {parcelToShow?.user?.walletAddress}
                </Typography>
                <Typography
                  variant="h3"
                  fontSize="20px"
                  fontWeight="450"
                  color="#fff"
                  sx={{ wordBreak: "break-word", mt: "5px" }}
                  className="app-text"
                >
                  {getAddressValuesString(orderDetail?.payments?.billingAddress)}
                </Typography>
              </Grid>
              <Grid item md={6.3}>
                <Grid container>
                  <Grid item md={10}>
                    {parcelToShow?.shipmentStatus === "Returned and Refunded" ? (
                      <>
                        <Typography
                          variant="subtitle2"
                          fontSize="24px"
                          fontWeight="700"
                          pt={0.5}
                          color="#fff"
                          className="app-text"
                        >
                          Refund details
                        </Typography>
                        <TableContainer component={Paper}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <CustomTableCell>Amount</CustomTableCell>
                                <CustomTableCell className="app-text">
                                  {orderDetail?.returnDetails?.refundedAmount} {orderDetail?.payments?.currency}
                                </CustomTableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <CustomTableCell className="app-text">Taxes </CustomTableCell>
                                <CustomTableCell className="app-text">
                                  {orderDetail?.returnDetails?.refundedTax} {orderDetail?.payments?.currency}
                                </CustomTableCell>
                              </TableRow>
                              <TableRow>
                                <CustomTableCell className="app-text">Shipping Charges</CustomTableCell>
                                <CustomTableCell className="app-text">
                                  {orderDetail?.returnDetails?.refundedShippingCost
                                    ? Number(orderDetail?.returnDetails?.refundedShippingCost).toFixed(2)
                                    : 0}{" "}
                                  {orderDetail?.payments?.currency}
                                </CustomTableCell>
                              </TableRow>
                              <TableRow>
                                <CustomTableCell className="app-text">Wallet address</CustomTableCell>
                                <CustomTableCell className="app-text">
                                  <Tooltip title={orderDetail?.returnDetails?.transferWalletAddress}>
                                    {orderDetail?.returnDetails?.transferWalletAddress &&
                                      orderDetail?.returnDetails?.transferWalletAddress.slice(0, 5) +
                                        "..." +
                                        orderDetail?.returnDetails?.transferWalletAddress.slice(39, 42)}
                                  </Tooltip>
                                </CustomTableCell>
                              </TableRow>
                              <TableRow>
                                <CustomTableCell>Additional Note</CustomTableCell>
                                <CustomTableCell className="app-text">
                                  <Tooltip title={orderDetail?.returnDetails?.refundedNote}>
                                    {orderDetail?.returnDetails?.refundedNote}
                                  </Tooltip>
                                </CustomTableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </>
                    ) : (
                      <>
                        <Typography
                          variant="subtitle2"
                          fontSize="17px"
                          fontWeight="400"
                          color="#fff"
                          className="app-text"
                        >
                          Reason : {orderDetail?.returnDetails?.returnReason}
                        </Typography>
                        <Box as="div">
                          <Typography
                            className="app-text"
                            mt={2}
                            variant="subtitle2"
                            fontSize="17px"
                            fontWeight="800"
                            color="#fff"
                          >
                            Next Steps
                          </Typography>
                          <Typography
                            className="app-text"
                            variant="subtitle2"
                            fontSize="17px"
                            fontWeight="400"
                            pt={0.5}
                            color="#fff"
                          >
                            1. Contact the buyer via email for the returning of the item
                          </Typography>
                          <Typography
                            className="app-text"
                            variant="subtitle2"
                            fontSize="17px"
                            fontWeight="400"
                            pt={0.5}
                            color="#fff"
                          >
                            2. CC hello@galileoprotocol.io in all the conversations with the buyer
                          </Typography>
                          <Typography
                            className="app-text"
                            variant="subtitle2"
                            fontSize="17px"
                            fontWeight="400"
                            pt={0.5}
                            color="#fff"
                          >
                            3. Once the item is received, initiate refund appropriately
                          </Typography>
                        </Box>
                      </>
                    )}
                  </Grid>
                </Grid>
              </Grid>
              {orderDetail?.returnDetails?.nftStatusAfterReturn == null || orderDetail?.returnDetails === null ? (
                activityStatusLoader ? (
                  <Box mt={2} ml={"6rem"}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Grid item md={3} mt={3} display="flex" alignItems="center" justifyContent="center">
                    <Button
                      className="app-text"
                      variant="contained"
                      mt={4}
                      sx={{ width: "80%" }}
                      onClick={() => setRefundModal(true)}
                    >
                      Accept Return and Refund
                    </Button>
                  </Grid>
                )
              ) : null}
              {parcelToShow?.shipmentStatus === "Returned and Refunded" && (
                <Grid item md={3} mt={3} display="flex" alignItems="center" justifyContent="center">
                  <Link target="_blank" to={orderDetail?.returnDetails?.transactionHash}>
                    <Button className="app-text" variant="contained" mt={4}>
                      Transaction Link
                    </Button>
                  </Link>
                </Grid>
              )}
            </Grid>
          </Box>
        )
      )}
    </>
  );
};

export default MyActivityDetailCard;
