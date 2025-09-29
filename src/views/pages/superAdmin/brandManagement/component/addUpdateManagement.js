import { useState, forwardRef } from "react";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FormattedMessage } from "react-intl";
import AnimateButton from "ui-component/extended/AnimateButton";

import { updateBrandAdmin, addBrandAdmin } from "redux/brandManagement/actions";
import { useTheme } from "@mui/material/styles";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Button,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  IconButton,
  InputAdornment,
  TextField,
  Divider,
  OutlinedInput,
  FormHelperText,
  FormControl,
  MenuItem,
  Grid,
  Stack
} from "@mui/material";
const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function AddUpdateDialog({
  brandManagement,
  brandsList,
  setBrandManagement,
  open,
  setOpen,
  setUpdate,
  page,
  limit,
  search,
  brandName,
  setBrandName,
  brandId
}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [brand, setBrand] = useState(0);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleBrandChange = (event) => {
    setBrand(event.target.value);
  };
  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required!").max(400, "First Name can not exceed 400 characters"),
    // .matches(/^[-a-zA-Z0-9-()]+(\s+[-a-zA-Z0-9-()]+)*$/, 'Invalid First name'),
    lastName: Yup.string().required("Last Name is required!").max(42, "Last Name can not exceed 42 characters"),
    // .matches(/^[-a-zA-Z0-9-()]+(\s+[-a-zA-Z0-9-()]+)*$/, 'Invalid Last name'),
    email: Yup.string().email("Enter valid email").max(255).required("Email is required!"),
    password: Yup.string()
      .max(255)
      .required("Password is required!")
      .matches(
        /^(?=(?:.*[A-Z].*){1})(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Must Contain 8 Characters,  One Uppercase, One Lowercase, One Number and one special case Character"
      )
  });
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: brandManagement,
    validationSchema,
    onSubmit: (values) => {
      if (brandManagement.firstName == "") {
        dispatch(
          addBrandAdmin({
            firstName: values.firstName,
            lastName: values.lastName,
            brandName: brand,
            email: values.email,
            password: values.password,
            page: page,
            limit: limit,
            search: search,
            handleClose: handleClose
          })
        );
      } else {
        dispatch(
          updateBrandAdmin({
            email: brandManagement.email,
            password: values.password,
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
    setBrandManagement({
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      block: ""
    });
    setOpen(false);

    formik.resetForm();
  };

  return (
    <>
      <Dialog
        open={open}
        //  onClose={handleClose}
        handleBrandChange={handleBrandChange}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {brandManagement.firstName !== "" ? "Update Brand Admin " : " Add Brand Admin "}
        </DialogTitle>
        <Divider />
        <DialogContent>
          <form noValidate onSubmit={formik.handleSubmit}>
            <Grid container>
              {brandManagement.firstName == "" ? (
                <>
                  <InputLabel htmlFor="outlined-adornment-password-login">First Name</InputLabel>
                  <TextField
                    name="firstName"
                    // label="First firstName"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                    helperText={formik.touched.firstName && formik.errors.firstName}
                    fullWidth
                    autoComplete="given-name"
                  />
                  <InputLabel sx={{ marginTop: "25px" }} htmlFor="outlined-adornment-password-login">
                    Last Name
                  </InputLabel>
                  <TextField
                    name="lastName"
                    // label="Last lastName"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                    helperText={formik.touched.lastName && formik.errors.lastName}
                    fullWidth
                    autoComplete="given-name"
                  />

                  <InputLabel sx={{ marginTop: "25px" }} htmlFor="outlined-adornment-password-login">
                    Brand Name
                  </InputLabel>

                  <FormControl fullWidth>
                    <TextField
                      id="outlined-select-currency"
                      select
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={brand}
                      defaultValue={formik.values.brand}
                      onChange={handleBrandChange}
                      error={formik.touched.brand && Boolean(formik.errors.brand)}
                      helperText={formik.touched.brand && formik.errors.brand}
                      autoComplete="given-name"
                    >
                      <MenuItem value={0}>Choose Brand</MenuItem>
                      {brandsList != undefined &&
                        brandsList?.brands?.map((option, index) => (
                          <MenuItem key={index} value={option.name}>
                            {option.name}
                          </MenuItem>
                        ))}
                    </TextField>
                  </FormControl>
                  <InputLabel sx={{ marginTop: "25px" }} htmlFor="outlined-adornment-password-login">
                    Email
                  </InputLabel>
                  <TextField
                    id="email"
                    name="email"
                    // label="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    fullWidth
                    autoComplete="given-name"
                  />
                  <InputLabel sx={{ marginTop: "25px" }} htmlFor="outlined-adornment-password-login">
                    Password (should contain 1 Uppercase, 1 Numeric and 1 Special character)
                  </InputLabel>
                  <OutlinedInput
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    value={formik.values.password}
                    name="password"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    autoComplete="given-name"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          size="large"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {formik.touched.password && formik.errors.password && (
                    <FormHelperText sx={{ marginLeft: "18px" }} error id="standard-weight-helper-text-password-login">
                      {formik.errors.password}
                    </FormHelperText>
                  )}
                </>
              ) : (
                <>
                  <InputLabel sx={{ marginTop: "25px" }} htmlFor="outlined-adornment-password-login">
                    Email
                  </InputLabel>
                  <TextField
                    id="email"
                    name="email"
                    // label="Email"
                    value={brandManagement.email}
                    // onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    fullWidth
                    autoComplete="given-name"
                  />
                  <InputLabel sx={{ marginTop: "25px" }} htmlFor="outlined-adornment-password-login">
                    Password
                  </InputLabel>
                  <OutlinedInput
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    value={formik.values.password}
                    name="password"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    autoComplete="given-name"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          size="large"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {formik.touched.password && formik.errors.password && (
                    <FormHelperText sx={{ marginLeft: "18px" }} error id="standard-weight-helper-text-password-login">
                      {formik.errors.password}
                    </FormHelperText>
                  )}
                </>
              )}
            </Grid>
          </form>
        </DialogContent>

        <DialogActions sx={{ pr: 3 }}>
          <AnimateButton>
            <Button
              variant="contained"
              sx={{ my: 3, ml: 1 }}
              type="submit"
              size="large"
              disableElevation
              onClick={() => {
                formik.handleSubmit();
              }}
            >
              {brandManagement.firstName !== "" ? "Update " : "Add "}
            </Button>
          </AnimateButton>
          <AnimateButton>
            <Button
              variant="contained"
              sx={{ my: 3, ml: 1, color: "#fff" }}
              onClick={handleClose}
              color="secondary"
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
