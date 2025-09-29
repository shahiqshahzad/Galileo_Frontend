import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import {
  Box,
  Grid,
  Typography,
  useTheme,
  CircularProgress,
  Button,
  TableContainer,
  Paper,
  TableCell,
  Table,
  Tooltip,
  TableBody,
  TableHead,
  TableRow
} from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { getReturnDetail } from "redux/activity/actions";
import { useDispatch, useSelector } from "react-redux";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const ReturnCardItem = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(true);
  const [parcelToShow, setParcelToShow] = useState({});

  const orderDetail = useSelector((state) => state.allActivityReducer.orderDetail);
  const styles = {
    color: theme.palette.mode === "dark" ? "#FFFFFF" : "#252B2F",
    fontWeight: "500",
    fontFamily: "DM Sans"
  };
  const themeBgColorP = {
    backgroundColor: theme.palette.mode === "dark" ? "#181C1F" : "#E8E8E8"
  };
  const themeBgColor = {
    backgroundColor: theme.palette.mode === "dark" ? "#252B2F" : "#fff",
    borderRadius: "13px"
  };
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
  function formatAddress(address) {
    let formattedAddress = `${address.addressLine1}\n`;

    if (address.addressLine2) {
      formattedAddress += `${address.addressLine2}\n`;
    }

    formattedAddress += `${address.city}, ${address.country} ${address.postalCode}\n`;

    if (address.state) {
      formattedAddress += `${address.state}\n`;
    }

    return formattedAddress;
  }
  useEffect(() => {
    dispatch(getReturnDetail({ orderId, setLoader }));
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
            <Grid
              container
              sx={{ backgroundColor: themeBgColor, justifyContent: "space-between" }}
              mt={2}
              px={2.5}
              pb={2}
              pt={3}
            >
              <Grid item md={5}>
                <Box sx={{ ...styles, fontSize: "22px" }}>Sold by </Box>
                <Link to={`/brand/${parcelToShow?.BrandId}`} style={{ textDecoration: "none" }}>
                  <Typography mt={2} color={"#2F53FF"} variant="body1">
                    {/* {nft.brand.name} */}
                    {parcelToShow?.brand.name}
                  </Typography>
                </Link>
              </Grid>
              <Grid item md={3}>
                <Box sx={{ ...styles, fontSize: "22px" }}>Shipping Charges </Box>
                <Typography mt={2} variant="body1">
                  {/* {nft.shippingCost} {nft.currency} */}
                  {orderDetail?.payments?.shippingCost
                    ? Number(orderDetail?.payments?.shippingCost).toFixed(2)
                    : 0}{" "}
                  {orderDetail?.payments?.currency}
                </Typography>
              </Grid>
              <Grid item md={2}>
                <Box sx={{ ...styles, fontSize: "22px" }}>Purchased Date </Box>
                <Typography mt={2} variant="body1">
                  {/* {nft.nft.BrandEmail} */}
                  {orderDetail?.payments?.createdAt && moment(orderDetail.payments.createdAt).format("DD MMMM YYYY")}
                </Typography>
              </Grid>
              <Grid item md={2}>
                <Box sx={{ ...styles, fontSize: "22px" }}>Return Request </Box>
                <Typography mt={2} variant="body1">
                  {/* {nft.nft.BrandContactNumber} */}
                  {parcelToShow?.deliveredAt && moment(parcelToShow?.deliveredAt).format("DD MMMM YYYY")}
                </Typography>
              </Grid>
            </Grid>
            <Grid container mt={1} p={2.5} pr={0}>
              <Grid item md={12} mb={2}>
                <Box sx={{ ...styles, fontSize: "22px" }}>
                  {/* {nft.status} */}
                  {parcelToShow?.shipmentStatus}
                </Box>
                <Typography variant="subtitle2" mt={1}>
                  {/* {nft.additionalDetails} */}
                  {parcelToShow?.additionalDetails}
                </Typography>
              </Grid>
              <Grid item md={1.6}>
                <img src={parcelToShow?.nft?.asset} alt="recImage" loading="lazy" height="150px" width="150px" />
              </Grid>
              <Grid item md={7}>
                <Box sx={{ ...styles, fontSize: "18px" }}>
                  {/* {nft.nftName} */}
                  {parcelToShow?.nft?.name}
                </Box>
                <Typography variant="subtitle2" fontSize="17px" fontWeight="400" color="#8492c4" mt={2}>
                  {/* {nft.nft.description} */}
                  {parcelToShow?.nft?.description}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }} mt={0.5}>
                  <Typography variant="subtitle2" fontSize="17px" fontWeight="400" color="#8492c4">
                    Quantity : {parcelToShow?.quantity}
                  </Typography>
                  {parcelToShow.serialIds.map((serialId, index) => (
                    <Typography key={index} variant="subtitle2" fontSize="17px" fontWeight="400" color="#8492c4">
                      {serialId}
                    </Typography>
                  ))}
                </Box>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }} mt={0.2}>
                  <Typography variant="subtitle2" fontSize="17px" fontWeight="400" color="#8492c4">
                    {/* Price : {nft.price} {nft.currency}{" "} */}
                    Price : {parcelToShow?.price} {parcelToShow?.currency}
                  </Typography>
                  <Typography variant="subtitle2" fontSize="17px" fontWeight="400" color="#8492c4">
                    {/* Taxes : {nft.tax} {nft.currency}{" "} */}
                    Taxes : {parcelToShow?.tax} {parcelToShow?.currency}
                  </Typography>
                </Box>
                {/* <Typography variant="subtitle2" fontSize="17px" fontWeight="400" color="#8492c4">
        Bought On : {moment(orderDetail.payments.createdAt).format("DD MMMM YYYY")}{" "}
      </Typography> */}
              </Grid>

              <Grid item md={3}>
                <Typography variant="h3" fontSize="20px" fontWeight="400" pb={1}>
                  Seller Details
                </Typography>
                <Typography variant="h3" fontSize="18px" fontWeight="450" color="#fff" pb={1}>
                  {parcelToShow?.brand?.name}
                </Typography>
                <Typography
                  variant="h3"
                  fontSize="18px"
                  fontWeight="450"
                  color="#fff"
                  pb={1}
                  sx={{ wordBreak: "break-word" }}
                >
                  {parcelToShow?.nft?.BrandEmail}
                </Typography>
                <Typography
                  variant="h3"
                  fontSize="18px"
                  fontWeight="450"
                  color="#fff"
                  pb={1}
                  sx={{ wordBreak: "break-word" }}
                >
                  {parcelToShow?.nft?.BrandContactNumber}
                </Typography>
                <Typography variant="h3" fontSize="18px" fontWeight="450" color="#fff" sx={{ wordBreak: "break-word" }}>
                  {parcelToShow?.nft?.requesterAddress}
                </Typography>

                <Typography
                  variant="h3"
                  fontSize="18px"
                  fontWeight="450"
                  color="#fff"
                  sx={{ wordBreak: "break-word", mt: "3px" }}
                >
                  {formatAddress(orderDetail?.sellerAddress)}
                </Typography>
                {parcelToShow?.shipmentStatus === "Returned and Refunded" && (
                  <Grid item md={6} mt={3} display="flex" alignItems="center" justifyContent="center">
                    <Link target="_blank" to={orderDetail?.returnDetails?.transactionHash}>
                      <Button variant="contained" mt={4} sx={{ width: "100%" }}>
                        Transaction Link
                      </Button>
                    </Link>
                  </Grid>
                )}
              </Grid>
              <Grid item md={8} ml={2}>
                <Typography variant="subtitle2" fontSize="17px" fontWeight="400" color="#fff">
                  Reason : {orderDetail?.returnDetails?.returnReason}
                </Typography>
                {parcelToShow?.shipmentStatus === "Returned and Refunded" ? (
                  <>
                    <Typography variant="subtitle2" fontSize="24px" fontWeight="700" pt={0.5} color="#fff">
                      Refund details
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <CustomTableCell>Amount</CustomTableCell>
                            <CustomTableCell>
                              {orderDetail?.returnDetails?.refundedAmount} {orderDetail?.payments?.currency}
                            </CustomTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <CustomTableCell>Taxes </CustomTableCell>
                            <CustomTableCell>
                              {orderDetail?.returnDetails?.refundedTax} {orderDetail?.payments?.currency}
                            </CustomTableCell>
                          </TableRow>
                          <TableRow>
                            <CustomTableCell>Shipping Charges</CustomTableCell>
                            <CustomTableCell>
                              {orderDetail?.returnDetails?.refundedShippingCost
                                ? Number(orderDetail?.returnDetails?.refundedShippingCost).toFixed(2)
                                : 0}{" "}
                              {orderDetail?.payments?.currency}
                            </CustomTableCell>
                          </TableRow>
                          <TableRow>
                            <CustomTableCell>Wallet address</CustomTableCell>
                            <CustomTableCell>
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
                            <CustomTableCell>
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
                  <Typography variant="subtitle2" fontSize="17px" fontWeight="400" pt={0.5} color="#fff">
                    The seller will contact you at your registered email
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>
        )
      )}
    </>
  );
};

export default ReturnCardItem;
