import { forwardRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import AnimateButton from "ui-component/extended/AnimateButton";
import { updateBrandAdmin, addBrandAdmin } from "redux/brandAdmin/actions";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useTheme } from "@mui/material/styles";

import {
  Button,
  InputLabel,
  InputAdornment,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  TextField,
  Grid,
  Tooltip
} from "@mui/material";
const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function AddUpdateBrandAdminDialog({ open, setOpen, brandAdminData, page, limit, search }) {
  const dispatch = useDispatch();
  const [isUpdate, setIsUpdate] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  useEffect(() => {
    if (brandAdminData.id == null) {
      setIsUpdate(false);
    } else {
      setIsUpdate(true);
    }
  }, [brandAdminData]);

  const validationSchema = Yup.object({
    isUpdate: Yup.boolean().default(isUpdate),
    firstName: Yup.string().required("First Name is required!").max(42, "First Name can not exceed 42 characters"),
    // .matches(/^[-a-zA-Z0-9-()]+(\s+[-a-zA-Z0-9-()]+)*$/, 'Invalid First name'),
    lastName: Yup.string().required("Last Name is required!").max(42, "Last Name can not exceed 42 characters"),
    // .matches(/^[-a-zA-Z0-9-()]+(\s+[-a-zA-Z0-9-()]+)*$/, 'Invalid Last name'),
    adminEmail: Yup.string().email("Enter valid email").max(255).required("Email is required!"),

    adminPassword: Yup.mixed().when(["isUpdate"], {
      is: false,
      then: Yup.string()
        .required("Password is required!")
        .matches(
          /^(?=(?:.*[A-Z].*){1})(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
          "Must Contain 8 Characters,  One Uppercase, One Lowercase, One Number and one special case Character"
        ),
      otherwise: Yup.string().matches(
        /^(?=(?:.*[A-Z].*){1})(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Must Contain 8 Characters,  One Uppercase, One Lowercase, One Number and one special case Character"
      )
    }),
    walletAddress: Yup.string().required("Wallet address is required!")
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: brandAdminData,
    validationSchema,
    onSubmit: (values) => {
      if (brandAdminData.id == null) {
        dispatch(
          addBrandAdmin({
            brandId: brandAdminData.brandId,
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.adminEmail,
            password: values.adminPassword,
            page: page,
            limit: limit,
            search: search,
            walletAddress: values.walletAddress,
            handleClose: handleClose
          })
        );
      } else {
        dispatch(
          updateBrandAdmin({
            id: brandAdminData.id,
            brandId: brandAdminData.brandId,
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.adminEmail,
            password: values.adminPassword,
            walletAddress: values.walletAddress,
            page: page,
            limit: limit,
            search: search,
            handleClose: handleClose
          })
        );
      }
    }
  });
  const handleClose = () => {
    setOpen(false);
    formik.resetForm();
  };

  return (
    <>
      <Dialog
        open={open}
        // onClose={handleClose}
        aria-labelledby="form-dialog-title "
        className="createDialog dialog"
        maxWidth="md"
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description1"
      >
        <DialogTitle id="form-dialog-title" className="adminname">
          {brandAdminData.id == null ? "Create Brand Admin " : " Update Brand Admin "}
        </DialogTitle>

        <DialogContent>
          <form noValidate onSubmit={formik.handleSubmit}>
            <Grid container>
              <>
                <Grid item xs={6} md={12} lg={12}>
                  <InputLabel htmlFor="outlined-adornment-password-login" className="textfieldStyle">
                    First Name
                  </InputLabel>
                  <TextField
                    className="field"
                    name="firstName"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                    helperText={formik.touched.firstName && formik.errors.firstName}
                    fullWidth
                    variant="standard"
                  />
                </Grid>
                <Grid item xs={6} pt={2} md={12} lg={12}>
                  <InputLabel htmlFor="outlined-adornment-password-login" className="textfieldStyle">
                    Last Name
                  </InputLabel>
                  <TextField
                    className="field"
                    name="lastName"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                    helperText={formik.touched.lastName && formik.errors.lastName}
                    fullWidth
                    variant="standard"
                  />
                </Grid>
                <Grid item xs={6} pt={2} md={12} lg={12}>
                  <InputLabel htmlFor="outlined-adornment-password-login" className="textfieldStyle">
                    Email
                  </InputLabel>
                  <TextField
                    className="field"
                    name="adminEmail"
                    value={formik.values.adminEmail}
                    onChange={formik.handleChange}
                    error={formik.touched.adminEmail && Boolean(formik.errors.adminEmail)}
                    helperText={formik.touched.adminEmail && formik.errors.adminEmail}
                    fullWidth
                    variant="standard"
                  />
                </Grid>

                <Grid item xs={6} pt={2} md={12} lg={12}>
                  {/*           <InputLabel className="textfieldStyle" htmlFor="standard-adornment-password">Password</InputLabel>
                                <Input
                                  type={showPassword ? 'text' : 'password'}
                                  name="adminPassword"
                                  value={formik.values.adminPassword}
                                  onChange={formik.handleChange}
                                  error={formik.touched.adminPassword && Boolean(formik.errors.adminPassword)}
                                  helperText={formik.touched.adminPassword && formik.errors.adminPassword}
                                  fullWidth
                                  autoComplete="given-name"
                                  endAdornment={
                                    <InputAdornment position="end">
                                      <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                      >
                                        {showPassword ? <Visibility /> :  <VisibilityOff />}
                                      </IconButton>
                                    </InputAdornment>
                                  }
                                /> */}
                  <InputLabel htmlFor="standard-adornment-password" className="textfieldStyle">
                    Password
                  </InputLabel>
                  <TextField
                    className="field"
                    name="adminPassword"
                    type={showPassword ? "text" : "password"}
                    value={formik.values.adminPassword}
                    onChange={formik.handleChange}
                    error={formik.touched.adminPassword && Boolean(formik.errors.adminPassword)}
                    helperText={formik.touched.adminPassword && formik.errors.adminPassword}
                    fullWidth
                    variant="standard"
                    autoComplete="new-password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>

                          <Tooltip
                            title="Password should be at least 8 characters long containing 1 uppercase, 1 numeric and 1 special character"
                            arrow
                            placement="top-start"
                            componentsProps={{
                              tooltip: {
                                sx: {
                                  padding: "1rem",
                                  bgcolor: "#46494C",
                                  "& .MuiTooltip-arrow": {
                                    color: "#46494C"
                                  },
                                  fontFamily: theme?.typography.appText,
                                  color: "white",
                                  fontSize: "1rem",
                                  cursor: "pointer"
                                }
                              }
                            }}
                          >
                            <InfoOutlinedIcon sx={{ cursor: "pointer" }} color="primary" />
                          </Tooltip>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </>
            </Grid>
            <Grid item xs={6} md={12} lg={12} sx={{ mt: 1 }}>
              <InputLabel htmlFor="outlined-adornment-password-login" className="textfieldStyle">
                Wallet Address
              </InputLabel>
              <TextField
                className="field"
                name="walletAddress"
                value={formik.values.walletAddress}
                onChange={formik.handleChange}
                error={formik.touched.walletAddress && Boolean(formik.errors.walletAddress)}
                helperText={formik.touched.walletAddress && formik.errors.walletAddress}
                fullWidth
                variant="standard"
              />
            </Grid>
          </form>
        </DialogContent>

        <DialogActions sx={{ display: "block", margin: "10px 10px 0px 20px" }}>
          <AnimateButton>
            <Button
              variant="contained"
              sx={{
                width: "92%",
                margin: "0px 0px 10px 8px",
                background: "linear-gradient(97.63deg, #2F57FF 0%, #2FA3FF 108.45%)"
              }}
              type="submit"
              className="buttons"
              size="large"
              disableElevation
              onClick={() => {
                formik.handleSubmit();
              }}
            >
              {brandAdminData.id == null ? "Create " : "Update "}
            </Button>
          </AnimateButton>
          <AnimateButton>
            <Button
              variant="outlined"
              sx={{ width: "95%", margin: "0px 0px 10px 0px", color: "#4044ED" }}
              onClick={handleClose}
              className="buttons"
              size="large"
            >
              Cancel
            </Button>
          </AnimateButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
