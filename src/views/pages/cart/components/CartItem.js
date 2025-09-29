import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import CardMedia from "@mui/material/CardMedia";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CardContent from "@mui/material/CardContent";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

import MoveToWishlistDialog from "./MoveToWishlistDialog";

// MUI Icons
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { Icons } from "../../../../shared/Icons/Icons";

import { styled, useTheme } from "@mui/material/styles";

import Remove from "../../../../assets/images/icons/remove-from-cart.svg";

import {
  deleteCartItem,
  deleteWishlistItem,
  moveToCart,
  moveToWishlist,
  updateCartItem
} from "../../../../redux/marketplace/actions";

// const StyledTextDropDown = styled(TextField)(({ theme }) => ({
export const StyledTextDropDown = styled(TextField)(({ theme }) => ({
  width: "4.563rem",
  height: "2.375rem",
  padding: "12px, 15px, 12px, 15px",
  gap: "1.25rem",
  overflow: "hidden",
  "& .MuiInputBase-root": {
    width: "4.563rem",
    height: "2.375rem",
    padding: "12px, 15px, 12px, 15px",
    color: `${theme.palette.mode === "dark" ? "#ffffff" : "black"}`,
    gap: "1.25rem",
    ".MuiInputBase-input": {
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    ".MuiOutlinedInput-notchedOutline": {
      border: "1px solid #7F82F3 !important"
    },
    '& svg[data-testid="ArrowDropDownIcon"]': {
      color: "#2194FF"
    }
  }
}));

export const StyledIconBtn1 = styled("div")(({ theme }) => ({
  width: "38px",
  height: "38px",
  padding: "9px",
  borderRadius: "8px",
  border: "1px solid #F66868",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& .MuiSvgIcon-root": {
    height: "20px",
    width: "20px",
    color: "#F66868"
  }
}));

export const StyledIconBtn2 = styled("div")(({ theme }) => ({
  width: "38px",
  height: "38px",
  padding: "9px",
  borderRadius: "8px",
  border: "1px solid #F66868",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& .MuiSvgIcon-root": {
    height: "20px",
    width: "20px",
    color: "#FFFFFF"
  }
}));

export const StyledAddToCartBtn = styled(Button)(({ theme }) => ({
  height: "38px",
  display: "flex",
  padding: "9px 10px",
  alignItems: "center",
  gap: "10px",
  fontFamily: theme?.typography.appText,
  fontSize: "13px",
  fontWeight: 400,
  lineHeight: "normal",
  letterSpacing: "0px",
  textAlign: "left",
  borderRadius: "8px",
  border: "1px solid",
  color: `${theme.palette.mode === "dark" ? "#FFFFFF" : "#2194FF"}`,
  borderColor: `${theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.50)" : "#2194FF"}`,
  background: `${theme.palette.mode === "dark" ? "#181C1F" : "#FFFFFF"}`
  // '&:hover': { background: `${theme.palette.mode === 'dark' ? '#16191C' : 'gray'}` },
  // '> svg': {
  //   color: '#ffffff',
  //   background: '#ffffff'
  // }
}));

export const StyledChip = styled(Chip)(({ theme }) => ({
  height: "1.5rem",
  marginBottom: theme.spacing(1.25),
  ".MuiChip-label": {
    fontFamily: theme?.typography.appText,
    fontWeight: 500,
    fontSize: "12px",
    lineHeight: "16px",
    textAlign: "center",
    color: `${theme.palette.mode === "dark" ? "#ffffff" : "black"}`
  }
}));

export const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} arrow />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    background: "linear-gradient(0deg, #272F34, #272F34),linear-gradient(0deg, #333C42, #333C42)",
    color: `${theme.palette.mode === "dark" ? "#ffffff" : "black"}`,
    maxWidth: 246,
    padding: "1rem",
    border: "1.12px solid #333C42"
  },
  [`& .${tooltipClasses.tooltipArrow}`]: {
    background: "linear-gradient(0deg, #272F34, #272F34),linear-gradient(0deg, #333C42, #333C42)",
    boxShadow: theme.shadows[1]
  },
  [`& .${tooltipClasses.arrow}`]: {
    "&:before": {
      border: "2px solid #272F34"
    },
    color: "#272F34"
  }
}));

