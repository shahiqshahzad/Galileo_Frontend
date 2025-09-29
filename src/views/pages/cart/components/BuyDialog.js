import React, { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import CircularProgress from "@mui/material/CircularProgress";

import { styled, useTheme } from "@mui/material/styles";
import Slide from "@mui/material/Slide";

import InfoCircle from "../../../../assets/images/icons/info-circle.svg";
import "./loader.css";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, moveToWishlist, updateCartItem } from "redux/marketplace/actions";
import { useNavigate } from "react-router";
import Select from "react-select";
import { calculateTotalShippingCost } from "utils/cartTotalShippingCost";
import { OtherCartItems } from "./otherCartItems";
import { CcsCartItems } from "./ccsCartItems";
import DropdownButton from "./DropdownButton";

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

export default function BuyDialog({
  cartData,
  openBuyDialog,
  handleBuyClose,
  closeDialog,
  calculateCartTotal,
  loader,
  groupedCartItems,
  cartLength,
  selectedAddress,
  setSelectedAddress,
  ccsCartItems,
  otherCartItems,
  handleBuyAndRedeem,
  fetchShippingPriceLoading,
  setFetchShippingPriceLoading,
  setShowBuyConfirmationDialog
}) {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addressesList } = useSelector((state) => state.addresses);

  const [autoRedeemItemInCart, setAutoRedeemItemInCart] = useState(false);

  const handleDelete = (id) => {
    setSelectedAddress();
    dispatch(deleteCartItem({ id }));
  };

  const handleWishlistSave = (id) => {
    setSelectedAddress();
    dispatch(moveToWishlist({ ids: [id] }));
  };

  const handleQuantity = (item, option) => {
    setSelectedAddress();
    if (option === item.quantity && option === cartLength) return;
    dispatch(
      updateCartItem({ cartItemId: item.id, NftId: item.Nft.id, selectedQuantity: option, quantity: item.quantity })
    );
  };

  useEffect(() => {
    if (cartData.length === 0) {
      closeDialog();
    }

    let autoRedeemItem = cartData.filter((item) => item?.Nft?.autoRedeem);
    if (autoRedeemItem.length) {
      setAutoRedeemItemInCart(true);
    } else {
      setAutoRedeemItemInCart(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartData]);

  return (
    <div>
      <StyledDialog
        keepMounted
        open={openBuyDialog}
        onClose={closeDialog}
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
            marginLeft: "8rem"
          }}
        >
          {"Buy"}
          <IconButton aria-label="favorite">
            <img
              src={InfoCircle}
              alt="Info Circle"
              style={{
                background: `${theme.palette.mode === "dark" ? "transparent" : "black"}`,
                borderRadius: "50%",
                height: "40px",
                width: "40px"
              }}
            />
          </IconButton>
        </DialogTitle>
        <Stack
          sx={{
            flexDirection: "row",
            "*::-webkit-scrollbar": {
              width: "0.3em"
            },
            "*::-webkit-scrollbar-track": {
              // backgroundColor: '#FFFFFF'
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
                    {otherCartItems?.length ? (
                      <OtherCartItems
                        theme={theme}
                        loader={loader}
                        data={otherCartItems}
                        handleDelete={handleDelete}
                        handleQuantity={handleQuantity}
                        handleWishlistSave={handleWishlistSave}
                      />
                    ) : null}

                    {ccsCartItems?.length ? (
                      <CcsCartItems
                        theme={theme}
                        loader={loader}
                        data={ccsCartItems}
                        handleDelete={handleDelete}
                        handleQuantity={handleQuantity}
                        handleWishlistSave={handleWishlistSave}
                      />
                    ) : null}
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
                    cursor: "pointer"
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
                  selectedAddress?.value
                    ? {
                        value: selectedAddress?.value,
                        label: selectedAddress?.label
                      }
                    : ""
                }
                onChange={(item) => {
                  setFetchShippingPriceLoading(true);
                  setSelectedAddress(item);
                }}
              />
              <Button
                sx={{ color: "#2F5BFF", alignSelf: "flex-end", fontFamily: theme?.typography.appText }}
                onClick={() => navigate("/addresses")}
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
                  gap: "1rem"
                }}
              >
                <Typography
                  sx={{
                    fontFamily: theme?.typography.appText,
                    fontWeight: "400",
                    fontSize: "16px",
                    textAlign: "left",
                    color: `${theme.palette.mode === "dark" ? "#ffffff" : "black"}`
                  }}
                >
                  Total tax
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                  <Typography
                    sx={{
                      fontFamily: theme?.typography.appText,
                      fontWeight: "700",
                      fontSize: "16px",
                      textAlign: "left",
                      color: `${theme.palette.mode === "dark" ? "#ffffff" : "black"}`
                    }}
                  >
                    {calculateCartTotal(cartData).totalTax}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: theme?.typography.appText,
                      fontWeight: "700",
                      fontSize: "16px",
                      lineHeight: "26.95px",
                      letterSpacing: 0,
                      textAlign: "left",
                      background: "linear-gradient(97.63deg, #657DE0 0%, #66EAE2 108.44%, #62C4E2 108.45%)",
                      WebkitTextFillColor: "transparent",
                      WebkitBackgroundClip: "text",
                      paddingLeft: 0.5,
                      color: "#ffffff"
                    }}
                  >
                    USDC
                  </Typography>
                </Box>
              </Box>
              {calculateTotalShippingCost(cartData) ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "no-wrap",
                    gap: "1rem",
                    paddingBottom: "5px"
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: theme?.typography.appText,
                      fontWeight: "400",
                      fontSize: "16px",
                      lineHeight: "20px",
                      letterSpacing: 0,
                      textAlign: "left",
                      color: `${theme.palette.mode === "dark" ? "#ffffff" : "black"}`
                    }}
                  >
                    Total shipping charges
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
                      {calculateTotalShippingCost(cartData)}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: theme?.typography.appText,
                        fontWeight: "700",
                        fontSize: "16px",
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
                      USDC
                    </Typography>
                  </Box>
                </Box>
              ) : null}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "no-wrap",
                  gap: "1rem",
                  borderBottom: "2px solid #2FA3FF",
                  borderBottomStyle: "dashed"
                }}
              >
                <Typography
                  sx={{
                    fontFamily: theme?.typography.appText,
                    fontWeight: "400",
                    fontSize: "16px",
                    textAlign: "left",
                    color: `${theme.palette.mode === "dark" ? "#ffffff" : "black"}`
                  }}
                >
                  Subtotal ({`${calculateCartTotal(cartData).totalProducts}`} items)
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                  <Typography
                    sx={{
                      fontFamily: theme?.typography.appText,
                      fontWeight: "700",
                      fontSize: "16px",
                      textAlign: "left",
                      color: `${theme.palette.mode === "dark" ? "#ffffff" : "black"}`
                    }}
                  >
                    {calculateCartTotal(cartData).totalPrice}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: theme?.typography.appText,
                      fontWeight: "700",
                      fontSize: "16px",
                      lineHeight: "26.95px",
                      letterSpacing: 0,
                      textAlign: "left",
                      background: "linear-gradient(97.63deg, #657DE0 0%, #66EAE2 108.44%, #62C4E2 108.45%)",
                      WebkitTextFillColor: "transparent",
                      WebkitBackgroundClip: "text",
                      paddingLeft: 0.5,
                      color: "#ffffff"
                    }}
                  >
                    USDC
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
                    {calculateCartTotal(cartData).totalPriceToPay}
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
                    USDC
                  </Typography>
                </Box>
              </Box>
            </Box>
            <DialogActions sx={{ p: 0, mt: "3em", flexDirection: "column", gap: "2em" }}>
              {loader ? (
                <CircularProgress className="circul" />
              ) : (
                <DropdownButton
                  handleBuy={(action) => {
                    if (action === "buy") {
                      handleBuyClose();
                    } else {
                      let autoRedeemTrue = false;
                      let autoRedeemFalse = false;

                      cartData.forEach((item) => {
                        if (item?.Nft?.autoRedeem === true) {
                          autoRedeemTrue = true;
                        } else if (item?.Nft?.autoRedeem === false) {
                          autoRedeemFalse = true;
                        }

                        // Break the loop if both true and false values are found
                        if (autoRedeemTrue && autoRedeemFalse) {
                          return;
                        }
                      });

                      // Check if both true and false values are present
                      if (autoRedeemTrue && autoRedeemFalse) {
                        setShowBuyConfirmationDialog(true);
                      } else {
                        handleBuyAndRedeem();
                      }
                    }
                  }}
                  defaultOption={autoRedeemItemInCart ? "buyRedeem" : "buy"}
                  disabled={loader || fetchShippingPriceLoading || !selectedAddress?.value}
                />
              )}
              <Button
                onClick={closeDialog}
                fullWidth
                sx={{
                  fontFamily: theme?.typography.appText,
                  fontWeight: 500,
                  fontSize: "22px",
                  lineHeight: "22px",
                  color: "#ffffff",
                  background: "transparent",
                  borderRadius: "4px",
                  paddingY: "1rem !important",
                  marginLeft: "0 !important",
                  marginTop: "2rem",
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
