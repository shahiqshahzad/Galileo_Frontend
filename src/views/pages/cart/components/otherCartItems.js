import React from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import { styled } from "@mui/material/styles";
import { StyledTextDropDown, StyledChip, StyledTooltip } from "./CartItem";

import Remove from "../../../../assets/images/icons/remove-from-cart.svg";
import "./loader.css";
import { calculateFutureDate } from "utils/daysToDateConversion";

const StyledRemoveFromCartBtn = styled(Button)(({ theme }) => ({
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
}));

const StyledSaveForLaterBtn = styled(Button)(({ theme }) => ({
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
  background: `${theme.palette.mode === "dark" ? "#181C1F" : "#FFFFFF"}`,
  "> svg": {
    color: `${theme.palette.mode === "dark" ? "#FFFFFF" : "#2194FF"}`,
    background: "transparent"
  }
}));

export const OtherCartItems = ({ data, loader, theme, handleDelete, handleQuantity, handleWishlistSave }) => {
  return (
    <>
      {data.map((item, index) => {
        const { id, Nft } = item;

        return (
          <Card key={index} sx={{ display: "flex", borderRadius: 0, backgroundColor: "transparent" }}>
            <CardMedia
              component="img"
              sx={{ width: "13rem", height: "13rem", borderRadius: "6px" }}
              image={Nft?.asset}
              alt="Product Image"
            />
            <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
              <CardContent orientation="horizontal" sx={{ pt: 0, pb: "0 !important", pr: 0 }}>
                <Box sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                    <div>
                      <StyledChip label={Nft.Brand.name} color="primary" variant="outlined" size="small" />
                      <Typography
                        level="body-xs"
                        sx={{
                          fontFamily: theme?.typography.appText,
                          fontWeight: "500",
                          fontSize: "17.99px",
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
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      marginTop: "0.7rem",
                      paddingRight: "3px"
                    }}
                  >
                    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                      <Typography
                        sx={{
                          fontFamily: theme?.typography.appText,
                          fontWeight: "600",
                          fontSize: "18px",
                          lineHeight: "10px",
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
                          fontSize: "14.39px",
                          lineHeight: "16.91px",
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
                      <Typography
                        sx={{
                          fontFamily: theme?.typography.appText,
                          fontWeight: "400",
                          fontSize: "10.79px",
                          lineHeight: "12.68px",
                          letterSpacing: 0,
                          textAlign: "left",
                          color: "#B7B9BA"
                        }}
                      >
                        Eligible for FREE Shipping &
                      </Typography>

                      <Typography
                        sx={{
                          fontFamily: theme?.typography.appText,
                          fontWeight: "500",
                          fontSize: "10.79px",
                          lineHeight: "12.68px",
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
                              Free returns are available for the shipping address you choose. You can return the items
                              for any reason in new and unused condition: no shipping charges
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
                    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", width: "100%" }}>
                      <Typography
                        sx={{
                          fontFamily: theme?.typography.appText,
                          fontWeight: "400",
                          fontSize: "10.79px",
                          lineHeight: "12.68px",
                          letterSpacing: 0,
                          textAlign: "left",
                          color: "#B7B9BA",
                          marginRight: "auto"
                        }}
                      >
                        Taxes applied for on this product
                      </Typography>

                      <Typography
                        sx={{
                          fontFamily: theme?.typography.appText,
                          fontWeight: "500",
                          fontSize: "10.79px",
                          lineHeight: "12.68px",
                          letterSpacing: 0,
                          textAlign: "left",
                          paddingLeft: 0.5,
                          color: "#2196f3"
                        }}
                      >
                        View Details
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
                              Lorem Ipsum
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
                              Lorem Ipsum
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
                            color: "#2196f3",
                            cursor: "pointer",
                            marginRight: "-7px"
                          }}
                        />
                      </StyledTooltip>
                    </Box>
                    <Stack sx={{ flexDirection: "row", justifyContent: "space-between", width: "100%", py: "7px" }}>
                      <Typography
                        sx={{
                          fontFamily: theme?.typography.appText,
                          fontWeight: "400",
                          fontSize: "10.79px",
                          lineHeight: "12.68px",
                          letterSpacing: 0,
                          textAlign: "left",
                          color: "#B7B9BA"
                        }}
                      >
                        Taxes applied
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: theme?.typography.appText,
                          fontWeight: "500",
                          fontSize: "10.79px",
                          lineHeight: "12.68px",
                          letterSpacing: 0,
                          textAlign: "left",
                          paddingLeft: 0.5,
                          color: "#2196f3"
                        }}
                      >
                        {Nft?.taxAmount ? Nft?.taxAmount + " USDC" : 0}
                      </Typography>
                    </Stack>
                    <Stack sx={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                      <Typography
                        sx={{
                          fontFamily: theme?.typography.appText,
                          fontWeight: "400",
                          fontSize: "10.79px",
                          lineHeight: "12.68px",
                          letterSpacing: 0,
                          textAlign: "left",
                          color: "#B7B9BA"
                        }}
                      >
                        Shipping charges
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: theme?.typography.appText,
                          fontWeight: "500",
                          fontSize: "10.79px",
                          lineHeight: "12.68px",
                          letterSpacing: 0,
                          textAlign: "left",
                          paddingLeft: 0.5,
                          color: "#2196f3"
                        }}
                      >
                        {Nft?.shippingCalculationMethod === "FS"
                          ? "Free Shipping"
                          : Nft?.shippingCost
                            ? Nft?.shippingCost + " USDC"
                            : "select Shipping Address to calculate"}
                      </Typography>
                    </Stack>
                    {Nft?.shippingCalculationMethod === "CCS" && (
                      <Stack sx={{ mt: "5px", flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                        <Typography
                          sx={{
                            fontFamily: theme?.typography.appText,
                            fontWeight: "400",
                            fontSize: "10.79px",
                            lineHeight: "12.68px",
                            letterSpacing: 0,
                            textAlign: "left",
                            color: "#B7B9BA"
                          }}
                        >
                          Estimated delivery date for each product
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: theme?.typography.appText,
                            fontWeight: "500",
                            fontSize: "10.79px",
                            lineHeight: "12.68px",
                            letterSpacing: 0,
                            textAlign: "left",
                            paddingLeft: 0.5,
                            color: "#2196f3"
                          }}
                        >
                          {Nft?.estimatedDays
                            ? calculateFutureDate(Nft?.estimatedDays)
                            : "select Shipping Address to calculate"}
                        </Typography>
                      </Stack>
                    )}

                    <Box sx={{ display: "flex", alignItems: "center", marginTop: "1rem" }}>
                      <Stack direction="row" spacing={1}>
                        <StyledTextDropDown
                          disabled={loader}
                          id="outlined-select-number"
                          select
                          value={item.selectedQuantity}
                          defaultValue={item.selectedQuantity}
                        >
                          {Array.from({ length: item.quantity }, (_, index) => index + 1).map((option, index) => (
                            <MenuItem key={index} value={option} onClick={() => handleQuantity(item, option)}>
                              {option}
                            </MenuItem>
                          ))}
                        </StyledTextDropDown>

                        <StyledSaveForLaterBtn
                          disabled={loader}
                          variant="outlined"
                          onClick={() => handleWishlistSave(id)}
                        >
                          <FavoriteBorderIcon />
                          Add to wishlist
                        </StyledSaveForLaterBtn>

                        <StyledRemoveFromCartBtn disabled={loader} variant="outlined" onClick={() => handleDelete(id)}>
                          <img src={Remove} alt="remove from cart" />
                          Remove
                        </StyledRemoveFromCartBtn>
                      </Stack>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Box>
          </Card>
        );
      })}
    </>
  );
};
