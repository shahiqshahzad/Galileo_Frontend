import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import TextField from "@material-ui/core/TextField";
import "@fontsource/source-sans-pro";
import "@fontsource/public-sans";
// import { magic } from "utils/magic";

import { CircularProgress, Link as MuiLink } from "@mui/material";
import { Box, Button, FormControl, FormHelperText, Grid, InputLabel, Stack, Typography } from "@mui/material";
import * as Yup from "yup";
import { Formik } from "formik";
import "@fontsource/public-sans";
import AnimateButton from "ui-component/extended/AnimateButton";
import { loginSuccess } from "redux/auth/actions";
import { useNavigate } from "react-router-dom";
import { setLoader } from "redux/auth/actions";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { gridSpacing } from "store/constant";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../loginForm.css";
import { Icons } from "shared/Icons/Icons";
let jwt = require("jsonwebtoken");

const Email = ({ loginProp, ...others }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showSocialMedia, setShowSocialMedia] = useState(true);
  const theme = useTheme();
  const loader = useSelector((state) => state?.auth.loader);
  const restrictApplicationss = useSelector((state) => state?.auth.restrictApplication);

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
            state: { social: response.data.data }
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

  // eslint-disable-next-line no-unused-vars
  const responseFacebook = (data) => {
    let { email, first_name, last_name } = data;
    axios
      .post(process.env.REACT_APP_API_URL + "auth/facebook/callback/success", {
        data: { email, first_name, last_name }
      })
      .then(function (response) {
        dispatch(loginSuccess(response.data.data));

        if (!response.data.data.profileCompleted) {
          navigate("/socialLogin", {
            state: { social: response.data.data }
          });
        } else {
          navigate("/home", {
            state: { social: response.data.data }
          });
        }
      })
      .catch(function (error) {
        toast.error(error.message);
      });
  };

  return (
    <></>
    // <>
    //   <Formik
    //     enableReinitialize
    //     initialValues={{
    //       email: ""
    //     }}
    //     validationSchema={Yup.object().shape({
    //       email: Yup.string().email("Enter valid email").max(255).required("Email is required!")
    //     })}
    //     onSubmit={async (values) => {
    //       dispatch(setLoader(true));
    //       try {
    //         const response = await axios.post(process.env.REACT_APP_API_URL + "auth/checkEmail", {
    //           email: values?.email
    //         });
    //         if (["DIRECT", "GOOGLE"].includes(response?.data?.data?.loginMethod)) {
    //           navigate("/password", {
    //             state: { email: values.email }
    //           });
    //         }

    //         if (response?.data?.data?.loginMethod === "MAGIC" || response?.data?.data?.loginMethod === "GAL_WALLET") {
    //           try {
    //             const token = await magic.auth?.loginWithEmailOTP({
    //               email: values?.email,
    //               showUI: true
    //             });

    //             console.log(token, "token=");

    //             if (token) {
    //               const loginResponse = await axios.post(
    //                 process.env.REACT_APP_API_URL + "auth/magic/login",
    //                 {},
    //                 {
    //                   headers: {
    //                     "Content-Type": "application/json",
    //                     Authorization: `Bearer ${token}`
    //                   }
    //                 }
    //               );

    //               console.log(loginResponse.data.data, "loginResponse.data.data");
    //               dispatch(loginSuccess(loginResponse.data.data));

    //               navigate("/home", {
    //                 state: { social: loginResponse.data.data }
    //               });
    //             }
    //           } catch (error) {
    //             console.log("error", error);
    //             toast.error(error.message);
    //           }
    //         }
    //       } catch (error) {
    //         if (error?.response?.data?.data?.message) {
    //           const message = error?.response?.data?.data?.message;
    //           toast.error(message);
    //           return;
    //         }
    //         toast.error(error.message);
    //       } finally {
    //         await dispatch(setLoader(false));
    //       }
    //     }}
    //   >
    //     {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
    //       <form noValidate onSubmit={handleSubmit} {...others}>
    //         {/* {whitelistError && <div>You are not whitelisted. Please contact the administrator.</div>} */}
    //         <InputLabel
    //           sx={{ color: theme.palette.mode === "dark" ? "white" : "#404040" }}
    //           className="authFont"
    //           htmlFor="outlined-adornment-email-login"
    //         >
    //           Email Address
    //         </InputLabel>
    //         <FormControl
    //           sx={{ ...inputStyles }}
    //           // InputProps={{ ...InputProps }}
    //           className="auth-formcontrol"
    //           fullWidth
    //           error={Boolean(touched.email && errors.email)}
    //         >
    //           <TextField
    //             // sx={{ ...inputStyles }}
    //             InputProps={{ ...InputProps }}
    //             placeholder="email"
    //             className="textForm"
    //             // onChange={(event)=>handelAccount("password",event)}
    //             variant="outlined"
    //             margin="normal"
    //             required
    //             fullWidth
    //             type="email"
    //             value={values.email}
    //             name="email"
    //             autoComplete="current-email"
    //             onBlur={handleBlur}
    //             onChange={handleChange}
    //             inputProps={{}}
    //           />
    //           {touched.email && errors.email && (
    //             <FormHelperText error id="standard-weight-helper-text-email-login">
    //               {errors.email}
    //             </FormHelperText>
    //           )}
    //         </FormControl>

    //         <Box sx={{ mt: 2 }}>
    //           <AnimateButton>
    //             {loader ? (
    //               <Stack sx={{ alignItems: "center" }}>
    //                 <CircularProgress />
    //               </Stack>
    //             ) : (
    //               <Button
    //                 className="signbuttonMarket"
    //                 disableElevation
    //                 disabled={
    //                   isSubmitting || (!restrictApplicationss?.isInEU && !restrictApplicationss?.isInAvailableCountry)
    //                 }
    //                 fullWidth
    //                 size="large"
    //                 type="submit"
    //                 variant="contained"
    //                 color="secondary"
    //               >
    //                 Next
    //               </Button>
    //             )}
    //           </AnimateButton>
    //         </Box>
    //         <Grid item xs={12} sx={{ mt: 2 }}>
    //           <Grid item container direction="column" alignItems="center" xs={12}>
    //             <Typography
    //               className="haveAccount"
    //               component={Link}
    //               to="/email"
    //               variant="subtitle1"
    //               sx={{ textDecoration: "none" }}
    //             >
    //               Don't have an account? <span className="SignupText"> Sign up </span>
    //             </Typography>
    //           </Grid>
    //         </Grid>
    //         {!restrictApplicationss?.isInEU && !restrictApplicationss?.isInAvailableCountry && (
    //           <Box
    //             sx={{
    //               bgcolor: "#FFE2E0",
    //               color: "#000000",
    //               p: 2,
    //               mt: 2,
    //               fontSize: "14px",
    //               display: "flex",
    //               fontWeight: "400",
    //               borderRadius: "4px"
    //             }}
    //           >
    //             <Box sx={{ marginRight: "8px" }}>{Icons.warningIcon}</Box>
    //             <Typography>
    //               The application is unavailable in your country. For assistance, please{" "}
    //               <MuiLink href="mailto:hello@galileoprotocol.io" rel="noopener noreferrer">
    //                 Support Team
    //               </MuiLink>
    //             </Typography>
    //           </Box>
    //         )}

    //         {showSocialMedia && (restrictApplicationss?.isInEU || restrictApplicationss?.isInAvailableCountry) && (
    //           <>
    //             <Grid item xs={12}>
    //               <Grid mt={2} mb={-2} item container direction="column" alignItems="center" xs={12}>
    //                 <Typography
    //                   className="oRsigninwith"
    //                   variant="subtitle1"
    //                   sx={{ textDecoration: "none", fontSize: "16px" }}
    //                 >
    //                   or continue with
    //                 </Typography>
    //               </Grid>
    //             </Grid>
    //             <Grid mt={1} container spacing={gridSpacing}>
    //               <Grid item xs={12}>
    //                 <Grid container spacing={gridSpacing}>
    //                   {/* <Grid item lg={6} md={6} sm={6} xs={6}>
    //                     <Box sx={{ float: { md: 'right', xs: 'right' } }}>
    //                       <ReactFacebookLogin
    //                         appId="851727442768362"
    //                         // autoLoad={true}
    //                         fields="first_name, last_name,email"
    //                         callback={responseFacebook}
    //                         onFailure={responseFacebookFailure}
    //                         cssClass="my-facebook-button-class"
    //                         icon="fa-facebook"
    //                         textButton=""
    //                         width="40px"
    //                       />
    //                     </Box>
    //                   </Grid> */}

    //                   <Grid item lg={12} md={12} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center" }}>
    //                     <Box sx={{ float: { md: "center" } }}>
    //                       <GoogleLogin
    //                         type="standard"
    //                         onSuccess={(data) => {
    //                           // console.log('datafrom google login', data);
    //                           googleAuthHandle(data);
    //                         }}
    //                         onError={() => {
    //                           toast.error("Google Auth Failed");
    //                         }}
    //                       />
    //                     </Box>
    //                   </Grid>
    //                 </Grid>
    //               </Grid>
    //             </Grid>
    //           </>
    //         )}
    //       </form>
    //     )}
    //   </Formik>
    // </>
  );
};

export default Email;
