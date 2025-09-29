import "@fontsource/source-sans-pro";
import { Link } from "react-router-dom";

import "@fontsource/public-sans";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useTheme } from "@mui/material/styles";
import { utils, ethers } from "ethers";
import {
  Box,
  Grid,
  Divider,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  Stack,
  Typography,
  CircularProgress
} from "@mui/material";
import { useLocation } from "react-router-dom";
import TextField from "@material-ui/core/TextField";

import * as Yup from "yup";
import { Formik } from "formik";
import AnimateButton from "ui-component/extended/AnimateButton";
import { signupsocial } from "../../../../redux/auth/actions";
import { useNavigate } from "react-router-dom";
import { setWallet } from "redux/auth/actions";
import { SNACKBAR_OPEN } from "store/actions";
import { CHAIN_IDS, NETWORKS_INFO, SIGNUP_METHODS } from "utils/constants";
import MainCard from "ui-component/cards/MainCard";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginSuccess } from "../../../../redux/auth/actions";
import axios from "axios";
import { createGoogleAnalyticsForSignup } from "utils/googleAnalytics";

const SocialLoginForm = ({ loginProp, referalCode, ...others }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState("");
  const [loader, setLoader] = useState(false);

  const location = useLocation();
  console.log(referalCode, "props referal code");
  console.log(location.state?.social, "state referal code");
  const promptSwitchNetwork = () => {
    window.ethereum
      .request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: NETWORKS_INFO.chainId }]
      })
      .then(() => {
        setTimeout(() => {
          handleConnect();
        }, 1000);
      })
      .catch((error) => {
        if (error.code === 4902) {
          // Chain not added error code
          window.ethereum
            .request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: NETWORKS_INFO.chainId,
                  chainName: NETWORKS_INFO.chainName,
                  nativeCurrency: {
                    name: "MATIC",
                    symbol: "MATIC",
                    decimals: 18
                  },
                  rpcUrls: [NETWORKS_INFO.rpcUrls],
                  blockExplorerUrls: [NETWORKS_INFO.blockExplorerUrl]
                }
              ]
            })
            .then(() => {
              console.log("Added and switched to Polygon mainnet");
              setTimeout(() => {
                handleConnect();
              }, 1000);
            })
            .catch((addError) => {
              console.error("Failed to add and switch to Polygon mainnet:", addError.message);
            });
        } else {
          console.error("Failed to switch to Polygon mainnet:", error.message);
        }
      });
  };

  const handleConnect = async () => {
    if (!window.ethereum) {
      dispatch({
        type: SNACKBAR_OPEN,
        open: true,
        message: "You need to install metamask to proceed.",
        variant: "alert",
        alertSeverity: "info"
      });
      toast.error("You need to install metamask to proceed.");

      return;
    } else if (window?.ethereum?.networkVersion !== CHAIN_IDS.POLYGON_CHAIN_ID) {
      promptSwitchNetwork();

      dispatch({
        type: SNACKBAR_OPEN,
        open: true,
        message: `Please switch to ${NETWORKS_INFO.chainName} network from your metamask`,
        variant: "alert",
        alertSeverity: "info"
      });
      setWalletAddress();
      dispatch(setWallet(null));
    } else {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.listAccounts();

      if (accounts?.length === 0) {
        toast.error("Please add an account");
        return;
      }

      try {
        const response = await window?.ethereum?.request({ method: "eth_requestAccounts" });
        if (response) {
          const addressed = utils?.getAddress(response[0]);
          setWalletAddress(addressed);
          dispatch(setWallet(addressed));
        }
      } catch (e) {
        if (e.code === -32002) {
          toast.error("Please accept request in your metamask");
        }
      }
    }
  };
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
  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{
          firstName: location.state?.social?.user?.firstName,
          lastName: location.state?.social?.user?.lastName,
          email: location.state?.social?.user?.email,
          refCode: referalCode ? referalCode : "",
          walletAddress: "",
          isEuropeanResident: false,
          termsAndConditions: true,
          emailOptIn: true
        }}
        validationSchema={Yup.object().shape({
          firstName: Yup.string()
            .required("First Name is required!")
            .max(42, "First Name can not exceed 42 characters"),
          lastName: Yup.string().required("Last Name is required!").max(42, "Last Name can not exceed 42 characters"),
          // email: Yup.string().email('Enter valid email').max(255).required('Email is required!'),
          // isEuropeanResident: Yup.boolean().oneOf([true])
          termsAndConditions: Yup.boolean().oneOf([true])
          // isWalletSecure: Yup.boolean().oneOf([true])
        })}
        onSubmit={async (values) => {
          setLoader(true);
          if (!location.state?.token) {
            if (walletAddress === "") {
              dispatch({
                type: SNACKBAR_OPEN,
                open: true,
                message: "Please connect to your wallet",
                variant: "alert",
                alertSeverity: "info"
              });
              return;
            }
            setLoader(true);
            dispatch(
              signupsocial({
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                isResidentInEurope: values.isEuropeanResident,
                termsAndConditions: values.termsAndConditions,
                referalCode: values.refCode,
                emailOptIn: values.emailOptIn,
                walletAddress: walletAddress,
                navigate: navigate
              })
            );
          }
          if (location.state?.token) {
            setLoader(true);

            axios
              .post(
                process.env.REACT_APP_API_URL + "auth/magic/login",
                {
                  firstName: values?.firstName,
                  lastName: values?.lastName,
                  isResidentInEurope: values.isEuropeanResident,
                  agreedToTerms: values.termsAndConditions,
                  referalCode: values.refCode
                },
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${location?.state?.token}`
                  }
                }
              )
              .then(function (response) {
                if(values?.refCode){
                  createGoogleAnalyticsForSignup({signupMethod:SIGNUP_METHODS.REFERAL});
                }else{
                  createGoogleAnalyticsForSignup({signupMethod:SIGNUP_METHODS.ORGANIC});
                }
                console.log(response.data.data, "response.data.data");
                dispatch(loginSuccess(response.data.data));

                navigate("/home", {
                  state: { social: response.data.data }
                });
              })
              .catch(function (error) {
                if (error?.response?.data?.data?.message) {
                  setLoader(false);
                  const message = error?.response?.data?.data?.message;
                  toast.error(message);
                  return;
                }

                toast.error(error.message);
              });
          }
          setLoader(false);
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <InputLabel
              sx={{ color: theme.palette.mode === "dark" ? "white" : "#404040" }}
              className="authFont"
              htmlFor="outlined-adornment-email-login"
            >
              First Name{" "}
            </InputLabel>
            <FormControl
              sx={{ ...theme.typography.customInput, ...inputStyles }}
              className="auth-formcontrol"
              fullWidth
              error={Boolean(touched.firstName && errors.firstName)}
            >
              <TextField
                InputProps={{ ...InputProps }}
                placeholder="First Name"
                className="textForm"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                type="name"
                value={values.firstName}
                name="firstName"
                onBlur={handleBlur}
                onChange={handleChange}
                inputProps={{}}
              />
              {touched.firstName && errors.firstName && (
                <FormHelperText error id="standard-weight-helper-text-name-login">
                  {errors.firstName}
                </FormHelperText>
              )}
            </FormControl>

            <InputLabel
              sx={{ color: theme.palette.mode === "dark" ? "white" : "#404040" }}
              className="authFont"
              htmlFor="outlined-adornment-email-login"
            >
              Last Name{" "}
            </InputLabel>
            <FormControl
              sx={{ ...theme.typography.customInput, ...inputStyles }}
              className="auth-formcontrol"
              fullWidth
              error={Boolean(touched.lastName && errors.lastName)}
            >
              <TextField
                InputProps={{ ...InputProps }}
                placeholder="Last Name"
                className="textForm"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                type="lastName"
                value={values.lastName}
                name="lastName"
                onBlur={handleBlur}
                onChange={handleChange}
                inputProps={{}}
              />
              {touched.lastName && errors.lastName && (
                <FormHelperText error id="standard-weight-helper-text-name-login">
                  {errors.lastName}
                </FormHelperText>
              )}
            </FormControl>
            <InputLabel
              sx={{ color: theme.palette.mode === "dark" ? "white" : "#404040" }}
              className="authFont"
              htmlFor="outlined-adornment-email-login"
            >
              Referral Code (Optional)
            </InputLabel>
            <FormControl
              sx={{ ...theme.typography.customInput, ...inputStyles }}
              className="auth-formcontrol"
              fullWidth
            >
              <TextField
                InputProps={{ ...InputProps }}
                className="textForm"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                type="text"
                value={values.refCode}
                name="refCode"
                onBlur={handleBlur}
                onChange={handleChange}
                inputProps={{}}
              />
            </FormControl>
            <>
              <MainCard
                sx={{
                  borderRadius: "4px",
                  p: 2,
                  background: "#181C1F"
                }}
                content={false}
              >
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.isEuropeanResident}
                        onChange={handleChange}
                        name="isEuropeanResident"
                        color="primary"
                      />
                    }
                    label="I am a resident of European Union"
                  />
                </Stack>
                {/* {touched.isEuropeanResident && errors.isEuropeanResident && (
              <FormHelperText sx={{ paddingLeft: "1em" }} error id="standard-weight-helper-text-name-login">
                This is required
              </FormHelperText>
            )} */}
                {/* <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                            <FormControlLabel
                              control={<Checkbox checked={values.isWalletSecure} onChange={handleChange} name="isWalletSecure" color="primary" />}
                              label="The wallet i am registering with is not involved in any Money Laundering or no in the Sanctioned list"
                            />
                          </Stack>
                          {touched.isWalletSecure && errors.isWalletSecure && (
                            <FormHelperText sx={{ paddingLeft: '1em' }} error id="standard-weight-helper-text-name-login">
                              This is required
                            </FormHelperText>
                          )} */}
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.termsAndConditions}
                        onChange={handleChange}
                        name="termsAndConditions"
                        color="primary"
                        sx={{ fontSize: "12px !important" }}
                      />
                    }
                    label={
                      <span>
                        By checking this box, you agree to our
                        <a
                          href="https://galileoprotocol.io"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: "12px !important", color: "#bdc8f0" }}
                        >
                          {" "}
                          Terms and Conditions
                        </a>
                      </span>
                    }
                  />
                </Stack>
                {touched.termsAndConditions && errors.termsAndConditions && (
                  <FormHelperText sx={{ paddingLeft: "1em" }} error id="standard-weight-helper-text-name-login">
                    This is required
                  </FormHelperText>
                )}
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.emailOptIn}
                        onChange={handleChange}
                        name="emailOptIn"
                        color="primary"
                        sx={{ fontSize: "12px !important" }}
                      />
                    }
                    label={
                      <span>
                        Select this box to receive updates and marketing. You can change your preferences at any time as
                        per our Privacy Policy.
                      </span>
                    }
                  />
                </Stack>

                <Box sx={{ mt: "1rem", display: "flex", justifyContent: "center" }}>
                  {!location.state?.token && (
                    <Button variant="contained" onClick={() => handleConnect()}>
                      {walletAddress
                        ? walletAddress.slice(0, 5) + "..." + walletAddress.slice(38, 42)
                        : "Connect with wallet"}
                    </Button>
                  )}

                  {errors.submit && (
                    <Box sx={{ mt: 3 }}>
                      <FormHelperText error>{errors.submit}</FormHelperText>
                    </Box>
                  )}
                </Box>
                {loader === true ? (
                  <Box sx={{ mt: 2 }}>
                    <AnimateButton>
                      <Button fullWidth size="large" variant="text">
                        <CircularProgress style={{ color: "#ffffff5" }} />
                      </Button>
                    </AnimateButton>
                  </Box>
                ) : (
                  <Box sx={{ mt: 2, mb: 2 }}>
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
                        Sign up
                      </Button>
                    </AnimateButton>
                  </Box>
                )}
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12} sx={{ mt: 1 }}>
                  <Grid item container direction="column" alignItems="center" xs={12}>
                    <Typography component={Link} to="/login" variant="subtitle1" sx={{ textDecoration: "none" }}>
                      Already have an account?
                    </Typography>
                  </Grid>
                </Grid>
              </MainCard>
            </>
          </form>
        )}
      </Formik>
    </>
  );
};

export default SocialLoginForm;
