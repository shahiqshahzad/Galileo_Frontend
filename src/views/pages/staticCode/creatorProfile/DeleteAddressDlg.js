import React from "react";
import { useDispatch } from "react-redux";
import { useTheme } from "@mui/material/styles";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Typography,
  CircularProgress
} from "@mui/material";
import { deleteAddress } from "redux/addresses/actions";
import { useState } from "react";

export default function DeleteAddressDlg({ id, open, handleClose }) {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [loader, setLoader] = useState(false);
  const handleDelete = () => {
    dispatch(deleteAddress({ id, setLoader, handleClose }));
  };
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title1"
        aria-describedby="alert-dialog-slide-description1"
      >
        <DialogTitle id="alert-dialog-slide-title1" className="statusHeading">
          Delete Address
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description1">
            <Typography variant="body2" component="span" className="statustypo">
              Are you sure you want to delete this Address?
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ pr: 2.5 }}>
          <Button
            disabled={loader}
            sx={{ color: theme.palette.error.dark, borderColor: theme.palette.error.dark }}
            onClick={handleClose}
            color="secondary"
            className="buttonSize"
            size="large"
            variant="outlined"
          >
            No
          </Button>
          <Button disabled={loader} variant="contained" className="buttonSize" size="large" onClick={handleDelete}>
            {loader ? <CircularProgress sx={{ color: "white" }} size={"1.5rem"} /> : "Yes"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
