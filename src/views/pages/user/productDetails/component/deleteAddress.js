import * as React from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useDispatch } from "react-redux";
import { Icons } from "shared/Icons/Icons";
import { useTheme } from "@mui/material/styles";

import { Grid, Typography } from "@mui/material";
import { deleteAddress } from "redux/permissioned/actions";

export default function DeletedDialog({ open, setOpen, setUpdatedAddress, updatedAddress }) {
  const theme = useTheme();

  const dispatch = useDispatch();

  const handleClose = () => {
    setUpdatedAddress({
      id: 0,
      NftId: 0,
      walletAddress: "",
      expTime: ""
    });
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        // onClose={handleClose}
        PaperProps={{
          style: {
            borderRadius: "1px", // Setting border radius
            width: "772px", // Setting width
            maxHeight: "451px"
          }
        }}
      >
        <form>
          <DialogTitle className="heading-addressed">
            <Grid container spacing={2} alignItems="center">
              <Grid item xs zeroMinWidth sx={{ textDecoration: "none", alignSelf: "center" }}>
                <Typography
                  sx={{ cursor: "pointer", color: theme.palette.mode === "light" ? "black" : "#fff" }}
                  align="left"
                  variant="h2"
                  className="serial-No"
                >
                  Delete address
                </Typography>
              </Grid>
              <Grid item sx={{ display: "flex", height: "60px", cursor: "pointer" }} onClick={handleClose}>
                {Icons?.closeicon}
              </Grid>
            </Grid>
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              sx={{ color: theme.palette.mode === "light" ? "black" : "#fff" }}
              className="title-of-address"
            >
              Are you sure you want to delete this address?
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ paddingRight: "20px" }}>
            <Button
              variant="contained"
              className="added-address"
              sx={{
                background: "#46494c",
                "&:hover": {
                  color: theme.palette.mode === "light" ? "#333" : "#fff",
                  border: theme.palette.mode === "light" ? "1px solid #333" : "1px solid #fff",
                  background: "transparent"
                }
              }}
              onClick={() => {
                dispatch(
                  deleteAddress({
                    NftId: updatedAddress?.NftId !== undefined && updatedAddress?.NftId,
                    id: updatedAddress?.id,
                    handleClose: handleClose
                  })
                );
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