export default function CartItem({ item, cartLength, isLoading }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const location = useLocation();
  const [loader, setLoader] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [itemQuantity, setItemQuantity] = useState(item.selectedQuantity);
  const cartItems = useSelector((state) => state.marketplaceReducer.cartItems);

  const { id, Nft } = item;

  const handleWishlistClickOpen = () => {
    setOpenDialog(true);
  };

  const handleWishlistSave = () => {
    setSaveLoading(true);
    dispatch(moveToWishlist({ ids: [id] }));
    setOpenDialog(false);
    setSaveLoading(false);
  };

  const handleWishlistClose = () => {
    setOpenDialog(false);
  };

  const handleDelete = (id) => {
    setLoader(true);
    if (location.pathname === "/cart") {
      dispatch(deleteCartItem({ id, setLoader }));
    }
    if (location.pathname === "/wishlist") {
      dispatch(deleteWishlistItem({ id: item?.NftId, setLoader }));
    }
  };

  const handleQuantity = (item, option) => {
    if (option === item.quantity && option === cartLength) return;
    dispatch(
      updateCartItem({ cartItemId: item.id, NftId: item.Nft.id, selectedQuantity: option, quantity: item.quantity })
    );
  };

  useEffect(() => {
    setItemQuantity(item.quantity);
  }, [item, cartItems]);

  return (
    <Box sx={{ my: 2 }}>
      <Card sx={{ display: "flex", borderRadius: 0, backgroundColor: "transparent", height: "9.438rem" }}>
        <CardMedia
          component="img"
          sx={{ width: "9.438rem", height: "9.438rem" }}
          image={Nft?.asset}
          alt="Product Image"
        />
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <CardContent orientation="horizontal" sx={{ pt: 0, pb: "0 !important", height: "9.438rem" }}>
            <Box sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                <div>
                  <StyledChip label={Nft.Brand.name} color="primary" variant="outlined" size="small" />
                  <Typography
                    level="body-xs"
                    sx={{
                      fontFamily: theme?.typography.appText,
                      fontWeight: "500",
                      fontSize: "20px",
                      lineHeight: "23.5px",
                      color: `${theme.palette.mode === "dark" ? "#ffffff" : "black"}`,
                      textOverflow: "ellipsis",
                      WebkitLineClamp: 1,
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden"
                    }}
                  >
                    {Nft.name.length > 60 ? Nft.name.slice(0, 60) + "..." : Nft.name}
                  </Typography>
                </div>

                <Box sx={{ display: "flex", alignItems: "center", pl: 1 }}>
                  <Stack direction="row" spacing={1}>
                    {location.pathname === "/wishlist" && (
                      <StyledAddToCartBtn
                        disabled={loader || isLoading}
                        variant="outlined"
                        onClick={() => dispatch(moveToCart({ id }))}
                      >
                        {theme.palette.mode === "dark" ? Icons.shoppingCartWhite : Icons.shoppingCart}Add to cart
                      </StyledAddToCartBtn>
                    )}

                    {location.pathname === "/cart" && (
                      <>
                        {item?.quantity !== 1 && (
                          <StyledTextDropDown
                            disabled={loader || isLoading}
                            id="outlined-select-number"
                            select
                            value={item.selectedQuantity}
                            defaultValue={itemQuantity}
                          >
                            {Array.from({ length: item.quantity }, (_, index) => index + 1).map((option, index) => (
                              <MenuItem key={index} value={option} onClick={() => handleQuantity(item, option)}>
                                {option}
                              </MenuItem>
                            ))}
                          </StyledTextDropDown>
                        )}
                      </>
                    )}

                    <StyledIconBtn1 variant="outlined" size="small" sx={{ borderColor: "#F6686880" }}>
                      <IconButton disabled={loader || isLoading} onClick={() => handleDelete(id)} aria-label="delete">
                        <img src={Remove} alt="remove from cart" />
                      </IconButton>
                    </StyledIconBtn1>

                    {location.pathname === "/cart" && (
                      <StyledIconBtn2 variant="outlined" sx={{ borderColor: "#FFFFFF80", background: "#181C1F" }}>
                        <IconButton
                          disabled={loader || isLoading}
                          aria-label="favorite"
                          onClick={handleWishlistClickOpen}
                        >
                          <FavoriteBorderIcon />
                        </IconButton>
                      </StyledIconBtn2>
                    )}
                  </Stack>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", marginTop: "1rem" }}>
                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                  <Typography
                    sx={{
                      fontFamily: theme?.typography.appText,
                      fontWeight: "600",
                      fontSize: "25px",
                      lineHeight: "29px",
                      letterSpacing: 0,
                      textAlign: "left",
                      color: `${theme.palette.mode === "dark" ? "#ffffff" : "black"}`
                    }}
                  >
                    {Nft.price}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: theme?.typography.appText,
                      fontWeight: "600",
                      fontSize: "16px",
                      lineHeight: "19px",
                      letterSpacing: 0,
                      textAlign: "left",
                      background: "linear-gradient(97.63deg, #657DE0 0%, #66EAE2 108.44%, #62C4E2 108.45%)",
                      WebkitTextFillColor: "transparent",
                      WebkitBackgroundClip: "text",
                      paddingLeft: 0.5,
                      color: "#ffffff"
                    }}
                  >
                    {Nft.currencyType}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                  <FiberManualRecordIcon
                    sx={{
                      fontFamily: theme?.typography.appText,
                      fontWeight: "400",
                      fontSize: "12px",
                      lineHeight: "14.1px",
                      letterSpacing: 0,
                      textAlign: "left",
                      paddingLeft: 0.5,
                      color: "#B7B9BA"
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: theme?.typography.appText,
                      fontWeight: "400",
                      fontSize: "12px",
                      lineHeight: "14.1px",
                      letterSpacing: 0,
                      textAlign: "left",
                      paddingLeft: 0.5,
                      color: "#B7B9BA"
                    }}
                  >
                    Eligible for FREE Shipping &
                  </Typography>

                  <Typography
                    sx={{
                      fontFamily: theme?.typography.appText,
                      fontWeight: "400",
                      fontSize: "12px",
                      lineHeight: "14.1px",
                      letterSpacing: 0,
                      textAlign: "left",
                      paddingLeft: 0.5,
                      color: "#2196f3"
                    }}
                  >
                    FREE Returns
                  </Typography>

                  <StyledTooltip
                    title={
                      <React.Fragment>
                        <Typography
                          sx={{
                            color: "#ffffff",
                            fontFamily: theme?.typography.appText,
                            fontWeight: 600,
                            fontSize: "14px",
                            lineHeight: "16.45px",
                            marginBottom: "0.5rem"
                          }}
                        >
                          Return this items for free
                        </Typography>
                        <Typography
                          sx={{
                            color: "#ffffff",
                            fontFamily: theme?.typography.appText,
                            fontWeight: 400,
                            fontSize: "13px",
                            lineHeight: "15.6px"
                          }}
                        >
                          Free returns are available for the shipping address you choose. You can return the items for
                          any reason in new and unused condition: no shipping charges
                        </Typography>
                      </React.Fragment>
                    }
                  >
                    <ExpandMoreIcon
                      sx={{
                        fontFamily: theme?.typography.appText,
                        fontWeight: "400",
                        fontSize: "22px",
                        lineHeight: "14.1px",
                        letterSpacing: 0,
                        textAlign: "left",
                        paddingLeft: 0.5,
                        color: "#2196f3",
                        cursor: "pointer"
                      }}
                    />
                  </StyledTooltip>

                  {/* <StyledTooltip
                    title={
                      <Fragment>
                        <Typography
                          sx={{
                            color: '#ffffff',
                            fontFamily: 'Public Sans, sans-serif',
                            fontWeight: 600,
                            fontSize: '14px',
                            lineHeight: '16.45px',
                            marginBottom: '0.5rem'
                          }}
                        >
                          Shipping & taxes details
                        </Typography>
                        <Divider />
                        <Stack
                          spacing={{ xs: 1, sm: 2 }}
                          direction="row"
                          useFlexGap
                          flexWrap="wrap"
                          justifyContent="space-between"
                          marginTop={1}
                        >
                          <Typography
                            sx={{
                              color: '#ffffff',
                              fontFamily: 'Public Sans, sans-serif',
                              fontWeight: 400,
                              fontSize: '13px',
                              lineHeight: '15.6px'
                            }}
                          >
                            Product price
                          </Typography>
                          <Typography
                            sx={{
                              color: '#ffffff',
                              fontFamily: 'Public Sans, sans-serif',
                              fontWeight: 400,
                              fontSize: '13px',
                              lineHeight: '15.6px'
                            }}
                          >
                            $34
                          </Typography>
                        </Stack>
                        <Stack
                          spacing={{ xs: 1, sm: 2 }}
                          direction="row"
                          useFlexGap
                          flexWrap="wrap"
                          justifyContent="space-between"
                          marginTop={1}
                          marginBottom={1}
                        >
                          <Typography
                            sx={{
                              color: '#ffffff',
                              fontFamily: 'Public Sans, sans-serif',
                              fontWeight: 400,
                              fontSize: '13px',
                              lineHeight: '15.6px'
                            }}
                          >
                            Import tax
                          </Typography>
                          <Typography
                            sx={{
                              color: '#ffffff',
                              fontFamily: 'Public Sans, sans-serif',
                              fontWeight: 400,
                              fontSize: '13px',
                              lineHeight: '15.6px'
                            }}
                          >
                            $2.5
                          </Typography>
                        </Stack>
                        <Divider />
                        <Stack
                          spacing={{ xs: 1, sm: 2 }}
                          direction="row"
                          useFlexGap
                          flexWrap="wrap"
                          justifyContent="space-between"
                          marginTop={1}
                        >
                          <Typography
                            sx={{
                              color: '#ffffff',
                              fontFamily: 'Public Sans, sans-serif',
                              fontWeight: 400,
                              fontSize: '13px',
                              lineHeight: '15.6px'
                            }}
                          >
                            Total
                          </Typography>
                          <Typography
                            sx={{
                              color: '#ffffff',
                              fontFamily: 'Public Sans, sans-serif',
                              fontWeight: 400,
                              fontSize: '13px',
                              lineHeight: '15.6px'
                            }}
                          >
                            $36.5
                          </Typography>
                        </Stack>
                      </Fragment>
                    }
                  >
                    <ExpandMoreIcon
                      sx={{
                        fontFamily: 'Public Sans, sans-serif',
                        fontWeight: '400',
                        fontSize: '22px',
                        lineHeight: '14.1px',
                        letterSpacing: 0,
                        textAlign: 'left',
                        paddingLeft: 0.5,
                        color: '#2196f3',
                        cursor: 'pointer'
                      }}
                    />
                  </StyledTooltip> */}
                </Box>
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontFamily: theme?.typography.appText,
                    fontWeight: "600",
                    fontSize: "14px",
                    lineHeight: "29px",
                    letterSpacing: 0,
                    textAlign: "left",
                    color: `${theme.palette.mode === "dark" ? "red" : "red"}`
                  }}
                >
                  {Nft?.errorMessage}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Box>
      </Card>

      <MoveToWishlistDialog
        openDialog={openDialog}
        saveLoading={saveLoading}
        handleWishlistClose={handleWishlistClose}
        handleWishlistSave={handleWishlistSave}
      />
    </Box>
  );
}
