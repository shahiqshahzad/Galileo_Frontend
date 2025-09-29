import { forwardRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { utils } from "ethers";
import { useFormik } from "formik";
import * as Yup from "yup";
import AnimateButton from "ui-component/extended/AnimateButton";
import { deactivationBrands } from "redux/brandCategory/actions";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  TextField,
  Divider,
  Grid,
  CircularProgress
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SNACKBAR_OPEN } from "store/actions";
import { useParams } from "react-router";

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function DeactivateBrandsDialog({
  checked,
  setChecked,
  brandCategoriesList,
  open,
  setOpen,
  brandCategoryData,
  page,
  limit,
  search
}) {
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();
  const params = useParams();

  const [loader, setLoader] = useState(false);
  const [brandId] = useState(params?.id);

  const checkWallet = async () => {
    const response = await window?.ethereum?.request({ method: "eth_requestAccounts" });
    let connectWallet = await window?.ethereum._metamask.isUnlocked();

    if ((window.ethereum && connectWallet) === false) {
      dispatch({
        type: SNACKBAR_OPEN,
        open: true,
        message: "No crypto wallet found. Please connect one",
        variant: "alert",
        alertSeverity: "info"
      });
      // toast.error('No crypto wallet found. Please install it.');
    }
    // else if (window?.ethereum?.networkVersion !== '5') {
    //     dispatch({
    //         type: SNACKBAR_OPEN,
    //         open: true,
    //         message: 'Please change your Chain ID to Goerli',
    //         variant: 'alert',
    //         alertSeverity: 'info'
    //     });
    //     console.log('Please change your Chain ID to Goerli');
    // }
    else if (utils?.getAddress(response[0]) !== user.walletAddress) {
      dispatch({
        type: SNACKBAR_OPEN,
        open: true,
        message: "Please connect your registered Wallet Address",
        variant: "alert",
        alertSeverity: "info"
      });
    } else {
      return true;
    }
  };
  const handleDeactivation = async (values) => {
    if (await checkWallet()) {
      if (values?.brandName === brandCategoriesList?.brand?.name) {
        setLoader(true);
        dispatch(
          deactivationBrands({
            brandId: brandId,
            isActive: brandCategoriesList?.brand?.isActive,
            page: page,
            limit: limit,
            search: search,
            handleClose: handleClose
          })
        );
        setOpen(false);
        formik.resetForm();
        setLoader(false);
      } else {
        toast.error("Invalid brand name!");
      }
    }
  };
  const validationSchema = Yup.object({
    brandName: Yup.string().required("Brand Name is required!").max(42, "Brand Name can not exceed 42 characters")
  });

  const formik = useFormik({
    enableReinitialize: true,

    initialValues: { brandName: "" },
    validationSchema,
    onSubmit: (values) => {
      handleDeactivation(values);
    }
  });
  const handleClose = () => {
    setOpen(false);
    formik.resetForm();
    setLoader(false);
  };

  return (
    <>
      <Dialog
        open={open}
        // onClose={handleClose}
        aria-labelledby="form-dialog-title"
        className="adminDialog dialog"
        maxWidth="sm"
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description1"
      >
        <DialogTitle id="form-dialog-title" className="deactive-Active">
          {brandCategoriesList !== undefined && brandCategoriesList?.brand?.isActive === false
            ? "Please added brand name for activation"
            : "Please added brand name for deactivation"}
        </DialogTitle>
        <Divider />
        <DialogContent>
          <form noValidate onSubmit={formik.handleSubmit}>
            <Grid container>
              <>
                <Grid item xs={12} pt={2}>
                  <TextField
                    className="textfieldStyle field"
                    variant="standard"
                    id="brandName"
                    name="brandName"
                    label="Enter Brand name"
                    value={formik.values.brandName}
                    onChange={formik.handleChange}
                    error={formik.touched.brandName && Boolean(formik.errors.brandName)}
                    helperText={formik.touched.brandName && formik.errors.brandName}
                    fullWidth
                    InputProps={{}}
                  />
                </Grid>
              </>
            </Grid>
          </form>
        </DialogContent>
        {loader ? (
          <DialogActions sx={{ display: "block" }}>
            <Grid container justifyContent="center" sx={{ width: "50%", m: "15px auto " }}>
              <Grid item>
                <CircularProgress disableShrink size={"4rem"} />
              </Grid>
            </Grid>

            <Button
              className="buttons"
              variant="Text"
              sx={{ width: "100%", margin: "0 auto", color: "#2196f3" }}
              size="large"
            >
              Please wait for Deactivation...
            </Button>
          </DialogActions>
        ) : (
          <DialogActions sx={{ display: "block", margin: "10px 10px 0px 20px" }}>
            <>
              <AnimateButton>
                <Button
                  variant="contained"
                  className="buttons"
                  sx={{
                    width: "92%",
                    margin: "0px 0px 10px 8px",
                    background: "linear-gradient(97.63deg, #2F57FF 0%, #2FA3FF 108.45%)"
                  }}
                  type="submit"
                  size="large"
                  disableElevation
                  onClick={() => {
                    formik.handleSubmit();
                  }}
                >
                  {brandCategoriesList !== undefined && brandCategoriesList?.brand?.isActive === false
                    ? "Activate brand"
                    : "Deactivate brand"}
                </Button>
              </AnimateButton>
              <AnimateButton>
                <Button
                  className="buttons"
                  variant="outlined"
                  sx={{ my: 1, ml: 0, width: "95%", margin: "0px 0px 10px 0px", color: "#4044ED" }}
                  onClick={handleClose}
                  color="secondary"
                  size="large"
                >
                  Cancel
                </Button>
              </AnimateButton>
            </>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
}
