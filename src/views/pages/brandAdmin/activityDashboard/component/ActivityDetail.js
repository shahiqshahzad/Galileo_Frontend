import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Box } from "@mui/system";
import { Button, CircularProgress, Grid, Typography, useTheme } from "@mui/material";
import { Icons } from "shared/Icons/Icons";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getBrandActivityDetail } from "redux/brandActivityDashboard/actions";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import moment from "moment";
import { getAddressValuesString, getFullAddress, getUserEmail } from "utils/combineAddress";
import { ParseHtmlToText } from "views/pages/user/productDetails/component/parseHtmlToText/parseHtmlToText";

const ActivityDetail = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orderId } = useParams();
  const [loader, setLoader] = useState(true);
  const orderDetail = useSelector((state) => state.brandActivityReducer.brandActivityDetail);
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

  useEffect(() => {
    dispatch(getBrandActivityDetail({ orderId, setLoader }));
    // eslint-disable-next-line
  }, [orderId]);

  const address = getFullAddress(orderDetail?.payments?.shippingAddress);

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }} mt={2}>
        <ArrowBackIosIcon
          onClick={() => {
            navigate("/activitydashboard");
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
                  <Typography variant="body1" sx={{ fontWeight: "400", fontFamily: "Inter" }}>
                    Bought on {moment(orderDetail.payments.createdAt).format("DD MMMM YYYY")}
                  </Typography>
                  <Box as="span" sx={{ borderLeft: "1px solid #2FC1FF" }} ml={2}></Box>
                  <Typography variant="body1" sx={{ fontWeight: "400", fontFamily: "Inter" }}>
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
                      variant="outlined"
                      sx={{
                        width: "100%",
                        height: "30px",
                        color: styles,
                        fontFamily: "poppins",
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
              </Typography>
            </Grid>
            <Grid item md={2}></Grid>
            <Grid item md={4} p={2.5} marginLeft="0 auto">
              <Box sx={{ ...styles, fontSize: "18px" }}>Amount</Box>
              <Box mt={1} sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Items ({orderDetail.payments.quantity}) Subtotal</Typography>
                <Typography>
                  {orderDetail?.payments?.totalPrice ? Number(orderDetail.payments.totalPrice) : 0}{" "}
                  {orderDetail?.payments?.currency}{" "}
                </Typography>
              </Box>

              <Box mt={1} sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Taxes</Typography>
                <Typography>
                  {orderDetail?.payments?.totalTax ? Number(orderDetail.payments.totalTax).toFixed(2) : 0}{" "}
                  {orderDetail?.payments?.currency}
                </Typography>
              </Box>

              <Box mt={1} sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Shipping</Typography>
                <Typography>
                  {orderDetail?.payments?.shippingCost ? Number(orderDetail.payments.shippingCost).toFixed(2) : 0}{" "}
                  {orderDetail?.payments?.currency}
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
                  {orderDetail?.payments?.currency}
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
                <Grid item md={3}>
                  <Box sx={{ ...styles, fontSize: "22px" }}>Shipping Charges </Box>
                  <Typography mt={1} variant="body1">
                    {nft?.shippingCost ? Number(nft.shippingCost).toFixed(2) : 0} {nft.currency}
                  </Typography>
                </Grid>
                <Grid item md={3}>
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
                <Grid item md={1.8}>
                  <img src={nft.nft.asset} alt="recImage" loading="lazy" height="150px" width="150px" />
                </Grid>
                <Grid item md={7.8}>
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
                      Price : {nft?.price ? Number(nft.price).toFixed(2) : 0} {nft.currency}{" "}
                    </Typography>
                    <Typography>
                      Taxes : {nft?.tax ? Number(nft.tax).toFixed(2) : 0} {nft.currency}{" "}
                    </Typography>
                  </Box>
                  <Typography>Bought On : {moment(orderDetail.payments.createdAt).format("DD MMMM YYYY")} </Typography>
                </Grid>

                <Grid item md={2.4}>
                  <Button
                    variant="contained"
                    sx={{
                      width: "100%",
                      height: "30px",
                      color: styles,
                      fontFamily: "poppins",
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
    </>
  );
};

export default ActivityDetail;
