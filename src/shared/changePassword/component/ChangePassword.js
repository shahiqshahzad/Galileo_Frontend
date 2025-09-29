import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  FormControl,
  Grid,
  FormHelperText,
  Typography,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput
} from "@mui/material";
import SubCard from "ui-component/cards/SubCard";
import * as Yup from "yup";
import { Formik } from "formik";
import AnimateButton from "ui-component/extended/AnimateButton";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "redux/auth/actions";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import React from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const ChangePassword = ({ token, ...others }) => {
  const user = useSelector((state) => state.auth?.user);
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (user.signupMethod !== "DIRECT") {
      navigate("/home");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
      <Grid container sx={{ alignItems: "center" }}>
        <h1 style={{ paddingLeft: "0.5%", display: "flex" }}>
          <ArrowBackIosIcon
            onClick={() => {
              navigate("/home");
            }}
            sx={{ color: "#2F53FF" }}
          />
        </h1>
        <h1
          className="MarketplaceHead"
          style={{ paddingLeft: "4.5%", color: theme.palette.mode === "dark" ? "white" : "#404040" }}
        >
          Change Password
        </h1>
      </Grid>
      <Grid mt={2} item xs={12}>
        <SubCard
          className="tableShadow"
          title={
            <Typography
              variant="h1"
              component="h2"
              className="mainheading"
              sx={{ marginTop: "10px", color: theme.palette.mode === "dark" ? "white" : "#404040", fontWeight: 600 }}
            >
              Change Password
            </Typography>
          }
        >
          <Formik
            initialValues={{
              newPassword: "",
              currentPassword: ""
            }}
            validationSchema={Yup.object().shape({
              newPassword: Yup.string().max(255).required("new Password is required!"),
              currentPassword: Yup.string().when("Current Password is required!", {
                is: (val) => !!(val && val.length > 0),
                then: Yup.string().oneOf([Yup.ref("password")], "Both Password must be match!")
              })
            })}
            onSubmit={async (values) => {
              dispatch(
                changePassword({
                  newPassword: values.newPassword,
                  currentPassword: values.currentPassword,
                  // token: token,
                  navigate: navigate
                })
              );
            }}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
              <form noValidate onSubmit={handleSubmit} {...others}>
                <FormControl
                  fullWidth
                  error={Boolean(touched.currentPassword && errors.currentPassword)}
                  sx={{ ...theme.typography.customInput }}
                >
                  <InputLabel htmlFor="outlined-adornment-password-login">Current Password</InputLabel>
                  <OutlinedInput
                    type={showPassword ? "text" : "password"}
                    value={values.currentPassword}
                    name="currentPassword"
                    onBlur={handleBlur}
                    onChange={handleChange}
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
                    label="current Password"
                    inputProps={{}}
                  />
                  {touched.currentPassword && errors.currentPassword && (
                    <FormHelperText error id="standard-weight-helper-text-password-login">
                      {errors.currentPassword}
                    </FormHelperText>
                  )}
                </FormControl>

                <FormControl
                  fullWidth
                  error={Boolean(touched.password && errors.password)}
                  sx={{ ...theme.typography.customInput }}
                >
                  <InputLabel htmlFor="outlined-adornment-password-login"> New Password</InputLabel>
                  <OutlinedInput
                    type={showConfirmPassword ? "text" : "password"}
                    value={values.newPassword}
                    name="newPassword"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowConfirmPassword((state) => !state)}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          size="large"
                        >
                          {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="New Password"
                    inputProps={{}}
                  />
                  {touched.newPassword && errors.newPassword && (
                    <FormHelperText error id="standard-weight-helper-text-password-login">
                      {errors.newPassword}
                    </FormHelperText>
                  )}
                </FormControl>

                {errors.submit && (
                  <Box sx={{ mt: 3 }}>
                    <FormHelperText error>{errors.submit}</FormHelperText>
                  </Box>
                )}

                <Box sx={{ mt: 2 }}>
                  <AnimateButton>
                    <Button
                      className="signbuttonMarket"
                      disableElevation
                      disabled={isSubmitting}
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      color="secondary"
                    >
                      Change Password
                    </Button>
                  </AnimateButton>
                </Box>
              </form>
            )}
          </Formik>
        </SubCard>
      </Grid>
    </>
  );
};

export default ChangePassword;
