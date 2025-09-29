import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import CircularProgress from "@mui/material/CircularProgress";

import { styled, useTheme } from "@mui/material/styles";
import Slide from "@mui/material/Slide";

import "./loader.css";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { calculateTotalShippingCost } from "./calculateTotalShippingCost";
import { NftItem } from "./NftItem";
import { getAllAddresses } from "redux/addresses/actions";
import { getNftTax, getNftTaxSuccess, getnftData } from "redux/landingPage/actions";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StyledDialog = styled(Dialog)(({ theme }) => ({
  ".MuiDialog-paper": {
    maxWidth: "100%"
  }
}));
const blurBgStyle = {
  gap: "2em",
  zIndex: 9998,
  width: "100%",
  height: "100%",
  padding: "10px",
  overflow: "hidden",
  filter: "blur(1px)",
  position: "relative",
  backgroundColor: "rgba(0, 0, 0, 0.5)"
};

export default function BuyRedeemDialog({
  nft,
  action,
  openDialog,
  quantity,
  handleClose,
  handleSubmit,
  productId,
  shippingAddress,
  setShippingAddress
}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { addressesList } = useSelector((state) => state.addresses);
  const { singleNft } = useSelector((state) => state.marketplaceReducer);
  const { nftTax } = useSelector((state) => state.landingPageReducer);
  const [nftToBuy, setNftToBuy] = useState(nft);
  const [fetchShippingPriceLoading, setFetchShippingPriceLoading] = useState(false);

  useEffect(() => {
    if (singleNft && singleNft?.id === nft?.id) {
      setNftToBuy(singleNft);
    } else {
      setNftToBuy(nft);
    }
  }, [nft, singleNft]);

  useEffect(() => {
    dispatch(getAllAddresses());
    dispatch(getNftTaxSuccess({ taxCounted: 0 }));
  }, []);

  useEffect(() => {
    setShippingAddress({});
    dispatch(getNftTaxSuccess({ taxCounted: 0 }));
  }, [quantity, productId]);

  const calculateCartTotal = () => {
    let totalTax = 0;
    let totalPrice = 0;
    let totalProducts = 0;

    if (nftToBuy && nftToBuy?.price) {
      totalPrice += nftToBuy?.price * quantity;
      totalProducts++;
    }
    totalTax = nftTax * quantity || 0;

    totalTax = parseFloat(totalTax.toFixed(2));
    totalPrice = parseFloat(totalPrice.toFixed(2));
    let totalShippingCost = calculateTotalShippingCost([nftToBuy], quantity);
    let totalPriceToPay = parseFloat(totalPrice + totalShippingCost + totalTax).toFixed(2);

    return { totalPrice, totalProducts, totalPriceToPay };
  };

  return (
    <div>
      <StyledDialog
        keepMounted
        open={openDialog}
        onClose={handleClose}
        TransitionComponent={Transition}
        fullWidth={true}
        maxWidth={"md"}
        scroll={"body"}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle
          sx={{
            color: `${theme.palette.mode === "dark" ? "#ffffff" : "black"}`,
            fontFamily: theme?.typography.appText,
            fontWeight: 500,
            fontSize: "40px",
            lineHeight: "10px",
            display: "flex",
            alignItems: "center",
            marginLeft: "4.5rem"
          }}
        >
          {action}
        </DialogTitle>
        <Stack
          sx={{
            flexDirection: "row",
            "*::-webkit-scrollbar": {
              width: "0.3em"
            },
            "*::-webkit-scrollbar-thumb": {
              backgroundColor: "#FFFFFF"
            }
          }}
        >
          <Stack sx={{ width: "67%", paddingX: "4rem" }}>
            <DialogContent sx={{ height: "80vh" }}>
              <DialogContentText
                id="alert-dialog-slide-description"
                sx={{
                  color: `${theme.palette.mode === "dark" ? "#ffffff" : "black"}`,
                  fontFamily: theme?.typography.appText,
                  fontWeight: 400,
                  fontSize: "18px",
                  lineHeight: "27px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "2.5rem"
                }}
              >
                <Stack>
                  <Stack sx={fetchShippingPriceLoading ? blurBgStyle : { gap: "2em", padding: "10px" }}>
                    {fetchShippingPriceLoading && (
                      <Stack
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "100%",
                          height: "100%",
                          margin: "auto",
                          position: "absolute",
                          top: 0,
                          bottom: 0,
                          left: 0,
                          right: 0,
                          zIndex: 9999
                        }}
                      >
                        <CircularProgress color="primary" size={50} />
                      </Stack>
                    )}
                    {nftToBuy && (
                      <NftItem
                        nft={nftToBuy}
                        theme={theme}
                        quantity={quantity}
                        nftTax={nftTax}
                        selectedAddress={shippingAddress}
                        fetchShippingPriceLoading={fetchShippingPriceLoading}
                      />
                    )}
                  </Stack>
                </Stack>
              </DialogContentText>
            </DialogContent>
          </Stack>
          <Stack sx={{ width: "33%", paddingX: "2rem" }}>
            <Stack mt={"1rem"}>
              <Typography
                sx={{ color: theme.palette.mode === "light" ? "black" : "white", mb: "10px", fontSize: "18px" }}
              >
                Shipping Address
              </Typography>
              <Select
                components={{ IndicatorSeparator: () => null }}
                onMenuOpen={() => dispatch(getAllAddresses())}
                styles={{
                  control: (base, state) => ({
                    ...base,
                    background: theme.palette.mode === "dark" ? "#181C1F" : "#f3f3f3",
                    border: theme.palette.mode === "dark" ? "1px solid #757575" : "none",
                    borderRadius: "7px",
                    padding: "8px"
                  }),
                  singleValue: (provided, state) => ({
                    ...provided,
                    color: theme.palette.mode === "dark" ? "white" : "black"
                  }),
                  menu: (base) => ({
                    ...base,
                    borderRadius: "7px",
                    marginTop: 0,
                    border: theme.palette.mode === "dark" ? "1px solid white" : "1px solid #181C1F",
                    color: theme.palette.mode === "dark" ? "white" : "#181C1F",
                    background: theme.palette.mode === "dark" ? "#181C1F" : "#f3f3f3"
                  }),
                  dropdownIndicator: (provided, state) => ({
                    ...provided,
                    color: "#2F53FF"
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? state.isSelected
                          ? "#2F53FF"
                          : "#181C1F"
                        : state.isSelected
                          ? "#2F53FF"
                          : "white",
                    color: theme.palette.mode === "dark" ? "white" : state.isSelected ? "white" : "black",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#2196f3"
                    }
                  })
                }}
                variant="standard"
                placeholder="Tag"
                options={
                  addressesList?.length
                    ? addressesList.map((item) => {
                        return { label: item.tag, value: item.id };
                      })
                    : []
                }
                getOptionLabel={(options) => {
                  return options["name"] ? options["name"] : options["label"];
                }}
                getOptionValue={(options) => {
                  return options["name"] ? options["name"] : options["value"];
                }}
                value={
                  shippingAddress?.value
                    ? {
                        value: shippingAddress?.value,
                        label: shippingAddress?.label
                      }
                    : ""
                }
                onChange={(item) => {
                  setFetchShippingPriceLoading(true);
                  setShippingAddress(item);
                  dispatch(
                    getnftData({
                      id: nftToBuy.id,
                      quantity: quantity,
                      userAddressId: item.value,
                      setFetchShippingPriceLoading
                    })
                  );
                  dispatch(
                    getNftTax({
                      nftId: nftToBuy.id,
                      userAddressId: item.value
                    })
                  );
                }}
              />
              <Button
                sx={{ color: "#2F5BFF", alignSelf: "flex-end", fontFamily: theme?.typography.appText }}
                component={Link}
                to="/addresses"
                target="_blank"
              >
                Add new address
              </Button>
            </Stack>

            <Box sx={{ width: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "no-wrap",
                  gap: "1rem",
                  paddingTop: "1rem"
                }}
              >
                <Typography
                  sx={{
                    fontFamily: theme?.typography.appText,
                    fontWeight: "400",
                    fontSize: "20px",
                    lineHeight: "20px",
                    letterSpacing: 0,
                    textAlign: "left",
                    color: `${theme.palette.mode === "dark" ? "#ffffff" : "black"}`
                  }}
                >
                  Quantity
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                  <Typography
                    sx={{
                      fontFamily: theme?.typography.appText,
                      fontWeight: "700",
                      fontSize: "16px",
                      lineHeight: "20px",
                      letterSpacing: 0,
                      textAlign: "left",
                      color: `${theme.palette.mode === "dark" ? "#ffffff" : "black"}`
                    }}
                  >
                    {quantity}
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "no-wrap",
                  gap: "1rem",
                  paddingTop: "1rem"
                }}
              >
                <Typography
                  sx={{
                    fontFamily: theme?.typography.appText,
                    fontWeight: "400",
                    fontSize: "20px",
                    lineHeight: "20px",
                    letterSpacing: 0,
                    textAlign: "left",
                    color: `${theme.palette.mode === "dark" ? "#ffffff" : "black"}`
                  }}
                >
                  Final amount to be paid
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                  <Typography
                    sx={{
                      fontFamily: theme?.typography.appText,
                      fontWeight: "700",
                      fontSize: "16px",
                      lineHeight: "20px",
                      letterSpacing: 0,
                      textAlign: "left",
                      color: `${theme.palette.mode === "dark" ? "#ffffff" : "black"}`
                    }}
                  >
                    {calculateCartTotal(nftToBuy).totalPriceToPay}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: theme?.typography.appText,
                      fontWeight: "700",
                      fontSize: "20px",
                      lineHeight: "20px",
                      letterSpacing: 0,
                      textAlign: "left",
                      background: "linear-gradient(97.63deg, #657DE0 0%, #66EAE2 108.44%, #62C4E2 108.45%)",
                      WebkitTextFillColor: "transparent",
                      WebkitBackgroundClip: "text",
                      paddingLeft: 0.5,
                      color: "#ffffff"
                    }}
                  >
                    {nftToBuy?.currencyType}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <DialogActions sx={{ p: 0, mt: "3em", flexDirection: "column", gap: "2em" }}>
              <Button
                onClick={handleSubmit}
                fullWidth
                sx={{
                  fontFamily: theme?.typography.appText,
                  fontWeight: 500,
                  fontSize: "22px",
                  lineHeight: "22px",
                  color: "#ffffff",
                  background: "linear-gradient(97.63deg, #2F57FF 0%, #2FA3FF 108.45%)",
                  borderRadius: "12px",
                  paddingY: "1rem !important"
                }}
                disabled={fetchShippingPriceLoading || !shippingAddress?.value}
              >
                <span>{action}</span>
              </Button>
              <Button
                onClick={handleClose}
                fullWidth
                sx={{
                  fontFamily: theme?.typography.appText,
                  fontWeight: 500,
                  fontSize: "22px",
                  lineHeight: "22px",
                  color: "#ffffff",
                  background: "transparent",
                  borderRadius: "12px",
                  paddingY: "1rem !important",

                  border: "1.5px solid #2F57FF"
                }}
              >
                Cancel
              </Button>
            </DialogActions>
          </Stack>
        </Stack>
      </StyledDialog>
    </div>
  );
}
