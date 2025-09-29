import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import TextField from "@material-ui/core/TextField";
import "@fontsource/source-sans-pro";
import "@fontsource/public-sans";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { CircularProgress } from "@mui/material";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  Stack,
  Typography,
  Tooltip
} from "@mui/material";
import * as Yup from "yup";
import { Formik } from "formik";
import "@fontsource/public-sans";
import AnimateButton from "ui-component/extended/AnimateButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { login } from "redux/auth/actions";
import { useNavigate } from "react-router-dom";
import { setLoader } from "redux/auth/actions";
import { useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "../loginForm.css";

const Password = ({ loginProp, ...others }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showSocialMedia, setShowSocialMedia] = useState(true);
  const theme = useTheme();
  const location = useLocation();
  const loader = useSelector((state) => state.auth.loader);
  const restrictApplicationss = useSelector((state) => state.auth.restrictApplication);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  let InputProps = {
    style: { borderRadius: 0, background: "inherit", border: "1px solid #757575" }
  };
  let inputStyles = {
    "& fieldset": { border: "1px solid #757575" },
    ".MuiInputBase-input": {
      padding: "14.5px 14px",
      color: "#fff",
      cursor: "pointer"
    }
  };
  useEffect(() => {
    if (/mobile|android|iphone|ipad|iemobile/.test(window.navigator.userAgent.toLowerCase())) {
      if (/metamaskmobile/.test(window.navigator.userAgent.toLowerCase())) {
        setShowSocialMedia(false);
      }
    }
  }, [showSocialMedia]);

  useEffect(() => {
    dispatch(setLoader(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{
          password: ""
        }}
        validationSchema={Yup.object().shape({
          password: Yup.string().max(255).required("Password is required!")
          // .matches(
          //     /^(?=(?:.*[A-Z].*){1})(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
          //     'Must Contain 8 Characters,  One Uppercase, One Lowercase, One Number and one special case Character'
          // )
        })}
        onSubmit={async (values) => {
          await dispatch(setLoader(true));
          dispatch(
            login({
              email: location?.state?.email,
              password: values.password,
              navigate: navigate
            })
          );
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            {/* {whitelistError && <div>You are not whitelisted. Please contact the administrator.</div>} */}

            <InputLabel
              sx={{ color: theme.palette.mode === "dark" ? "white" : "#404040" }}
              className="authFont"
              htmlFor="outlined-adornment-password-login"
            >
              Password
            </InputLabel>
            <FormControl className="auth-formcontrol" fullWidth error={Boolean(touched.password && errors.password)}>
              <TextField
                sx={{ ...inputStyles }}
                placeholder=" Password"
                className="textForm"
                // onChange={(event)=>handelAccount("password",event)}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                type={showPassword ? "text" : "password"}
                id="password"
                onBlur={handleBlur}
                onChange={handleChange}
                autoComplete="new-password"
                InputProps={{
                  ...InputProps,
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
                              fontFamily: "Public Sans",
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
              {touched.password && errors.password && (
                <FormHelperText error id="standard-weight-helper-text-password-login">
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>

            <Stack direction="row" justifyContent="space-between" spacing={1} sx={{ mb: 2, float: "right" }}>
              <Typography
                className="Forgot"
                variant="subtitle1"
                component={Link}
                to={"/forgetPassword"}
                sx={{
                  textDecoration: "none",

                  color: "#2F57FF"
                }}
              >
                Forgot Password?
              </Typography>
            </Stack>
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                {loader ? (
                  <Stack sx={{ alignItems: "center", width: "100%" }}>
                    <CircularProgress />
                  </Stack>
                ) : (
                  <Button
                    className="signbuttonMarket"
                    disableElevation
                    disabled={
                      isSubmitting || (!restrictApplicationss?.isInEU && !restrictApplicationss?.isInAvailableCountry)
                    }
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    color="secondary"
                  >
                    Sign in
                  </Button>
                )}
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default Password;
