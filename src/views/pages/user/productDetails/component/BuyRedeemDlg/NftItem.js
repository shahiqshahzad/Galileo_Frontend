import React from "react";

import "./loader.css";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import { calculateFutureDate } from "utils/daysToDateConversion";
import Chip from "@mui/material/Chip";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { formattedDecimals } from "utils/utilFunctions";

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

export const NftItem = ({ nft, theme, quantity, nftTax, selectedAddress, fetchShippingPriceLoading }) => {
  const showTaxValue = () => {
    if (!selectedAddress?.value) {
      return "Select Shipping Address to calculate";
    }
    if (selectedAddress?.value && fetchShippingPriceLoading) {
      return "Fetching...";
    }

    if (!nftTax) {
      return 0;
    }

    const taxValue = nftTax * +quantity;
    const taxValueToFixed = taxValue.toFixed(2);
    return `${taxValueToFixed} ${nft?.currencyType || ""}`;
  };

  const getFlatRateShipping = () => {
    const cost = nft?.flatRateShippingCost || 0;
    const price = nft?.noExternalCostForMultipleCopies ? cost : cost * quantity;
    return price.toFixed(2) + " " + nft?.currencyType;
  };
  return (
    <>
      <Card sx={{ display: "flex", borderRadius: 0, backgroundColor: "transparent" }}>
        <CardMedia
          component="img"
          sx={{ width: "13rem", height: "13rem", borderRadius: "6px" }}
          image={nft?.asset}
          alt="Product Image"
        />
        <Box sx={{ display: "flex", flexDirection: "column", width: "30rem" }}>
          <CardContent orientation="horizontal" sx={{ pt: 0, pb: "0 !important", pr: 0 }}>
            <Box sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                <div>
                  <StyledChip label={nft?.Brand?.name} color="primary" variant="outlined" size="small" />
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
                    {nft?.name?.length > 60 ? nft?.name.slice(0, 60) + "..." : nft?.name}
                  </Typography>
                </div>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginTop: "0.7rem" }}>
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
                    {nft?.salePrice ? (
                      <span className="alignment">
                        {/* {nft?.price && (
                          <span
                            style={{
                              color: "#4DA9FF",
                              backgroundColor: "#093157",
                              padding: "5px 10px 5px 10px",
                              borderRadius: "15px",
                              fontWeight: 500,
                              fontSize: "14px",
                              position: "absolute",
                              right: "0",
                              top: "0"
                            }}
                          >
                            {(((nft?.price - nft?.salePrice) / nft?.price) * 100).toFixed(2)}% off
                          </span>
                        )} */}
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {nft?.salePrice ? formattedDecimals(Number(nft?.salePrice).toFixed(2)) : 0}{" "}
                          <Typography
                            sx={{
                              fontFamily: theme?.typography.appText,
                              fontWeight: "600",
                              fontSize: "14.39px",
                              letterSpacing: 0,
                              textAlign: "left",
                              background: "linear-gradient(97.63deg, #657DE0 0%, #66EAE2 108.44%, #62C4E2 108.45%)",
                              WebkitTextFillColor: "transparent",
                              WebkitBackgroundClip: "text",
                              paddingLeft: 0.5,
                              color: "#ffffff"
                            }}
                          >
                            {nft?.currencyType}
                          </Typography>
                          {nft?.price && (
                            <span
                              style={{
                                fontSize: "14px",
                                color: "#B7B9BA",
                                fontWeight: 500,
                                textDecoration: "line-through",
                                paddingLeft: "10px"
                              }}
                            >
                              {formattedDecimals(Number(nft?.price).toFixed(2))} {nft?.currencyType}
                            </span>
                          )}
                        </div>
                      </span>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {nft?.price ? formattedDecimals(Number(nft?.price).toFixed(2)) : 0}{" "}
                        <Typography
                          sx={{
                            fontFamily: theme?.typography.appText,
                            fontWeight: "600",
                            fontSize: "14.39px",
                            letterSpacing: 0,
                            textAlign: "left",
                            background: "linear-gradient(97.63deg, #657DE0 0%, #66EAE2 108.44%, #62C4E2 108.45%)",
                            WebkitTextFillColor: "transparent",
                            WebkitBackgroundClip: "text",
                            paddingLeft: 0.5,
                            color: "#ffffff"
                          }}
                        >
                          {nft?.currencyType}
                        </Typography>
                      </div>
                    )}
                  </Typography>
                </Box>

                <Stack
                  sx={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                    py: "10px",
                    alignItems: "center",
                    mt: "5px"
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: theme?.typography.appText,
                      fontWeight: "400",
                      fontSize: "20px",
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
                      fontSize: "14px",
                      lineHeight: "12.68px",
                      letterSpacing: 0,
                      textAlign: "left",
                      paddingLeft: 0.5,
                      color: "#2196f3"
                    }}
                  >
                    {showTaxValue()}
                  </Typography>
                </Stack>
                <Stack
                  sx={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                    py: "10px",
                    alignItems: "center"
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: theme?.typography.appText,
                      fontWeight: "400",
                      fontSize: "20px",
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
                      fontSize: "14px",
                      lineHeight: "12.68px",
                      letterSpacing: 0,
                      textAlign: "left",
                      paddingLeft: 0.5,
                      color: "#2196f3"
                    }}
                  >
                    {nft?.shippingCalculationMethod === "FS"
                      ? "Free Shipping"
                      : nft?.shippingCalculationMethod === "FRS"
                        ? getFlatRateShipping()
                        : selectedAddress?.value && !fetchShippingPriceLoading
                          ? nft?.shippingCost
                            ? Number(nft?.shippingCost).toFixed(2) + " " + nft?.currencyType
                            : 0
                          : "select Shipping Address to calculate"}
                  </Typography>
                </Stack>
                <Stack
                  sx={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                    py: "10px",
                    alignItems: "center"
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: theme?.typography.appText,
                      fontWeight: "400",
                      fontSize: "20px",
                      lineHeight: "12.68px",
                      letterSpacing: 0,
                      textAlign: "left",
                      color: "#B7B9BA"
                    }}
                  >
                    Quantity
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: theme?.typography.appText,
                      fontWeight: "500",
                      fontSize: "12.79px",
                      lineHeight: "12.68px",
                      letterSpacing: 0,
                      textAlign: "left",
                      paddingLeft: 0.5,
                      color: "#2196f3"
                    }}
                  >
                    {quantity}
                  </Typography>
                </Stack>
                {nft?.shippingCalculationMethod === "CCS" && nft?.estimatedDays && (
                  <Stack sx={{ mt: "5px", flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                    <Typography
                      sx={{
                        fontFamily: theme?.typography.appText,
                        fontWeight: "400",
                        fontSize: "12.79px",
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
                        fontSize: "14px",
                        lineHeight: "12.68px",
                        letterSpacing: 0,
                        textAlign: "left",
                        paddingLeft: 0.5,
                        color: "#2196f3"
                      }}
                    >
                      {nft?.estimatedDays
                        ? calculateFutureDate(nft?.estimatedDays)
                        : "select Shipping Address to calculate"}
                    </Typography>
                  </Stack>
                )}
              </Box>
            </Box>
          </CardContent>
        </Box>
      </Card>
    </>
  );
};
