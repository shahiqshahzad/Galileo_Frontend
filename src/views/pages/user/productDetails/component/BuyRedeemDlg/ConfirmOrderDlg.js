/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
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
import { getNftTax, getNftTaxSuccess } from "redux/landingPage/actions";
import { PriceWithCurrency } from "./PriceWithCurrency";
import { Icons } from "shared/Icons/Icons";
import { createGoogleAnalyticsForAddingShipping, createGoogleAnalyticsForBeginCheckout } from "utils/googleAnalytics";

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

export default function ConfirmOrderDlg({
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
  const { nftTax, note } = useSelector((state) => state.landingPageReducer);
  const [nftToBuy, setNftToBuy] = useState(nft);
  const [taxError, setTaxError] = useState(false);
  const [shippingAddressesList, setShippingAddressesList] = useState([]);
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

  useEffect(() => {
    if (addressesList?.length) {
      let data = addressesList.map((item) =>
        item.isKycAddress ? { ...item, tag: item.tag + " (Not valid for shipping)" } : { ...item }
      );
      setShippingAddressesList([...data]);
    }
  }, [addressesList]);

  const getFlatRateShipping = () => {
    const cost = nft?.flatRateShippingCost || 0;
    const price = nft?.noExternalCostForMultipleCopies ? cost : cost * quantity;
    return price.toFixed(2);
  };

  const calculateCartTotal = () => {
    let totalTax = 0;
    let totalPrice = 0;
    let totalProducts = 0;

    if (nftToBuy && nftToBuy?.salePrice) {
      totalPrice += nftToBuy?.salePrice * quantity;
      totalProducts++;
    } else if (nftToBuy && nftToBuy?.price) {
      totalPrice += nftToBuy?.price * quantity;
      totalProducts++;
    }
    totalTax = nftTax * quantity || 0;

    totalTax = shippingAddress?.value ? parseFloat(totalTax.toFixed(2)) : 0;
    totalPrice = parseFloat(totalPrice.toFixed(2));

    let totalShippingCost =
      nft?.shippingCalculationMethod === "FRS"
        ? getFlatRateShipping()
        : shippingAddress?.value
          ? calculateTotalShippingCost([nftToBuy], quantity)
          : 0;

    let totalPriceToPay = parseFloat(totalPrice + +totalShippingCost + totalTax).toFixed(2);

    return { totalPrice, totalProducts, totalPriceToPay, totalTax, totalShippingCost };
  };
  let isPurchaseDisabled = nft?.shippingCalculationMethod === "CCS" && !nft?.shippingCost;
  const totalPrice = calculateCartTotal(nftToBuy).totalPrice;
  const totalShippingCost = calculateCartTotal(nftToBuy).totalShippingCost;
  const totalTax = calculateCartTotal(nftToBuy).totalTax;
  const dataToCreateBeginCheckoutEvent = {
    totalPrice,
    totalShippingCost,
    totalTax,
    nftId: nftToBuy.id,
    nftName: nftToBuy.name,
    nftBrand: nftToBuy.Brand.name,
    nftCategory: nftToBuy.Category.name,
    nftPrice: nftToBuy.price,
    nftSalePrice: nftToBuy.salePrice,
    nftQty: +nftToBuy.quantity
  }
  const handleClickOnConfirmOrder = () => {
    createGoogleAnalyticsForBeginCheckout(dataToCreateBeginCheckoutEvent);
    createGoogleAnalyticsForAddingShipping(dataToCreateBeginCheckoutEvent)
    handleSubmit();
  }

  return (
    <div>
      <StyledDialog
        keepMounted
        open={openDialog}
        onClose={handleClose}
        TransitionComponent={Transition}
        maxWidth={"md"}
        scroll={"body"}
        aria-describedby="alert-dialog-slide-description"
      >
        {/* <DialogTitle
          sx={{
            color: `${theme.palette.mode === "dark" ? "#ffffff" : "black"}`,
            fontFamily: "Public Sans ,sans-serif",
            fontWeight: 500,
            fontSize: "40px",
            lineHeight: "10px",
            display: "flex",
            alignItems: "center",
            marginLeft: "4.5rem"
          }}
        >
          {action}
        </DialogTitle> */}
        <span
          style={{
            position: "absolute",
            top: "1.5rem",
            right: "1.5rem",
            cursor: "pointer"
          }}
          onClick={handleClose}
        >
          {Icons.orderDlgCloseIcon}
        </span>
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
          <Stack sx={{ width: "100%", paddingX: "4rem", paddingY: "3rem" }}>
            <DialogContent>
              <DialogContentText
                id="alert-dialog-slide-description"
                sx={{
                  color: `${theme.palette.mode === "dark" ? "#ffffff" : "black"}`,
                  fontFamily: theme?.typography.appText,
                  fontWeight: 400,
                  fontSize: "18px",
                  lineHeight: "27px",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <Stack mt={"1rem"}>
                  <Typography
                    sx={{ color: theme.palette.mode === "light" ? "black" : "white", mb: "10px", fontSize: "18px" }}
                  >
                    Shipping Address
                  </Typography>
                  <Select
                    components={{ IndicatorSeparator: () => null }}
                    onMenuOpen={() => dispatch(getAllAddresses())}
                    isDisabled={fetchShippingPriceLoading}
                    isOptionDisabled={(option) => option.isDisabled}
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
                    placeholder="Select delivery address"
                    options={
                      shippingAddressesList?.length
                        ? shippingAddressesList.map((item) => {
                          return { label: item.tag, value: item.id, isDisabled: item.isKycAddress };
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
                      let shippingPayload = {
                        id: nftToBuy.id,
                        quantity: quantity,
                        userAddressId: item.value,
                        setFetchShippingPriceLoading
                      };
                      setFetchShippingPriceLoading(true);
                      setShippingAddress(item);
                      dispatch(
                        getNftTax({
                          nftId: nftToBuy.id,
                          userAddressId: item.value,
                          setTaxError,
                          shippingPayload,
                          setFetchShippingPriceLoading
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
                <Stack>
                  <Stack sx={fetchShippingPriceLoading ? blurBgStyle : { gap: "2em" }}>
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

              <Box sx={{ width: "100%", mt: 2 }}>
                <PriceWithCurrency
                  theme={theme}
                  label={"Subtotal"}
                  style={{ paddingTop: "10px" }}
                  currencyType={nftToBuy?.currencyType}
                  price={calculateCartTotal(nftToBuy).totalPrice}
                />
                <PriceWithCurrency
                  theme={theme}
                  label={"Total tax"}
                  style={{ paddingTop: "10px" }}
                  currencyType={nftToBuy?.currencyType}
                  price={calculateCartTotal(nftToBuy).totalTax === 0 ? "N/A" : calculateCartTotal(nftToBuy).totalTax}
                />
                <PriceWithCurrency
                  theme={theme}
                  label={"Shipping"}
                  style={{ paddingTop: "10px" }}
                  currencyType={nftToBuy?.currencyType}
                  price={calculateCartTotal(nftToBuy).totalShippingCost}
                />
                <Stack
                  sx={{
                    mt: 2,
                    height: "1px",
                    borderBottom: "1px dashed #2F57FF",
                    borderWidth: "thick"
                  }}
                />
                <PriceWithCurrency
                  theme={theme}
                  label={"Total"}
                  style={{ paddingTop: "10px" }}
                  currencyType={nftToBuy?.currencyType}
                  price={calculateCartTotal(nftToBuy).totalPriceToPay}
                />
                {note && (
                 <>
                  
                  <Box sx={{display:"flex"}} mt={3}>
                  <Typography mt={5} variant="subtitle1" fontSize="16px" fontWeight="600" m={0} p={0}> Note:</Typography>
                  <Typography mt={5} variant="subtitle1" fontSize="16px" pl={1}  m={0} py={0}> {note}</Typography>

                  </Box>
                 </>
                )}
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 0, flexDirection: "column", gap: "2em" }}>
              <Button
                onClick={handleClickOnConfirmOrder}
                fullWidth
                sx={{
                  fontFamily: theme?.typography.appText,
                  fontWeight: 500,
                  fontSize: "22px",
                  lineHeight: "22px",
                  color: "#ffffff",
                  background: "linear-gradient(97.63deg, #2F57FF 0%, #2FA3FF 108.45%)",
                  borderRadius: "12px",
                  paddingY: "1rem !important",
                  width: "93%"
                }}
                disabled={fetchShippingPriceLoading || !shippingAddress?.value || isPurchaseDisabled || taxError}
              >
                <span>Confirm Order</span>
              </Button>
            </DialogActions>
          </Stack>
        </Stack>
      </StyledDialog>
    </div>
  );
}
