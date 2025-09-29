import * as React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { Icons } from "shared/Icons/Icons";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { makeStyles } from "@material-ui/core";
import { addAddress, updateAddress } from "redux/permissioned/actions";
import { Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import styled from "@emotion/styled";

const StyledDateTimePicker = styled(TextField)(({ theme }) => ({
  '& input[type="datetime-local"]::-webkit-calendar-picker-indicator': {
    filter: theme.palette.mode === "dark" ? "invert(1)" : "invert(0)",
    cursor: "pointer"
  }
}));

const validationSchema = Yup.object({
  address: Yup.string().required("Address is required!").max(42, "Address can not exceed 100 characters"),
  expireDatetime: Yup.date()
    .min(new Date(), "Expire datetime can't be in the past")
    .required("Expire datetime is required")
});

export default function AddFormDialog({
  setUpdatedAddress,
  NftId,
  id,
  open,
  setOpen,
  updatedAddress,
  setNewAddressAdded
}) {
  const dispatch = useDispatch();
  const theme = useTheme();

  const useStyles = makeStyles((theme) => ({
    field: {
      "&::placeholder": {
        [theme.breakpoints.up("xs")]: {
          color: "#757575",
          fontFamily: theme?.typography.appText,
          fontSize: "14px",
          fontStyle: "normal",
          fontWeight: "400",
          lineHeight: "normal",
          opacity: 1 // This is to make the color fully opaque.
        },
        [theme.breakpoints.up("md")]: {
          color: "#757575",
          fontFamily: theme?.typography.appText,
          fontSize: "20px !important",
          fontStyle: "normal",
          fontWeight: "400",
          lineHeight: "normal",
          opacity: 1 // This is to make the color fully opaque.
        }
      },

      backgroundColor: "transparent"
    }
  }));
  const classes = useStyles();

  const handleClose = () => {
    setOpen(false);
    setUpdatedAddress({
      id: 0,
      NftId: 0,
      walletAddress: "",
      expTime: ""
    });
    formik.resetForm();
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      address: updatedAddress?.walletAddress,
      expireDatetime: updatedAddress?.expTime.split(".")[0]
      // expireDatetime: moment(`${updatedAddress?.expTime}`).format('MM/DD/YYYY h:mm a')
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (updatedAddress?.NftId === 0) {
        dispatch(
          addAddress({
            walletAddress: values.address,
            expTime: values.expireDatetime,
            // userTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            NftId: NftId !== undefined && NftId,
            id: NftId !== undefined && NftId,
            handleClose: handleClose
          })
        );
        setNewAddressAdded(true);
      } else {
        dispatch(
          updateAddress({
            walletAddress: values?.address,
            expTime: values?.expireDatetime,
            NftId: updatedAddress?.NftId !== undefined && updatedAddress?.NftId,
            id: updatedAddress?.id,
            userTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            handleClose: handleClose
          })
        );
      }

      // handleClose();
    }
  });

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
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle className="heading-addressed">
            <Grid container spacing={2} alignItems="center">
              <Grid item xs zeroMinWidth sx={{ textDecoration: "none", alignSelf: "center" }}>
                <Typography
                  sx={{
                    cursor: "pointer",
                    color: theme.palette.mode === "light" ? "black" : "#fff"
                  }}
                  align="left"
                  variant="h2"
                  className="serial-No"
                >
                  {updatedAddress?.id !== 0 ? " Edit address " : " Add address "}
                </Typography>
              </Grid>
              <Grid item sx={{ display: "flex", height: "60px", cursor: "pointer" }} onClick={handleClose}>
                {Icons?.closeicon}
              </Grid>
            </Grid>
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              sx={{ color: theme.palette.mode === "light" ? "black" : "#8492c4" }}
              className="title-of-address"
            >
              Add new address
            </DialogContentText>
            <TextField
              className={classes.field}
              id="address"
              name="address"
              placeholder="Enter Address"
              // label=""
              fullWidth
              initialValues={updatedAddress?.walletAddress}
              value={formik.values.address}
              onChange={formik.handleChange}
              error={formik.touched.address && Boolean(formik.errors.address)}
              helperText={formik.touched.address && formik.errors.address}
              autoComplete="given-name"
              variant="standard"
            />
            <DialogContentText
              sx={{ mt: 3, color: theme.palette.mode === "light" ? "black" : "#8492c4" }}
              className="title-of-address"
            >
              Expire Datetime
            </DialogContentText>
            <StyledDateTimePicker
              sx={{ mt: 1 }}
              id="expireDatetime"
              type={"datetime-local"}
              fullWidth
              variant="standard"
              value={formik.values.expireDatetime}
              onChange={formik.handleChange}
              error={formik.touched.expireDatetime && Boolean(formik.errors.expireDatetime)}
              helperText={formik.touched.expireDatetime && formik.errors.expireDatetime}
            />
          </DialogContent>
          <DialogActions sx={{ paddingRight: "20px" }}>
            <Button
              variant="contained"
              className="added-address"
              type="submit"
              autoFocus
              disabled={
                formik.values.address && formik.values.expireDatetime && formik.values.expireDatetime !== "Invalid date"
                  ? false
                  : true
              }
              sx={{
                background:
                  formik.values.address &&
                  formik.values.expireDatetime &&
                  formik.values.expireDatetime !== "Invalid date"
                    ? "linear-gradient(97.63deg, #2F57FF 0%, #2FA3FF 108.45%)"
                    : "#46494c",
                "&:hover": {
                  color: theme.palette.mode === "light" ? "#333" : "#fff",
                  border: theme.palette.mode === "light" ? "1px solid #333" : "1px solid #fff",
                  background: "transparent"
                }
              }}
            >
              {updatedAddress?.id !== 0 ? " Edit address " : " Add address "}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
