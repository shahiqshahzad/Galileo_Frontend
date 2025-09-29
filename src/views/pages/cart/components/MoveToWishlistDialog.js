import React from "react";
import { Stack } from "@mui/system";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";

import { useTheme } from "@mui/material/styles";
import "./loader.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function MoveToWishlistDialog({ handleWishlistClose, handleWishlistSave, saveLoading, openDialog }) {
  const theme = useTheme();

  return (
    <div>
      <Dialog
        keepMounted
        open={openDialog}
        onClose={handleWishlistClose}
        TransitionComponent={Transition}
        aria-describedby="alert-dialog-slide-description"
      >
        {saveLoading || (
          <React.Fragment>
            <DialogTitle
              sx={{
                color: `${theme.palette.mode === "dark" ? "#ffffff" : "black"}`,
                fontFamily: theme?.typography.appText,
                fontWeight: 600,
                fontSize: "25px",
                lineHeight: "37.5px"
              }}
            >
              {"Move To Wishlist"}
            </DialogTitle>

            <IconButton
              aria-label="close"
              onClick={handleWishlistClose}
              sx={{
                position: "absolute",
                right: 24,
                top: 24,
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                color: `${theme.palette.mode === "dark" ? "#ffffff" : "black"}`
              }}
            >
              <CloseIcon />
            </IconButton>
          </React.Fragment>
        )}

        {saveLoading ? (
          <DialogContent sx={{ overflow: "hidden", height: "35vh", width: "35rem" }}>
            <Stack
              spacing={4}
              sx={{ overflow: "hidden", height: "100%", alignItems: "center", justifyContent: "center" }}
            >
              <span class="loader"></span>
              <Typography
                sx={{
                  fontFamily: theme?.typography.appText,
                  fontWeight: "600",
                  fontSize: "18px",
                  lineHeight: "21.15px",
                  letterSpacing: 0,
                  textAlign: "left",
                  color: `${theme.palette.mode === "dark" ? "white" : "black"}`,
                  pr: 1
                }}
              >
                Moving to cart
              </Typography>
            </Stack>
          </DialogContent>
        ) : (
          <DialogContent>
            <DialogContentText
              id="alert-dialog-slide-description"
              sx={{
                color: `${theme.palette.mode === "dark" ? "#ffffff" : "black"}`,
                fontFamily: theme?.typography.appText,
                fontWeight: 400,
                fontSize: "18px",
                lineHeight: "27px"
              }}
            >
              Item(s) will be moved to Wishlist and removed from cart.
            </DialogContentText>
          </DialogContent>
        )}

        {saveLoading || (
          <DialogActions sx={{ padding: "20px 24px" }}>
            <Button
              onClick={handleWishlistClose}
              sx={{
                padding: "11.5px, 30px, 11.5px, 30px",
                borderRadius: "4px",
                background: "#46494C",
                fontFamily: theme?.typography.appText,
                fontWeight: 400,
                fontSize: "18px",
                lineHeight: "27px",
                color: "#ffffff",
                "&:hover": { color: `${theme.palette.mode === "dark" ? "#ffffff" : "black"}` }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleWishlistSave}
              sx={{
                padding: "11.5px, 30px, 11.5px, 30px",
                borderRadius: "4px",
                background: "linear-gradient(97.63deg, #2F57FF 0%, #2FA3FF 108.45%)",
                fontFamily: theme?.typography.appText,
                fontWeight: 400,
                fontSize: "18px",
                lineHeight: "27px",
                color: "#ffffff"
              }}
            >
              Move
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </div>
  );
}
