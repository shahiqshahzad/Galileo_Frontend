import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Box } from "@mui/system";
import { Button, CircularProgress, Grid, Typography, useTheme } from "@mui/material";
import { Icons } from "shared/Icons/Icons";
import { getDownloadReceiptPdf, getOrderDetail } from "redux/activity/actions";
import { useDispatch, useSelector } from "react-redux";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import moment from "moment";
import { Link } from "react-router-dom";
import { getAddressValuesString } from "utils/combineAddress";
import { ParseHtmlToText } from "../../productDetails/component/parseHtmlToText/parseHtmlToText";

const MyActivityDetail = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orderId } = useParams();
  const [loader, setLoader] = useState(true);
  const orderDetail = useSelector((state) => state.allActivityReducer.orderDetail);
  const themeBgColor = {
    backgroundColor: theme.palette.mode === "dark" ? "#252B2F" : "#fff",
    // borderTopLeftRadius: "13px",
    // borderTopRightRadius: "13px",
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

  const downloadReceiptHandler = (orderId) => {
    dispatch(getDownloadReceiptPdf(orderId));
  };

  useEffect(() => {
    dispatch(getOrderDetail({ orderId, setLoader }));
    // eslint-disable-next-line
  }, [orderId]);
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
                      Bought on {moment(orderDetail.payments.createdAt).format("DD MMMM YYYY")}
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
                      variant="outlined"
                      onClick={() => downloadReceiptHandler(orderDetail.payments.orderNumber)}
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
                {" "}
                {getAddressValuesString(orderDetail?.payments?.billingAddress)}
              </Typography>
            </Grid>
            <Grid md={5}></Grid>
            <Grid item md={4} p={2.5} marginLeft="0 auto">
              <Box sx={{ ...styles, fontSize: "18px" }}>Amount</Box>
              <Box mt={1} sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Items ({+orderDetail.payments.quantity}) Subtotal</Typography>
                <Typography>
                  {orderDetail?.payments?.totalPrice ? Number(orderDetail?.payments?.totalPrice).toFixed(2) : 0}{" "}
                  {orderDetail.payments.currency}{" "}
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
                  {orderDetail?.payments?.shippingCost ? Number(orderDetail?.payments?.shippingCost).toFixed(2) : 0}{" "}
                  {orderDetail.payments.currency}
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
                  {(Number(orderDetail.payments.totalPrice) + Number(orderDetail.payments.totalTax)).toFixed(2)}{" "}
                  {orderDetail.payments.currency}
                </Typography>
              </Box>
            </Grid>
          </Grid>
          {orderDetail.singlePieceParcel.map((nft) => (
            <Box
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
                <Grid item md={6}></Grid>
                <Grid item md={2}>
                  <Box sx={{ ...styles, fontSize: "22px" }}>Support Email </Box>
                  <Typography mt={1} variant="body1">
                    {nft.nft.BrandEmail}{" "}
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
                <Grid item md={1.6}>
                  <img src={nft.nft.asset} alt="recImage" loading="lazy" height="150px" width="150px" />
                </Grid>
                <Grid item md={9}>
                  <Box sx={{ ...styles, fontSize: "18px" }}>{nft.nftName}</Box>
                  <ParseHtmlToText description={nft?.nft?.description} />
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Typography>Quantity : {nft.quantity}</Typography>
                    {nft.serialIds.map((serialId, index) => (
                      <Typography key={index} sx={{ color: "#2F53FF" }}>
                        {serialId}
                      </Typography>
                    ))}
                  </Box>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <Typography>
                      Price : {nft?.price ? Number(nft.price).toFixed(2) : 0} {nft.currency}{" "}
                    </Typography>
                    <Typography>
                      Taxes : {nft?.tax ? Number(nft.tax).toFixed(2) : 0} {nft.currency}{" "}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          ))}
        </>
      )}
    </>
  );
};

export default MyActivityDetail;
