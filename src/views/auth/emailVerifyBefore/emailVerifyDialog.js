import { forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Slide,
  DialogContentText,
  FormControl,
  TextField,
  Box,
  Grid
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import * as Yup from "yup";
import { Formik } from "formik";
import { updateEmail } from "redux/auth/actions";

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
export default function EmailVerifyDialog({
  nftInfo,
  categoryId,
  type,
  search,
  page,
  limit,
  loader,
  setLoader,
  open,
  setOpen,
  ...others
}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const handleClose = () => {
    setOpen(false);
  };
  const user = useSelector((state) => state.auth.user);
  const email = useSelector((state) => state.auth.email);

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        // onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title1"
        aria-describedby="alert-dialog-slide-description1"
      >
        <Formik
          enableReinitialize
          initialValues={{
            email: email ? email : user?.email
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string().email("Enter valid email").max(255).required("Email is required!")
          })}
          onSubmit={async (values) => {
            // if (walletAddress == '') {
            //     dispatch({
            //         type: SNACKBAR_OPEN,
            //         open: true,
            //         message: 'Please connect to your wallet',
            //         variant: 'alert',
            //         alertSeverity: 'info'
            //     });
            // }
            await dispatch(
              updateEmail({
                id: user.id,
                email: values.email,
                handleClose: handleClose
              })
            );
          }}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            <form noValidate onSubmit={handleSubmit} {...others}>
              <DialogTitle id="alert-dialog-slide-title1" className="statusHeading ChangeEmail">
                Change Email Address
              </DialogTitle>

              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description1">
                  <FormControl
                    sx={{ ...theme.typography.customInput }}
                    className="auth-formcontrol"
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                  >
                    <TextField
                      placeholder="email"
                      className="textForm"
                      // onChange={(event)=>handelAccount("password",event)}
                      variant="standard"
                      margin="normal"
                      required
                      fullWidth
                      type="email"
                      value={values.email}
                      name="email"
                      autoComplete="current-email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      inputProps={{}}
                    />
                    {touched.email && errors.email && (
                      <FormHelperText error id="standard-weight-helper-text-email-login">
                        {errors.email}
                      </FormHelperText>
                    )}
                  </FormControl>
                  {errors.submit && (
                    <Box sx={{ mt: 3 }}>
                      <FormHelperText error>{errors.submit}</FormHelperText>
                    </Box>
                  )}
                </DialogContentText>
              </DialogContent>

              <Box sx={{ display: "flex", padding: "0px 18px" }}>
                <Grid xs={6} md={6}>
                  <Button
                    sx={{ float: { md: "left" } }}
                    variant="text"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleClose}
                  >
                    back
                  </Button>
                </Grid>
                <Grid xs={6} md={6}>
                  <Button
                    variant="contained"
                    sx={{
                      float: { md: "right" },
                      background: "#3e2723",
                      color: "#fff",
                      "&:hover": {
                        background: "#3e2723"
                      }
                    }}
                    disableElevation
                    disabled={isSubmitting}
                    fullWidth
                    type="submit"
                    className="buttonSize"
                    size="large"
                    onClick={() => {
                      // dispatch(
                      //     deleteNft({
                      //         id: nftInfo.id,
                      //         categoryId: categoryId,
                      //         type: type,
                      //         page: page,
                      //         limit: limit,
                      //         search: search,
                      //         brandId: user.BrandId,
                      //         handleClose: handleClose
                      //     })
                      // );
                    }}
                  >
                    change
                  </Button>
                </Grid>
              </Box>
            </form>
          )}
        </Formik>
      </Dialog>
    </>
  );
}
