import React, { useState } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useTheme } from "@mui/material/styles";
import { Icons } from "shared/Icons/Icons";

import { CircularProgress, Grid, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useDispatch } from "react-redux";
import { moveToWishlist } from "redux/marketplace/actions";

export default function BuyDialogConfirmation({ open, cartItems, handleClose, handleBuy, setSelectedAddress }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const moveToWishlistHandler = () => {
    const idsArray = cartItems.filter((item) => item?.Nft?.autoRedeem).map((item) => item?.id);
    if (idsArray.length) {
      setLoading(true);
      dispatch(moveToWishlist({ ids: idsArray, setLoading, handleClose }));
      setSelectedAddress();
    }
  };
  return (
    <div>
      <Dialog open={open} PaperProps={{ style: { padding: "2rem" } }}>
        <Grid
          item
          sx={{ display: "flex", justifyContent: "flex-end", height: "60px", cursor: "pointer" }}
          onClick={handleClose}
        >
          {Icons?.closeicon}
        </Grid>
        <DialogTitle className="heading-addressed">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs zeroMinWidth sx={{ textDecoration: "none", alignSelf: "center" }}>
              <Typography
                sx={{ cursor: "pointer", color: theme.palette.mode === "light" ? "black" : "#fff" }}
                align="left"
                variant="h2"
                className="serial-No"
              >
                Auto redeem items found
              </Typography>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{ color: theme.palette.mode === "light" ? "black" : "#fff" }}
            className="title-of-address"
          >
            Auto-redeem items can only be bought and redeemed at the same time. You can choose to Buy & Redeem all items
            in the cart or move auto-redeem items to wish list and proceed with buying
          </DialogContentText>
        </DialogContent>
        <Stack sx={{ flexDirection: "row", justifyContent: "flex-end", padding: "24px", gap: "5px" }}>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <Button
                variant="contained"
                className="added-address"
                sx={{
                  width: "100%",
                  background: "transparent",
                  boxShadow: "none",
                  "&:hover": {
                    color: theme.palette.mode === "light" ? "#333" : "#fff",
                    background: "transparent",
                    boxShadow: "none"
                  }
                }}
                onClick={moveToWishlistHandler}
              >
                Move to wishlist
              </Button>
              <Button
                variant="contained"
                className="added-address"
                sx={{
                  width: "100%",
                  background: "linear-gradient(97.63deg, #2F57FF 0%, #2FA3FF 108.45%)",
                  "&:hover": {
                    color: theme.palette.mode === "light" ? "#333" : "#fff",
                    background: "linear-gradient(97.63deg, #2F57FF 0%, #2FA3FF 108.45%)"
                  }
                }}
                onClick={handleBuy}
              >
                Buy & Redeem
              </Button>
            </>
          )}
        </Stack>
      </Dialog>
    </div>
  );
}
