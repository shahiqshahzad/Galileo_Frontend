import React, { useEffect, useState } from "react";
import axios from "axios";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../login/component/loginForm.css";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import TextField from "@material-ui/core/TextField";
import "@fontsource/source-sans-pro";
import "@fontsource/public-sans";
import { CircularProgress, Grid, Typography } from "@mui/material";
import { Box, Button, FormControl, FormHelperText, InputLabel, Stack } from "@mui/material";
import * as Yup from "yup";
import { Formik } from "formik";
import "@fontsource/public-sans";
import AnimateButton from "ui-component/extended/AnimateButton";
import { useNavigate } from "react-router-dom";
import { setLoader } from "redux/auth/actions";
import "react-toastify/dist/ReactToastify.css";
import "../../../login/component/loginForm.css";
import { Link } from "react-router-dom";
import { Link as MuiLink } from "@mui/material";
import { Icons } from "shared/Icons/Icons";
import { gridSpacing } from "store/constant";
import { GoogleLogin } from "@react-oauth/google";
import { loginSuccess } from "redux/auth/actions";

let jwt = require("jsonwebtoken");

const Email = ({ loginProp, referalCode, ...others }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showSocialMedia, setShowSocialMedia] = useState(true);
  const theme = useTheme();

  const loader = useSelector((state) => state.auth.loader);
  const restrictApplicationss = useSelector((state) => state.auth.restrictApplication);

  let InputProps = {
    style: { borderRadius: 0, background: "inherit", border: "1px solid #757575" }
  };
  let inputStyles = {
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

  const googleAuthHandle = async (data) => {
    const decoded_data = jwt.decode(data.credential);

    axios
      .post(process.env.REACT_APP_API_URL + "auth/google/callback/success", {
        data: decoded_data
      })
      .then(function (response) {
        dispatch(loginSuccess(response.data.data));

        if (!response.data.data.profileCompleted) {
          navigate("/socialLogin", {
            state: { social: response.data.data, referalCode }
          });
        } else {
          navigate("/home", {
            state: { social: response.data.data }
          });
        }
      })
      .catch(function (error) {
        if (error?.response?.data?.data?.message) {
          const message = error?.response?.data?.data?.message;
          toast.error(message);
          return;
        }
        toast.error(error.message);
      });
  };

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{
          email: ""
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email("Enter valid email").max(255).required("Email is required!")
        })}
        onSubmit={async (values) => {
          dispatch(setLoader(true));
          try {
            const { data } = await axios.post(process.env.REACT_APP_API_URL + "auth/checkEmail", {
              email: values?.email
            });
            if (data && data?.data?.loginMethod) {
              toast.error("This user is already registered. Please sign in instead.");
            }
          } catch (error) {
            if (error?.response?.data?.data?.message !== "Something went wrong") {
              dispatch(setLoader(false));
              navigate("/signUp", {
                state: { email: values.email, referalCode }
              });
            } else {
              toast.error("Something went wrong");
            }
          } finally {
            dispatch(setLoader(false));
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            {/* {whitelistError && <div>You are not whitelisted. Please contact the administrator.</div>} */}
            <InputLabel
              sx={{ color: theme.palette.mode === "dark" ? "white" : "#404040" }}
              className="authFont"
              htmlFor="outlined-adornment-email-login"
            >
              Email Address
            </InputLabel>
            <FormControl
              sx={{ ...inputStyles }}
              // InputProps={{ ...InputProps }}
              className="auth-formcontrol"
              fullWidth
              error={Boolean(touched.email && errors.email)}
            >
              <TextField
                // sx={{ ...inputStyles }}
                InputProps={{ ...InputProps }}
                placeholder="email"
                // onChange={(event)=>handelAccount("password",event)}
                variant="outlined"
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

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                {loader ? (
                  <Stack sx={{ alignItems: "center" }}>
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
                    Next
                  </Button>
                )}
              </AnimateButton>
            </Box>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Grid item container direction="column" alignItems="center" xs={12}>
                <Typography
                  className="haveAccount"
                  component={Link}
                  to="/login"
                  variant="subtitle1"
                  sx={{ textDecoration: "none" }}
                >
                  Already have an account? <span className="SignupText"> Sign in </span>
                </Typography>
              </Grid>
            </Grid>
            {!restrictApplicationss?.isInEU && !restrictApplicationss?.isInAvailableCountry && (
              <Box
                sx={{
                  bgcolor: "#FFE2E0",
                  color: "#000000",
                  p: 2,
                  mt: 2,
                  fontSize: "14px",
                  display: "flex",
                  fontWeight: "400",
                  borderRadius: "4px"
                }}
              >
                <Box sx={{ marginRight: "8px" }}>{Icons.warningIcon}</Box>
                <Typography>
                  The application is unavailable in your country. For assistance, please{" "}
                  <MuiLink href="mailto:hello@galileoprotocol.io" rel="noopener noreferrer">
                    Support Team
                  </MuiLink>
                </Typography>
              </Box>
            )}
            {showSocialMedia && (restrictApplicationss?.isInEU || restrictApplicationss?.isInAvailableCountry) && (
              <>
                <Grid item xs={12}>
                  <Grid mt={2} mb={-2} item container direction="column" alignItems="center" xs={12}>
                    <Typography
                      className="oRsigninwith"
                      variant="subtitle1"
                      sx={{ textDecoration: "none", fontSize: "16px" }}
                    >
                      or continue with
                    </Typography>
                  </Grid>
                </Grid>
                <Grid mt={1} container spacing={gridSpacing}>
                  <Grid item xs={12}>
                    <Grid container spacing={gridSpacing}>
                      <Grid item lg={12} md={12} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                        <Box sx={{ float: { md: "center" } }}>
                          <GoogleLogin
                            type="standard"
                            onSuccess={(data) => {
                              // console.log('datafrom google login', data);
                              googleAuthHandle(data);
                            }}
                            onError={() => {
                              toast.error("Google Auth Failed");
                            }}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            )}
          </form>
        )}
      </Formik>
    </>
  );
};

export default Email;
